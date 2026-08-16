import cvPdf from './assets/ressources/cv-jagullo-2026.pdf';
import profilePhoto from './assets/ressources/photo-profil.png';
import type { Language } from './config.ts';

export const CV_PDF_URL = cvPdf;
export const PROFILE_PHOTO_URL = profilePhoto;
export const CONTACT_EMAIL = { user: 'contact', domain: 'jagullo.fr' };

export const LEGAL_NOTICE = {
  identity: {
    name: 'Julien Agullo',
    street: 'Rés. Carré Plein Centre',
    address: '2 place au Bois, 65000 Tarbes',
    siret: '52981304000043',
    phone: '+33 7 52 63 77 22',
  },
  paragraphs: {
    fr: [
      "Le site jagullo.fr est optimisé pour les navigateurs de génération récente desktop et mobile (Firefox, Edge, Chrome, Safari, Opera). Le site est hébergé chez l'entreprise OVHcloud (SIREN 424 761 419) domiciliée au 2 rue Kellermann, 59100 Roubaix.",
      "Le présent site constitue une œuvre dont Mr Agullo est l'auteur au sens des articles L.111.1 et suivants du Code de la propriété intellectuelle. Tout le code source du site est disponible en licence MIT sur la plateforme GitHub, à l'exception des images du site. Les photographies, textes, slogans, dessins, images, séquences animées sonores ou non ainsi que toutes les œuvres intégrées dans le site sont la propriété de l'auteur ou de tiers l'ayant autorisé à les utiliser.",
    ],
    en: [
      'The website jagullo.fr is optimized for recent desktop and mobile browsers (Firefox, Edge, Chrome, Safari, Opera). It is hosted by OVHcloud (SIREN 424 761 419), located at 2 rue Kellermann, 59100 Roubaix, France.',
      'This website is a work authored by Mr Agullo within the meaning of articles L.111.1 et seq. of the French Intellectual Property Code. The entire source code is available under the MIT license on GitHub, with the exception of the site images. Photographs, text, taglines, drawings, images, and any animated or audiovisual sequences, as well as any other work embedded in the site, are the property of the author or of third parties who have authorized their use.',
    ],
  } satisfies Record<Language, string[]>,
};
