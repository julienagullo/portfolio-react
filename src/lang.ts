import type { Language } from './config';

const translations = {
  fr: {
    siteTitle: 'Portfolio développeur web - jagullo.fr',
    rooms: {
      OfficeSpace: 'Bureau',
      BreakRoom: 'Détente',
      MeetingRoom: 'Réunion',
    },
    orientationGate: 'Tourne ton appareil en mode paysage pour profiter du site.',
    languageToggle: {
      toEnglish: 'Switch to English',
      toFrench: 'Passer en français',
    },
    fullscreenToggle: {
      enter: 'Passer en plein écran',
      exit: 'Quitter le plein écran',
    },
    soundToggle: {
      mute: 'Couper le son',
      unmute: 'Activer le son',
    },
  },
  en: {
    siteTitle: 'Web developer portfolio - jagullo.fr',
    rooms: {
      OfficeSpace: 'Office',
      BreakRoom: 'Break room',
      MeetingRoom: 'Meeting room',
    },
    orientationGate: 'Rotate your device to landscape to enjoy the site.',
    languageToggle: {
      toEnglish: 'Switch to English',
      toFrench: 'Passer en français',
    },
    fullscreenToggle: {
      enter: 'Enter fullscreen',
      exit: 'Exit fullscreen',
    },
    soundToggle: {
      mute: 'Mute sound',
      unmute: 'Unmute sound',
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