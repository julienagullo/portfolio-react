import { CONTACT_EMAIL } from './contact.ts';
import type { Language } from './config.ts';

export type ProfileFact = {
  label: Record<Language, string>;
  value: Record<Language, string>;
};

export type Profile = {
  summary: Record<Language, string>;
  facts: ProfileFact[];
};

/**
 * Profil général injecté à CHAQUE question du chat (salle de réunion), en plus des chunks RAG.
 *
 * À garder court : il est envoyé à chaque requête. Jamais affiché dans l'UI.
 */
export const PROFILE: Profile = {
  summary: {
    fr: "Julien Agullo, web manager basé à Tarbes, avec près de 20 ans d'expérience dans le web : gestion de projet, développement web (PHP, Symfony, WordPress), optimisation SEO, rédaction web et design.",
    en: 'Julien Agullo, web manager based in Tarbes (France), with nearly 20 years of experience in web: project management, web development (PHP, Symfony, WordPress), SEO, web copywriting and design.',
  },
  facts: [
    {
      label: { fr: 'Poste', en: 'Job title' },
      value: { fr: 'Web manager', en: 'Web manager' },
    },
    {
      label: { fr: 'Localisation', en: 'Location' },
      value: {
        fr: 'Tarbes (Hautes-Pyrénées), secteur Pau et Tarbes',
        en: 'Tarbes (Hautes-Pyrénées, France), Pau and Tarbes area',
      },
    },
    {
      label: { fr: 'Recherche', en: 'Looking for' },
      value: {
        fr: 'Intéressé par un poste salarié (CDI) sur Pau ou Tarbes, avec du télétravail, ainsi que par de courtes missions en freelance',
        en: 'Interested in a salaried position (permanent contract) in Pau or Tarbes, with remote work, as well as short freelance assignments',
      },
    },
    {
      label: { fr: 'Mobilité', en: 'Mobility' },
      value: { fr: 'Permis B, véhiculé', en: "Driver's license, has a car" },
    },
    {
      label: { fr: 'Langues', en: 'Languages' },
      value: { fr: 'Français (langue maternelle), anglais technique', en: 'French (native), technical English' },
    },
    {
      // Même écriture anti-spam "[at]" que dans le modal contact (ContactContent.tsx).
      label: { fr: 'Contact', en: 'Contact' },
      value: {
        fr: `${CONTACT_EMAIL.user} [at] ${CONTACT_EMAIL.domain}, détaillé en cliquant sur le téléphone dans le bureau du portfolio`,
        en: `${CONTACT_EMAIL.user} [at] ${CONTACT_EMAIL.domain}, detailed by clicking the phone in the portfolio's office room`,
      },
    },
    {
      label: { fr: 'CV', en: 'Resume' },
      value: {
        fr: 'Téléchargeable en PDF en cliquant sur le téléphone dans le bureau du portfolio',
        en: "Downloadable as a PDF by clicking the phone in the portfolio's office room",
      },
    },
  ],
};
