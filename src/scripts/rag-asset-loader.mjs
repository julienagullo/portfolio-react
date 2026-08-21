// scripts/rag-asset-loader.mjs
//
// Hook de module Node (voir generate-rag-docs.mjs) : stubbe les imports
// d'assets binaires (images, PDF, audio) pour permettre d'importer
// directement les fichiers TS de contenu sans bundler ni build préalable.

const ASSET_RE = /\.(png|jpe?g|webp|svg|gif|pdf|wav|mp3|ogg)$/;

export async function resolve(specifier, context, nextResolve) {
  if (ASSET_RE.test(specifier)) {
    return { url: `stub-asset:${specifier}`, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('stub-asset:')) {
    return { format: 'module', source: 'export default "";', shortCircuit: true };
  }
  return nextLoad(url, context);
}
