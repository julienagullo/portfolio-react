import { register } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, '../../src');
const OUT_DIR = path.resolve(__dirname, '../../public/rag');

register('./rag-asset-loader.mjs', import.meta.url);

async function loadModule(entryFile) {
  return import(pathToFileURL(path.join(SRC_DIR, entryFile)).href);
}

const escapeMd = (s) => (s ?? '').toString();

// Ajoute le contexte additionnel RAG (ragComment) d'une entrée, s'il existe
// pour cette langue. Jamais affiché dans l'UI, uniquement injecté ici.
function pushRagComment(lines, ragComment, lang) {
  if (ragComment?.[lang]) {
    lines.push('');
    lines.push(escapeMd(ragComment[lang]));
  }
}

// Vue d'ensemble chronologique de toutes les expériences en un seul chunk —
// sans ça, une question générale ("quel est ton parcours ?") ne récupère
// par similarité que les chunks dont le TEXTE répète le plus de mots de la
// question (ex. "Parcours universitaire..." matche très fort "parcours"
// par simple répétition lexicale), au détriment d'une vraie vue d'ensemble
// couvrant toutes les expériences.
function pushCurriculumSummary(lines, curriculum, lang) {
  const t =
    lang === 'fr'
      ? { title: 'Résumé chronologique', current: 'Poste actuel', previous: 'Expériences précédentes', at: 'chez' }
      : { title: 'Chronological summary', current: 'Current position', previous: 'Previous experience', at: 'at' };

  const [current, ...previous] = curriculum;
  const describe = (exp) => `${exp.role[lang]} ${t.at} ${exp.company} (${exp.period})`;

  lines.push(`## ${t.title}`, '');
  lines.push(`${t.current} : ${describe(current)}.`);
  if (previous.length) {
    lines.push(`${t.previous} : ${previous.map(describe).join(' ; ')}.`);
  }
  lines.push('');
}

function renderCurriculum(curriculum, lang) {
  const t =
    lang === 'fr'
      ? { root: 'Parcours professionnel', skills: 'Compétences', project: 'Projet', context: 'Contexte', at: 'chez', link: 'Lien' }
      : { root: 'Professional background', skills: 'Skills', project: 'Project', context: 'Context', at: 'at', link: 'Link' };

  const lines = [`# ${t.root}`, ''];
  pushCurriculumSummary(lines, curriculum, lang);
  for (const exp of curriculum) {
    lines.push(`## ${exp.role[lang]} — ${exp.company} (${exp.period})`);
    lines.push('');
    lines.push(escapeMd(exp.description[lang]));
    pushRagComment(lines, exp.ragComment, lang);
    lines.push('');
    if (exp.skills?.[lang]?.length) {
      lines.push(`**${t.skills} :** ${exp.skills[lang].join(', ')}`);
      lines.push('');
    }
    for (const proj of exp.projects ?? []) {
      const dateSuffix = proj.date ? ` (${proj.date})` : '';
      lines.push(`### ${t.project} — ${proj.title[lang]}${dateSuffix}`);
      lines.push(`_${t.context} : ${exp.role[lang]} ${t.at} ${exp.company}_`);
      lines.push('');
      lines.push(escapeMd(proj.detail[lang]));
      if (proj.url) {
        lines.push('');
        lines.push(`${t.link} : ${proj.url}`);
      }
      lines.push('');
    }
  }
  return lines.join('\n');
}

function renderHobbies({ films, authors, games }, lang) {
  const titles =
    lang === 'fr'
      ? { root: 'Loisirs', films: 'Films préférés', authors: 'Auteurs préférés', games: 'Jeux vidéo préférés', books: 'Livres appréciés' }
      : { root: 'Hobbies', films: 'Favorite films', authors: 'Favorite authors', games: 'Favorite video games', books: 'Favorite books' };

  const lines = [`# ${titles.root}`, '', `## ${titles.films}`, ''];
  for (const f of films) {
    const subtitle = f.subtitle ? ` — ${f.subtitle}` : '';
    lines.push(`### ${f.title}${subtitle} (${f.year})`);
    lines.push(escapeMd(f.description[lang]));
    pushRagComment(lines, f.ragComment, lang);
    lines.push('');
  }

  lines.push(`## ${titles.authors}`, '');
  for (const a of authors) {
    lines.push(`### ${a.author}`);
    lines.push(escapeMd(a.description[lang]));
    pushRagComment(lines, a.ragComment, lang);
    const books = (a.books ?? []).map((b) => (b.year ? `${b.title} (${b.year})` : b.title)).join(', ');
    if (books) {
      lines.push('');
      lines.push(`${titles.books} : ${books}`);
    }
    lines.push('');
  }

  lines.push(`## ${titles.games}`, '');
  for (const g of games) {
    const subtitle = g.subtitle ? ` — ${g.subtitle}` : '';
    lines.push(`### ${g.title}${subtitle} (${g.year})`);
    lines.push(escapeMd(g.description[lang]));
    pushRagComment(lines, g.ragComment, lang);
    lines.push('');
  }

  return lines.join('\n');
}

function renderPortfolioProject(project, lang) {
  const t =
    lang === 'fr'
      ? { root: 'À propos de ce portfolio', stack: 'Stack technique', why: 'Pourquoi React + Babylon.js', ai: 'Assistance IA', repo: 'Dépôt' }
      : { root: 'About this portfolio', stack: 'Tech stack', why: 'Why React + Babylon.js', ai: 'AI assistance', repo: 'Repository' };

  const lines = [`# ${t.root}`, '', escapeMd(project.description[lang]), '', `## ${t.stack}`, ''];
  for (const item of project.stack) {
    lines.push(`### ${item.name}`);
    lines.push(escapeMd(item.description[lang]));
    lines.push('');
  }

  lines.push(`## ${t.why}`, '', escapeMd(project.whyReactBabylon[lang]), '');
  lines.push(`## ${t.ai}`, '', escapeMd(project.aiAssistance[lang]), '');
  lines.push(`${t.repo} : ${project.repoUrl}`, '');

  return lines.join('\n');
}

async function main() {
  const { CURRICULUM } = await loadModule('config/curriculum.ts');
  const { FAVORITE_FILMS, FAVORITE_AUTHORS, FAVORITE_GAMES } = await loadModule('config/hobbies.ts');
  const { PORTFOLIO_PROJECT } = await loadModule('config/portfolio.ts');

  mkdirSync(OUT_DIR, { recursive: true });

  for (const lang of ['fr', 'en']) {
    const doc = [
      renderCurriculum(CURRICULUM, lang),
      '',
      '---',
      '',
      renderHobbies({ films: FAVORITE_FILMS, authors: FAVORITE_AUTHORS, games: FAVORITE_GAMES }, lang),
      '',
      '---',
      '',
      renderPortfolioProject(PORTFOLIO_PROJECT, lang),
    ].join('\n');

    const outPath = path.join(OUT_DIR, `portfolio-${lang}.md`);
    writeFileSync(outPath, doc, 'utf-8');
    console.log(`Écrit : ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
