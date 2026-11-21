import logoAffinity from '../assets/ressources/skills/logo-affinity.png';
import logoAnalytics from '../assets/ressources/skills/logo-analytics.png';
import logoApache from '../assets/ressources/skills/logo-apache.png';
import logoBootstrap from '../assets/ressources/skills/logo-bootstrap.png';
import logoClaudecode from '../assets/ressources/skills/logo-claude.png';
import logoComposer from '../assets/ressources/skills/logo-composer.png';
import logoGit from '../assets/ressources/skills/logo-git.png';
import logoGithub from '../assets/ressources/skills/logo-github.png';
import logoHtml5 from '../assets/ressources/skills/logo-html5.png';
import logoIis from '../assets/ressources/skills/logo-iis.png';
import logoJavascript from '../assets/ressources/skills/logo-javascript.png';
import logoLess from '../assets/ressources/skills/logo-less.png';
import logoLinux from '../assets/ressources/skills/logo-linux.png';
import logoMariadb from '../assets/ressources/skills/logo-mariadb.png';
import logoMysql from '../assets/ressources/skills/logo-mysql.png';
import logoNodejs from '../assets/ressources/skills/logo-nodejs.png';
import logoNpm from '../assets/ressources/skills/logo-npm.png';
import logoPhotoshop from '../assets/ressources/skills/logo-photoshop.png';
import logoPhp from '../assets/ressources/skills/logo-php.png';
import logoPhpstorm from '../assets/ressources/skills/logo-phpstorm.png';
import logoPostman from '../assets/ressources/skills/logo-postman.png';
import logoReact from '../assets/ressources/skills/logo-react.png';
import logoSass from '../assets/ressources/skills/logo-sass.png';
import logoSql from '../assets/ressources/skills/logo-sql.png';
import logoStimulus from '../assets/ressources/skills/logo-stimulus.png';
import logoSymfony from '../assets/ressources/skills/logo-symfony.png';
import logoUbersuggest from '../assets/ressources/skills/logo-ubersuggest.png';
import logoWoocommerce from '../assets/ressources/skills/logo-woocommerce.png';
import logoVscode from '../assets/ressources/skills/logo-vscode.png';
import logoWordpress from '../assets/ressources/skills/logo-wordpress.png';
import type { Language } from './config.ts';

export type SkillAccent = 'blue' | 'orange' | 'green' | 'red' | 'yellow';
export type SkillCategoryId = 'languages' | 'frameworks' | 'systems' | 'tools' | 'design';

export type SkillItem = {
  name: string;
  logo: string;
  desc: Record<Language, string>;
};

export type SkillCategory = {
  id: SkillCategoryId;
  title: Record<Language, string>;
  accent: SkillAccent;
  items: SkillItem[];
  ragComment?: Record<Language, string>;
  ragKeywords?: Record<Language, string[]>;
};

/**
 * Catégories calquées sur la rubrique « Connaissances » du CV PDF
 * (Langages / Frameworks & CMS / Systèmes / Outils), plus Design & analyse.
 */
export const SKILLS: SkillCategory[] = [
  {
    id: 'languages',
    title: { fr: 'Langages', en: 'Languages' },
    accent: 'blue',
    ragKeywords: {
      fr: ['langages de programmation', 'compétences techniques', 'stack', 'développement web', 'front-end', 'back-end'],
      en: ['programming languages', 'technical skills', 'stack', 'web development', 'front-end', 'back-end'],
    },
    items: [
      {
        name: 'PHP',
        logo: logoPhp,
        desc: {
          fr: 'Langage de programmation côté serveur pour sites et API',
          en: 'Server-side programming language for websites and APIs',
        },
      },
      {
        name: 'JavaScript',
        logo: logoJavascript,
        desc: {
          fr: 'Langage de programmation côté client et serveur',
          en: 'Client and server-side programming language',
        },
      },
      {
        name: 'SQL',
        logo: logoSql,
        desc: {
          fr: 'Langage de requête pour interroger les bases de données',
          en: 'Query language for working with databases',
        },
      },
      {
        name: 'HTML5',
        logo: logoHtml5,
        desc: {
          fr: 'Langage de balisage pour structurer les pages web',
          en: 'Markup language to structure web pages',
        },
      },
      {
        name: 'Sass',
        logo: logoSass,
        desc: {
          fr: 'Préprocesseur CSS pour des feuilles de style modulaires',
          en: 'CSS preprocessor for modular stylesheets',
        },
      },
      {
        name: 'Less',
        logo: logoLess,
        desc: {
          fr: 'Préprocesseur CSS avec variables et mixins',
          en: 'CSS preprocessor with variables and mixins',
        },
      },
    ],
  },
  {
    id: 'frameworks',
    title: { fr: 'Frameworks & CMS', en: 'Frameworks & CMS' },
    accent: 'orange',
    ragKeywords: {
      fr: ['frameworks', 'bibliothèques', 'CMS', 'e-commerce', 'stack', 'développement web'],
      en: ['frameworks', 'libraries', 'CMS', 'e-commerce', 'stack', 'web development'],
    },
    items: [
      {
        name: 'Symfony',
        logo: logoSymfony,
        desc: {
          fr: 'Framework PHP pour le développement web',
          en: 'PHP framework for web development',
        },
      },
      {
        name: 'Stimulus',
        logo: logoStimulus,
        desc: {
          fr: 'Framework JavaScript léger pour enrichir le HTML',
          en: 'Lightweight JavaScript framework to enhance HTML',
        },
      },
      {
        name: 'React',
        logo: logoReact,
        desc: {
          fr: 'Bibliothèque JavaScript pour interfaces déclaratives',
          en: 'JavaScript library for declarative interfaces',
        },
      },
      {
        name: 'Bootstrap',
        logo: logoBootstrap,
        desc: {
          fr: 'Framework CSS pour interfaces responsive',
          en: 'CSS framework for responsive interfaces',
        },
      },
      {
        name: 'WordPress',
        logo: logoWordpress,
        desc: {
          fr: 'Système de gestion de contenu pour sites',
          en: 'Content management system for websites',
        },
      },
      {
        name: 'WooCommerce',
        logo: logoWoocommerce,
        desc: {
          fr: 'Extension e-commerce pour WordPress',
          en: 'E-commerce plugin for WordPress',
        },
      },
    ],
  },
  {
    id: 'systems',
    title: { fr: 'Systèmes', en: 'Systems' },
    accent: 'green',
    ragKeywords: {
      fr: ['serveurs', 'bases de données', 'hébergement', 'infrastructure', 'environnement serveur'],
      en: ['servers', 'databases', 'hosting', 'infrastructure', 'server environment'],
    },
    items: [
      {
        name: 'Apache',
        logo: logoApache,
        desc: {
          fr: 'Serveur HTTP pour héberger sites et applications',
          en: 'HTTP server to host websites and applications',
        },
      },
      {
        name: 'IIS',
        logo: logoIis,
        desc: {
          fr: 'Serveur web de Microsoft pour environnements Windows',
          en: "Microsoft's web server for Windows environments",
        },
      },
      {
        name: 'Node.js',
        logo: logoNodejs,
        desc: {
          fr: 'Environnement d\'exécution JavaScript côté serveur',
          en: 'Server-side JavaScript runtime',
        },
      },
      {
        name: 'Linux',
        logo: logoLinux,
        desc: {
          fr: "Système d'exploitation libre pour serveurs et postes",
          en: 'Open source operating system for servers and workstations',
        },
      },
      {
        name: 'MySQL',
        logo: logoMysql,
        desc: {
          fr: 'Serveur de bases de données pour le contenu dynamique',
          en: 'Database server for dynamic content',
        },
      },
      {
        name: 'MariaDB',
        logo: logoMariadb,
        desc: {
          fr: 'Serveur de bases de données, alternative à MySQL',
          en: 'Database server, alternative to MySQL',
        },
      },
    ],
  },
  {
    id: 'tools',
    title: { fr: 'Outils', en: 'Tools' },
    accent: 'red',
    ragKeywords: {
      fr: ['logiciels', 'environnement de travail', 'IDE', 'outils de développement', 'versionnement', 'IA'],
      en: ['software', 'work environment', 'IDE', 'development tools', 'version control', 'AI'],
    },
    items: [
      {
        name: 'Claude Code',
        logo: logoClaudecode,
        desc: {
          fr: 'Agent IA pour assister le développement',
          en: 'AI agent to assist software development',
        },
      },
      {
        name: 'Postman',
        logo: logoPostman,
        desc: {
          fr: "Logiciel d'aide à la création et au test d'API",
          en: 'Software to help build and test APIs',
        },
      },
      {
        name: 'Git',
        logo: logoGit,
        desc: {
          fr: 'Système de gestion de versions du code source',
          en: 'Source code version control system',
        },
      },
      {
        name: 'GitHub',
        logo: logoGithub,
        desc: {
          fr: "Plateforme d'hébergement de projets Git",
          en: 'Git project hosting platform',
        },
      },
      {
        name: 'npm',
        logo: logoNpm,
        desc: {
          fr: 'Gestionnaire de paquets pour JavaScript',
          en: 'Package manager for JavaScript',
        },
      },
      {
        name: 'Composer',
        logo: logoComposer,
        desc: {
          fr: 'Gestionnaire de dépendances pour PHP',
          en: 'Dependency manager for PHP',
        },
      },
      {
        name: 'PhpStorm',
        logo: logoPhpstorm,
        desc: {
          fr: 'Environnement de développement dédié au web',
          en: 'IDE dedicated to web development',
        },
      },
      {
        name: 'VS Code',
        logo: logoVscode,
        desc: {
          fr: 'Éditeur de code léger et extensible',
          en: 'Lightweight and extensible code editor',
        },
      },
    ],
  },
  {
    id: 'design',
    title: { fr: 'Design & analyse', en: 'Design & analytics' },
    accent: 'yellow',
    ragKeywords: {
      fr: ['graphisme', 'référencement', 'SEO', "analyse d'audience", 'UI/UX', 'conception graphique'],
      en: ['graphics', 'SEO', 'search engine optimization', 'audience analytics', 'UI/UX', 'graphic design'],
    },
    items: [
      {
        name: 'Photoshop',
        logo: logoPhotoshop,
        desc: {
          fr: "Retouche d'images et conception graphique",
          en: 'Image editing and graphic design',
        },
      },
      {
        name: 'Affinity',
        logo: logoAffinity,
        desc: {
          fr: "Suite graphique alternative pour l'édition",
          en: 'Alternative graphic suite for editing',
        },
      },
      {
        name: 'Analytics',
        logo: logoAnalytics,
        desc: {
          fr: "Analyse d'audience pour un site ou une application",
          en: 'Audience analytics for websites and apps',
        },
      },
      {
        name: 'Ubersuggest',
        logo: logoUbersuggest,
        desc: {
          fr: 'Analyse des mots-clés et du positionnement sur les moteurs',
          en: 'Keyword and search ranking research tool',
        },
      },
    ],
  },
];
