import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const RAG_DIR = path.resolve(ROOT, 'public/rag');
const EMBEDDING_MODEL = 'mistral-embed';

process.loadEnvFile(path.join(ROOT, '.env'));

const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) {
  console.error('MISTRAL_API_KEY manquant dans .env');
  process.exit(1);
}

/**
 * Découpe le markdown généré par generate-rag-docs.mjs en chunks cohérents :
 * un chunk pour le texte direct sous chaque `##` (description, ragComment,
 * compétences), un chunk par `###` (chaque projet/film/auteur/jeu), préfixé
 * par son titre `##` parent pour garder le contexte.
 */
function chunkMarkdown(content) {
  const chunks = [];
  let h2 = '';
  let h2Buffer = [];
  let h3Title = null;
  let h3Buffer = [];

  const flushH2Intro = () => {
    const text = h2Buffer.join('\n').trim();
    if (text) chunks.push(`${h2}\n\n${text}`);
    h2Buffer = [];
  };

  const flushH3 = () => {
    if (h3Title) {
      const text = h3Buffer.join('\n').trim();
      chunks.push(`${h2}\n${h3Title}\n\n${text}`);
    }
    h3Title = null;
    h3Buffer = [];
  };

  for (const line of content.split('\n')) {
    if (line.trim() === '---') continue;

    if (line.startsWith('# ')) {
      flushH3();
      flushH2Intro();
      h2 = '';
    } else if (line.startsWith('## ')) {
      flushH3();
      flushH2Intro();
      h2 = line;
    } else if (line.startsWith('### ')) {
      flushH3();
      flushH2Intro();
      h3Title = line;
    } else if (h3Title) {
      h3Buffer.push(line);
    } else {
      h2Buffer.push(line);
    }
  }
  flushH3();
  flushH2Intro();

  return chunks.map((c) => c.trim()).filter(Boolean);
}

// Vecteur unitaire (norme 1) : permet à Retriever.php de calculer la
// similarité cosinus comme un simple produit scalaire au moment de la
// requête, sans recalculer la norme des documents à chaque question.
function normalize(vector) {
  const norm = Math.sqrt(vector.reduce((sum, x) => sum + x * x, 0));
  return norm === 0 ? vector : vector.map((x) => x / norm);
}

async function embedChunks(chunks) {
  const res = await fetch('https://api.mistral.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: chunks }),
  });

  if (!res.ok) {
    throw new Error(`API embeddings en erreur (${res.status}) : ${await res.text()}`);
  }

  const json = await res.json();
  return json.data.map((d) => d.embedding);
}

async function main() {
  for (const lang of ['fr', 'en']) {
    const mdPath = path.join(RAG_DIR, `portfolio-${lang}.md`);
    const content = readFileSync(mdPath, 'utf-8');
    const chunks = chunkMarkdown(content);

    console.log(`${lang} : ${chunks.length} chunks, génération des embeddings...`);
    const embeddings = await embedChunks(chunks);

    const data = chunks.map((text, i) => ({ text, embedding: normalize(embeddings[i]) }));
    const outPath = path.join(RAG_DIR, `embeddings-${lang}.json`);
    writeFileSync(outPath, JSON.stringify(data), 'utf-8');
    console.log(`Écrit : ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
