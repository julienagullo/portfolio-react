import type { Language } from './config.ts';

// Contenu dédié au RAG du chat, décrivant ce portfolio lui-même (pas
// l'auteur) — jamais affiché dans l'UI, uniquement consommé par
// generate-rag-docs.mjs. Sans ça, une question comme "en quoi tu as fait ton
// portfolio ?" ne trouve aucun chunk pertinent dans le corpus (qui ne couvre
// que le CV et les loisirs), et l'agent part sur ses propres suppositions.

export type PortfolioStackItem = {
  name: string;
  description: Record<Language, string>;
};

export type PortfolioProject = {
  description: Record<Language, string>;
  stack: PortfolioStackItem[];
  whyReactBabylon: Record<Language, string>;
  aiAssistance: Record<Language, string>;
  repoUrl: string;
};

export const PORTFOLIO_PROJECT: PortfolioProject = {
  description: {
    fr: "Ce portfolio est un diorama pixel art en 3D, navigable entre 3 salles (bureau, détente, réunion) avec une caméra qui pivote légèrement au mouvement de la souris. Le code source est public.",
    en: 'This portfolio is a 3D pixel-art diorama, browsable across 3 rooms (office, lounge, meeting room) with a camera that rotates slightly on mouse move. The source code is public.',
  },
  stack: [
    {
      name: 'React 19 + TypeScript + Vite',
      description: {
        fr: 'Base du projet : composants React pour toute la couche UI (miniatures, modals, chat), typage strict avec TypeScript, Vite pour le build.',
        en: 'Project foundation: React components for the whole UI layer (thumbnails, modals, chat), strict typing with TypeScript, Vite for the build.',
      },
    },
    {
      name: 'Babylon.js via react-babylonjs',
      description: {
        fr: "Moteur de rendu 3D pour la scène diorama, intégré en JSX déclaratif (react-babylonjs) plutôt qu'en Babylon.js vanilla : montre l'intégration d'un moteur de rendu impératif dans un paradigme déclaratif React, un vrai exercice d'architecture.",
        en: '3D rendering engine for the diorama scene, integrated via declarative JSX (react-babylonjs) rather than vanilla Babylon.js: demonstrates integrating an imperative rendering engine into React\'s declarative paradigm, a real architecture exercise.',
      },
    },
    {
      name: 'Howler.js',
      description: {
        fr: 'Ambiances sonores par salle (en fondu au changement de salle) et effets sonores sur les interactions, pilotés depuis un contexte React global.',
        en: 'Per-room ambient sound (crossfaded on room change) and interaction sound effects, driven from a global React context.',
      },
    },
    {
      name: 'Mistral AI — chat RAG',
      description: {
        fr: "Le chat de la salle de réunion (celui auquel tu parles en ce moment) : recherche par similarité sur des embeddings pré-calculés à partir du CV et des loisirs, contexte injecté dans le prompt d'un agent Mistral, réponses en streaming. Backend PHP, jamais d'appel direct au LLM depuis le navigateur.",
        en: 'The meeting room chat (the one you are talking to right now): similarity search over embeddings pre-computed from the CV and hobbies, context injected into a Mistral agent prompt, streamed responses. PHP backend, no direct LLM call from the browser.',
      },
    },
  ],
  whyReactBabylon: {
    fr: "Le repo étant public, ce portfolio sert aussi de démonstrateur technique : React + react-babylonjs a été préféré à Babylon.js seul car la stack reste directement lisible par la plupart des lecteurs techniques (React domine l'écosystème front en entreprise), tout en montrant une vraie gestion d'état unifiée entre la scène 3D et l'UI HTML.",
    en: 'Since the repo is public, this portfolio also works as a technical showcase: React + react-babylonjs was preferred over plain Babylon.js because the stack stays directly readable by most technical reviewers (React dominates the front-end ecosystem in the industry), while still demonstrating real, unified state management between the 3D scene and the HTML UI.',
  },
  aiAssistance: {
    fr: "Développé avec l'assistance de Claude Code (Anthropic) pour l'implémentation, le mixage sonore et la traduction FR/EN — sous la supervision et la direction technique de l'auteur (architecture, choix produits et arbitrages).",
    en: "Built with the assistance of Claude Code (Anthropic) for implementation, sound mixing, and FR/EN translation — under the author's supervision and technical direction (architecture, product choices, and trade-offs).",
  },
  repoUrl: 'https://github.com/julienagullo/portfolio-react',
};
