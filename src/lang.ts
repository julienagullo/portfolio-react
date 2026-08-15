import type { Language } from './config';

const translations = {
  fr: {
    siteTitle: 'Portfolio développeur web - jagullo.fr',
    rooms: {
      OfficeSpace: 'Bureau',
      BreakRoom: 'Détente',
      MeetingRoom: 'Réunion',
    },
    loading: 'Chargement du bureau',
    languageToggle: 'Passer en anglais',
    roomMenuToggle: 'Menu des salles',
    closeButton: 'Fermer',
    fullscreenToggle: {
      enter: 'Passer en plein écran',
      exit: 'Quitter le plein écran',
    },
    soundToggle: {
      mute: 'Couper le son',
      unmute: 'Activer le son',
    },
    githubButton: {
      label: 'Dépôt Git',
    },
    items: {
      office_books: 'Compétences',
      office_phone: 'Contact',
      office_computer: 'Curriculum',
      break_dvd: 'Films',
      break_books: 'Romans',
      break_console: 'Jeux indés',
      meeting_robot: 'À propos',
    },
  },
  en: {
    siteTitle: 'Web developer portfolio - jagullo.fr',
    rooms: {
      OfficeSpace: 'Office',
      BreakRoom: 'Break room',
      MeetingRoom: 'Meeting room',
    },
    loading: 'Loading the office',
    languageToggle: 'Switch to French',
    roomMenuToggle: 'Rooms menu',
    closeButton: 'Close',
    fullscreenToggle: {
      enter: 'Enter fullscreen',
      exit: 'Exit fullscreen',
    },
    soundToggle: {
      mute: 'Mute sound',
      unmute: 'Unmute sound',
    },
    githubButton: {
      label: 'Git repository',
    },
    items: {
      office_books: 'Skills',
      office_phone: 'Contact',
      office_computer: 'Curriculum',
      break_dvd: 'Movies',
      break_books: 'Novels',
      break_console: 'Indie games',
      meeting_robot: 'About',
    },
  },
} as const satisfies Record<Language, unknown>;

type Dictionary = (typeof translations)['fr'];

type DotPath<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPath<T[K]>}`;
    }[keyof T & string];

export type TranslationKey = DotPath<Dictionary>;

export function t(language: Language, key: TranslationKey): string {
  const value = key
    .split('.')
    .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)[part], translations[language]);

  return value as string;
}