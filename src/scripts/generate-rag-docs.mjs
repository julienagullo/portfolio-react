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

// Injecte le ragComment d'une entrée (contexte RAG seul, jamais affiché dans l'UI).
function pushRagComment(lines, ragComment, lang) {
  if (ragComment?.[lang]) {
    lines.push('');
    lines.push(escapeMd(ragComment[lang]));
  }
}

// Injecte les synonymes/formulations alternatives d'une entrée (RAG uniquement, jamais affiché dans l'UI) :
// rapproche l'embedding du chunk de questions qui n'emploient pas les mots exacts du contenu.
function pushRagKeywords(lines, ragKeywords, lang) {
  if (ragKeywords?.[lang]?.length) {
    const label = lang === 'fr' ? 'Mots-clés' : 'Keywords';
    lines.push('');
    lines.push(`${label} : ${ragKeywords[lang].join(', ')}`);
  }
}

// Chunk d'aperçu listant tous les loisirs + synonymes de la catégorie elle-même : sans lui, aucun chunk ne
// contient jamais "loisirs/hobbies/centres d'intérêt" (le titre `# Loisirs` est jeté par chunkMarkdown, qui ne
// garde que le texte sous les `##`/`###`), donc une question générale sans nom d'item précis ne matche rien.
function pushHobbiesSummary(lines, { films, authors, openSource }, lang) {
  const t =
    lang === 'fr'
      ? {
          title: 'Aperçu des loisirs',
          films: 'Films appréciés',
          authors: 'Auteurs appréciés',
          openSource: 'Projets open source',
          keywords: ["centres d'intérêt", 'loisirs', 'passe-temps', 'temps libre', 'hobbies', 'open source', 'projets personnels'],
        }
      : {
          title: 'Hobbies overview',
          films: 'Favorite films',
          authors: 'Favorite authors',
          openSource: 'Open source projects',
          keywords: ['interests', 'hobbies', 'pastimes', 'leisure', 'free time', 'open source', 'side projects'],
        };

  lines.push(`## ${t.title}`, '');
  lines.push(`${t.films} : ${films.map((f) => f.title).join(', ')}.`);
  lines.push(`${t.authors} : ${authors.map((a) => a.author).join(', ')}.`);
  lines.push(`${t.openSource} : ${openSource.map((p) => p.title).join(', ')}.`);
  pushRagKeywords(lines, { [lang]: t.keywords }, lang);
  lines.push('');
}

// Vue d'ensemble en un seul chunk, pour que les questions générales ("quel est ton parcours ?") remontent bien par similarité.
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
    pushRagKeywords(lines, exp.ragKeywords, lang);
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

function renderHobbies({ films, authors, openSource }, lang) {
  const titles =
    lang === 'fr'
      ? { root: 'Loisirs', films: 'Films préférés', authors: 'Auteurs préférés', openSource: 'Projets open source', books: 'Livres appréciés', skills: 'Compétences', link: 'Lien' }
      : { root: 'Hobbies', films: 'Favorite films', authors: 'Favorite authors', openSource: 'Open source projects', books: 'Favorite books', skills: 'Skills', link: 'Link' };

  const lines = [`# ${titles.root}`, ''];
  pushHobbiesSummary(lines, { films, authors, openSource }, lang);
  lines.push(`## ${titles.films}`, '');
  for (const f of films) {
    const subtitle = f.subtitle ? ` — ${f.subtitle}` : '';
    lines.push(`### ${f.title}${subtitle} (${f.year})`);
    lines.push(escapeMd(f.description[lang]));
    pushRagComment(lines, f.ragComment, lang);
    pushRagKeywords(lines, f.ragKeywords, lang);
    lines.push('');
  }

  lines.push(`## ${titles.authors}`, '');
  for (const a of authors) {
    lines.push(`### ${a.author}`);
    lines.push(escapeMd(a.description[lang]));
    pushRagComment(lines, a.ragComment, lang);
    pushRagKeywords(lines, a.ragKeywords, lang);
    const books = (a.books ?? []).map((b) => (b.year ? `${b.title} (${b.year})` : b.title)).join(', ');
    if (books) {
      lines.push('');
      lines.push(`${titles.books} : ${books}`);
    }
    lines.push('');
  }

  lines.push(`## ${titles.openSource}`, '');
  for (const p of openSource) {
    const subtitle = p.subtitle ? ` — ${p.subtitle}` : '';
    lines.push(`### ${p.title}${subtitle}${p.year ? ` (${p.year})` : ''}`);
    lines.push(escapeMd(p.description[lang]));
    if (p.skills?.length) lines.push(`${titles.skills} : ${p.skills.join(', ')}`);
    if (p.url) lines.push(`${titles.link} : ${p.url}`);
    pushRagComment(lines, p.ragComment, lang);
    pushRagKeywords(lines, p.ragKeywords, lang);
    lines.push('');
  }

  return lines.join('\n');
}

function renderSkills(skills, lang) {
  const t = lang === 'fr' ? { root: 'Compétences' } : { root: 'Skills' };

  const lines = [`# ${t.root}`, ''];
  for (const category of skills) {
    lines.push(`## ${category.title[lang]}`);
    pushRagComment(lines, category.ragComment, lang);
    pushRagKeywords(lines, category.ragKeywords, lang);
    lines.push('');
    for (const item of category.items) {
      lines.push(`### ${item.name}`);
      lines.push(escapeMd(item.desc[lang]));
      lines.push('');
    }
  }
  return lines.join('\n');
}

function renderPortfolioProject(project, lang) {
  const t =
    lang === 'fr'
      ? { root: 'À propos de ce portfolio', stack: 'Stack technique', why: 'Pourquoi React + Babylon.js', ai: 'Assistance IA' }
      : { root: 'About this portfolio', stack: 'Tech stack', why: 'Why React + Babylon.js', ai: 'AI assistance' };

  const lines = [`# ${t.root}`, '', escapeMd(project.description[lang]), '', `## ${t.stack}`, ''];
  for (const item of project.stack) {
    lines.push(`### ${item.name}`);
    lines.push(escapeMd(item.description[lang]));
    lines.push('');
  }

  lines.push(`## ${t.why}`, '', escapeMd(project.whyReactBabylon[lang]), '');
  lines.push(`## ${t.ai}`, '', escapeMd(project.aiAssistance[lang]), '');

  return lines.join('\n');
}

async function main() {
  const { CURRICULUM } = await loadModule('config/curriculum.ts');
  const { FAVORITE_FILMS, FAVORITE_AUTHORS, OPEN_SOURCE_PROJECTS } = await loadModule('config/hobbies.ts');
  const { PORTFOLIO_PROJECT } = await loadModule('config/portfolio.ts');
  const { SKILLS } = await loadModule('config/skills.ts');

  mkdirSync(OUT_DIR, { recursive: true });

  for (const lang of ['fr', 'en']) {
    const doc = [
      renderCurriculum(CURRICULUM, lang),
      '',
      '---',
      '',
      renderSkills(SKILLS, lang),
      '',
      '---',
      '',
      renderHobbies({ films: FAVORITE_FILMS, authors: FAVORITE_AUTHORS, openSource: OPEN_SOURCE_PROJECTS }, lang),
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
