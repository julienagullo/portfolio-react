import logoAffinity from '../assets/ressources/skills/logo-affinity.png';
import logoAnalytics from '../assets/ressources/skills/logo-analytics.png';
import logoBootstrap from '../assets/ressources/skills/logo-bootstrap.png';
import logoClaudecode from '../assets/ressources/skills/logo-claude.png';
import logoGithub from '../assets/ressources/skills/logo-github.png';
import logoJavascript from '../assets/ressources/skills/logo-javascript.png';
import logoMariadb from '../assets/ressources/skills/logo-mariadb.png';
import logoMysql from '../assets/ressources/skills/logo-mysql.png';
import logoPhotoshop from '../assets/ressources/skills/logo-photoshop.png';
import logoPhp from '../assets/ressources/skills/logo-php.png';
import logoPhpstorm from '../assets/ressources/skills/logo-phpstorm.png';
import logoPostman from '../assets/ressources/skills/logo-postman.png';
import logoReact from '../assets/ressources/skills/logo-react.png';
import logoSymfony from '../assets/ressources/skills/logo-symfony.png';
import logoUbersuggest from '../assets/ressources/skills/logo-ubersuggest.png';
import logoWordpress from '../assets/ressources/skills/logo-wordpress.png';
import type { Language } from './config.ts';

export type SkillAccent = 'blue' | 'orange' | 'green';
export type SkillCategoryId = 'dev' | 'design' | 'tools';

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
};

export const SKILLS: SkillCategory[] = [
  {
    id: 'dev',
    title: { fr: 'Développement', en: 'Development' },
    accent: 'blue',
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
        name: 'Symfony',
        logo: logoSymfony,
        desc: {
          fr: 'Framework PHP pour le développement web',
          en: 'PHP framework for web development',
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
    id: 'design',
    title: { fr: 'Design & analyse', en: 'Design & analytics' },
    accent: 'orange',
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
  {
    id: 'tools',
    title: { fr: 'Outils', en: 'Tools' },
    accent: 'green',
    items: [
      {
        name: 'PhpStorm',
        logo: logoPhpstorm,
        desc: {
          fr: 'Environnement de développement dédié au web',
          en: 'IDE dedicated to web development',
        },
      },
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
        name: 'GitHub',
        logo: logoGithub,
        desc: {
          fr: 'Plateforme d\'hébergement de projets Git',
          en: 'Git project hosting platform',
        },
      },
    ],
  },
];
