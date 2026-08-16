import adBestas from './assets/ressources/hobbies/ad-bestas.png';
import auRevoirLaHaut from './assets/ressources/hobbies/au-revoir-la-haut.png';
import balatro from './assets/ressources/hobbies/balatro.png';
import dredge from './assets/ressources/hobbies/dredge.png';
import endling from './assets/ressources/hobbies/endling.png';
import gambonanza from './assets/ressources/hobbies/gambonanza.png';
import ilEtait2Fois from './assets/ressources/hobbies/il-etait-2-fois.png';
import inscryption from './assets/ressources/hobbies/inscryption.png';
import jeVerraiToujoursVosVisages from './assets/ressources/hobbies/je-verrai-toujours-vos-visages.png';
import laDerniereChasse from './assets/ressources/hobbies/la-derniere-chasse.png';
import lEmpireDesLoups from './assets/ressources/hobbies/l-empire-des-loups.png';
import leComteDeMonteCristo from './assets/ressources/hobbies/le-comte-de-monte-cristo.png';
import leGrandMonde from './assets/ressources/hobbies/le-grand-monde.png';
import leSerpentMajuscule from './assets/ressources/hobbies/le-serpent-majuscule.png';
import leSilence from './assets/ressources/hobbies/le-silence.png';
import leVolDesCigognes from './assets/ressources/hobbies/le-vol-des-cigognes.png';
import lesPromises from './assets/ressources/hobbies/les-promises.png';
import norferville from './assets/ressources/hobbies/norferville.png';
import obsession from './assets/ressources/hobbies/obsession.png';
import pandemia from './assets/ressources/hobbies/pandemia.png';
import shutterIsland from './assets/ressources/hobbies/shutter-island.png';
import theDrifter from './assets/ressources/hobbies/the-drifter.png';
import theFather from './assets/ressources/hobbies/the-father.png';
import trainDEnferPourAngeRouge from './assets/ressources/hobbies/train-d-enfer-pour-ange-rouge.png';
import troisJoursEtUneVie from './assets/ressources/hobbies/trois-jours-et-une-vie.png';
import unDernierVerreAvantLaGuerre from './assets/ressources/hobbies/un-dernier-verre-avant-la-guerre.png';
import uneBatailleApresLAutre from './assets/ressources/hobbies/une-bataille-apres-l-autre.png';
import unPaysALAube from './assets/ressources/hobbies/un-pays-a-l-aube.png';
import type { Language } from './config.ts';

export type HobbyItem = {
  year: number;
  title: string;
  subtitle?: string;
  description: Record<Language, string>;
  image?: string;
  url?: string;
};

export type FavoriteBook = {
  title: string;
  year?: number;
  image?: string;
};

export type BookAuthorEntry = {
  author: string;
  description: Record<Language, string>;
  books: FavoriteBook[];
};

export const FAVORITE_FILMS: HobbyItem[] = [
  {
    year: 2026,
    title: 'Obsession',
    subtitle: 'Curry Barker',
    description: {
      fr: "Un très bon film d'horreur dans la lignée de It Follows, La Main, Smile, etc.",
      en: 'A really good horror film in the vein of It Follows, La Main, Smile, and the like.',
    },
    image: obsession,
  },
  {
    year: 2025,
    title: "Une bataille après l'autre",
    subtitle: 'Paul Thomas Anderson',
    description: {
      fr: "Un thriller d'une grande maîtrise, porté par une interprétation magistrale.",
      en: 'A masterfully crafted thriller, carried by a towering performance.',
    },
    image: uneBatailleApresLAutre,
  },
  {
    year: 2024,
    title: 'Le Comte de Monte-Cristo',
    subtitle: 'Alexandre de La Patellière, Matthieu Delaporte',
    description: {
      fr: "Sûrement l'un des meilleurs films d'aventure français de la décennie.",
      en: 'Probably one of the best French adventure films of the decade.',
    },
    image: leComteDeMonteCristo,
  },
  {
    year: 2023,
    title: 'Je verrai toujours vos visages',
    subtitle: 'Jeanne Herry',
    description: {
      fr: "Un film d'une justesse rare, un des meilleurs films de Gilles Lellouche.",
      en: 'A remarkably true film, one of the best films from Gilles Lellouche.',
    },
    image: jeVerraiToujoursVosVisages,
  },
  {
    year: 2022,
    title: 'Ad Bestas',
    subtitle: 'Rodrigo Sorogoyen',
    description: {
      fr: "Une superbe interprétation, portée par une histoire originale sur l'intégration et le racisme.",
      en: 'A superb performance, carried by an original story about integration and racism.',
    },
    image: adBestas,
  },
  {
    year: 2021,
    title: 'The Father',
    subtitle: 'Florian Zeller',
    description: {
      fr: "Une histoire prenante sur l'autonomie et la perte de mémoire.",
      en: 'A gripping story about autonomy and memory loss.',
    },
    image: theFather,
  },
];

export const FAVORITE_AUTHORS: BookAuthorEntry[] = [
  {
    author: 'Franck Thilliez',
    description: {
      fr: "Un auteur français incontournable dans le genre thriller. De livre en livre son style devient plus mature jusqu'au summum de son art avec « Il était 2 fois ».",
      en: 'An unmissable French thriller author. Book after book his style keeps maturing, reaching the peak of his craft with « Il était 2 fois ».',
    },
    books: [
      { title: 'Norferville', year: 2024, image: norferville },
      { title: 'Il était 2 fois', year: 2020, image: ilEtait2Fois },
      { title: 'Pandemia', year: 2015, image: pandemia },
      { title: "Train d'enfer pour Ange rouge", year: 2007, image: trainDEnferPourAngeRouge },
    ],
  },
  {
    author: 'Dennis Lehane',
    description: {
      fr: "L'un de mes auteurs américains que j'apprécie le plus. Sa ville « Boston » qu'on retrouve dans la plupart de ses livres reflète à merveille le portrait de la société américaine.",
      en: 'One of the American authors I enjoy the most. His fictional Boston, featured in most of his books, paints a wonderful portrait of American society.',
    },
    books: [
      { title: 'Le Silence', year: 2023, image: leSilence },
      { title: "Un pays à l'aube", year: 2009, image: unPaysALAube },
      { title: 'Shutter Island', year: 2003, image: shutterIsland },
      { title: 'Un dernier verre avant la guerre', year: 2000, image: unDernierVerreAvantLaGuerre },
    ],
  },
  {
    author: 'Pierre Lemaitre',
    description: {
      fr: "Pierre Lemaitre possède à la fois une plume magistrale et une imagination complétement folle. Ses 2 suites « Les Années glorieuses » et « Les Enfants du désastre » sont des romans cultes.",
      en: 'Pierre Lemaitre combines a masterful pen with a completely wild imagination. His two series, « Les Années glorieuses » and « Les Enfants du désastre », are cult novels.',
    },
    books: [
      { title: 'Le Grand Monde', year: 2022, image: leGrandMonde },
      { title: 'Le Serpent Majuscule', year: 2021, image: leSerpentMajuscule },
      { title: 'Trois jours et une vie', year: 2016, image: troisJoursEtUneVie },
      { title: 'Au revoir là-haut', year: 2013, image: auRevoirLaHaut },
    ],
  },
  {
    author: 'Jean-Christophe Grangé',
    description: {
      fr: "Considéré comme l'un des meilleurs écrivains de roman noir de la scène française, il maîtrise le suspense comme aucun autre et possède une plume très talentueuse.",
      en: 'Considered one of the best noir authors on the French scene, he masters suspense like no other and has a truly talented pen.',
    },
    books: [
      { title: 'Les Promises', year: 2021, image: lesPromises },
      { title: 'La dernière chasse', year: 2019, image: laDerniereChasse },
      { title: "L'Empire des loups", year: 2003, image: lEmpireDesLoups },
      { title: 'Le vol des cigognes', year: 1994, image: leVolDesCigognes },
    ],
  },
];

export const FAVORITE_GAMES: HobbyItem[] = [
  {
    year: 2026,
    title: 'Gambonanza',
    subtitle: 'Blukulélé',
    description: {
      fr: "Un jeu d'échecs malin avec un système de gambits bien pensé.",
      en: 'A clever chess game with a well-designed gambit system.',
    },
    image: gambonanza,
  },
  {
    year: 2025,
    title: 'The Drifter',
    subtitle: 'Powerhoof',
    description: {
      fr: 'Une histoire prenante portée par un pixel art magnifique.',
      en: 'A gripping story carried by gorgeous pixel art.',
    },
    image: theDrifter,
  },
  {
    year: 2024,
    title: 'Balatro',
    subtitle: 'LocalThunk',
    description: {
      fr: 'Réalisation impeccable et un dosage stratégique parfait.',
      en: 'Flawless execution and a strategic balance nailed to perfection.',
    },
    image: balatro,
  },
  {
    year: 2023,
    title: 'Dredge',
    subtitle: 'Black Salt Games',
    description: {
      fr: 'Jeu de pêche ambiance lovecraft original avec un gameplay reposant.',
      en: 'An original Lovecraftian fishing game with wonderfully relaxing gameplay.',
    },
    image: dredge,
  },
  {
    year: 2022,
    title: 'Endling - Extinction is Forever',
    subtitle: 'Herobeat Studios',
    description: {
      fr: "Une aventure poignante sur l'extinction de la faune et la flore.",
      en: 'A poignant adventure about the extinction of flora and fauna.',
    },
    image: endling,
  },
  {
    year: 2021,
    title: 'Inscryption',
    subtitle: 'Daniel Mullins Games',
    description: {
      fr: 'Dans la famille des jeux barrés, je voudrais le plus barré.',
      en: 'In the family of unhinged games, I\'ll take the most unhinged one.',
    },
    image: inscryption,
  },
];
