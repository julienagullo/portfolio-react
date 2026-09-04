import adBestas from '../assets/ressources/hobbies/ad-bestas.png';
import auRevoirLaHaut from '../assets/ressources/hobbies/au-revoir-la-haut.png';
import balatro from '../assets/ressources/hobbies/balatro.png';
import dredge from '../assets/ressources/hobbies/dredge.png';
import gambonanza from '../assets/ressources/hobbies/gambonanza.png';
import gourou from '../assets/ressources/hobbies/gourou.png';
import ilEtait2Fois from '../assets/ressources/hobbies/il-etait-2-fois.png';
import jeVerraiToujoursVosVisages from '../assets/ressources/hobbies/je-verrai-toujours-vos-visages.png';
import laDerniereChasse from '../assets/ressources/hobbies/la-derniere-chasse.png';
import lEmpireDesLoups from '../assets/ressources/hobbies/l-empire-des-loups.png';
import leComteDeMonteCristo from '../assets/ressources/hobbies/le-comte-de-monte-cristo.png';
import leGrandMonde from '../assets/ressources/hobbies/le-grand-monde.png';
import leSerpentMajuscule from '../assets/ressources/hobbies/le-serpent-majuscule.png';
import leSilence from '../assets/ressources/hobbies/le-silence.png';
import leVolDesCigognes from '../assets/ressources/hobbies/le-vol-des-cigognes.png';
import lesPromises from '../assets/ressources/hobbies/les-promises.png';
import norferville from '../assets/ressources/hobbies/norferville.png';
import pandemia from '../assets/ressources/hobbies/pandemia.png';
import shutterIsland from '../assets/ressources/hobbies/shutter-island.png';
import squareValley from '../assets/ressources/hobbies/square-valley.png';
import theDrifter from '../assets/ressources/hobbies/the-drifter.png';
import trainDEnferPourAngeRouge from '../assets/ressources/hobbies/train-d-enfer-pour-ange-rouge.png';
import troisJoursEtUneVie from '../assets/ressources/hobbies/trois-jours-et-une-vie.png';
import unDernierVerreAvantLaGuerre from '../assets/ressources/hobbies/un-dernier-verre-avant-la-guerre.png';
import uneBatailleApresLAutre from '../assets/ressources/hobbies/une-bataille-apres-l-autre.png';
import unPaysALAube from '../assets/ressources/hobbies/un-pays-a-l-aube.png';
import type { Language } from './config.ts';

export type HobbyItem = {
  year: number;
  title: string;
  subtitle?: string;
  description: Record<Language, string>;
  image?: string;
  url?: string;
  ragComment?: Record<Language, string>;
  ragKeywords?: Record<Language, string[]>;
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
  ragComment?: Record<Language, string>;
  ragKeywords?: Record<Language, string[]>;
};

export const FAVORITE_FILMS: HobbyItem[] = [
  {
    year: 2026,
    title: 'Gourou',
    subtitle: 'Yann Gozlan',
    description: {
      fr: 'Pierre Niney confirme une fois de plus son statut de très bon acteur.',
      en: 'Pierre Niney once again confirms his status as an excellent actor.',
    },
    image: gourou,
    ragComment: {
      fr: "Ce film est une très bonne critique de notre société et de ses faux-semblants. Pierre Niney fait partie des meilleurs acteurs de la scène française de notre génération.",
      en: 'This film offers a sharp critique of our society and its false pretences. Pierre Niney is among the best actors of the French scene of our generation.',
    },
  },
  {
    year: 2025,
    title: "Une bataille après l'autre",
    subtitle: 'Paul Thomas Anderson',
    description: {
      fr: "Un thriller d'une grande maîtrise dans la lignée de Tarantino, porté par une superbe interprétation.",
      en: 'A masterfully crafted thriller in the vein of Tarantino, carried by a towering performance.',
    },
    image: uneBatailleApresLAutre,
    ragComment: {
      fr: "Les thrillers sont mon genre préféré, surtout en roman. Alors quand un réalisateur comme Paul Thomas Anderson s'y met, ça ne peut être que culte.",
      en: 'Thrillers are my favorite genre, especially in novels. So when a director like Paul Thomas Anderson takes one on, it can only become a classic.',
    },
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
    ragComment: {
      fr: "On est tous tombés un jour dans les films d'aventure, surtout ceux des années 80 comme Indiana Jones. Les films d'aventure français vraiment réussis ne sont pas si nombreux.",
      en: "We've all fallen for adventure films at some point, especially those from the 80s like Indiana Jones. Really successful French adventure films are pretty rare.",
    },
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
    ragComment: {
      fr: "Le drame social n'est pas vraiment mon genre habituel, mais celui-ci est très réussi, au niveau de Hors normes avec Vincent Cassel.",
      en: "Social dramas aren't really my usual genre, but this one is excellent, on par with Hors normes with Vincent Cassel.",
    },
  },
  {
    year: 2022,
    title: 'Ad Bestas',
    subtitle: 'Rodrigo Sorogoyen',
    description: {
      fr: "Une superbe interprétation et un excellent scénario sur l'intégration et le racisme.",
      en: 'A superb performance, carried by an original story about integration and racism.',
    },
    image: adBestas,
    ragComment: {
      fr: "Toujours dans le genre du drame social, Ad Bestas est une réussite totale : le sujet traité est pertinent, mais aussi très actuel dans certaines régions.",
      en: 'Still in the social drama genre, Ad Bestas is a complete success: the subject it tackles is relevant, and still very topical in certain regions.',
    },
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
    ragComment: {
      fr: "J'aime beaucoup le genre thriller, et Franck Thilliez est l'un de mes auteurs préférés. De temps en temps, il recoupe certaines de ses histoires, comme pour construire un véritable lore. Des auteurs dans le même esprit : Bernard Minier, Henri Lœvenbruck.",
      en: 'I really like the thriller genre, and Franck Thilliez is one of my favorite authors. From time to time he cross-references some of his stories, almost building a shared lore. Authors in a similar vein: Bernard Minier, Henri Lœvenbruck.',
    },
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
    ragComment: {
      fr: "Dennis Lehane est un auteur de thriller américain qui excelle dans son domaine. Il est particulièrement fort sur la construction des personnages et de leur caractère. Un auteur similaire : Michael Connelly.",
      en: "Dennis Lehane is an American thriller author who excels in his craft. He's particularly strong at building characters and giving them depth. A similar author: Michael Connelly.",
    },
  },
  {
    author: 'Pierre Lemaitre',
    description: {
      fr: "Pierre Lemaitre possède à la fois une plume et une imagination magistrales. Ses 2 suites « Les Années glorieuses » et « Les Enfants du désastre » sont des romans cultes.",
      en: 'Pierre Lemaitre combines a masterful pen with a completely wild imagination. His two series, « Les Années glorieuses » and « Les Enfants du désastre », are cult novels.',
    },
    books: [
      { title: 'Le Grand Monde', year: 2022, image: leGrandMonde },
      { title: 'Le Serpent Majuscule', year: 2021, image: leSerpentMajuscule },
      { title: 'Trois jours et une vie', year: 2016, image: troisJoursEtUneVie },
      { title: 'Au revoir là-haut', year: 2013, image: auRevoirLaHaut },
    ],
    ragComment: {
      fr: "Pierre Lemaitre est très fort dans le genre social-dramatique et historique, il a d'ailleurs su bien rebondir en passant du roman noir au dramatique. Un auteur similaire : Sorj Chalandon.",
      en: 'Pierre Lemaitre excels in the social-drama and historical genre, and he pulled off a great shift from noir fiction to drama. A similar author: Sorj Chalandon.',
    },
  },
  {
    author: 'Jean-Christophe Grangé',
    description: {
      fr: "Considéré comme l'un des meilleurs écrivains de roman noir de la scène française, il maîtrise le suspense comme aucun autre et son passé de journaliste lui confère un style remarquable.",
      en: 'Considered one of the best noir authors on the French scene, he masters suspense like no other, and his background as a journalist gives his writing a remarkable style.',
    },
    books: [
      { title: 'Les Promises', year: 2021, image: lesPromises },
      { title: 'La dernière chasse', year: 2019, image: laDerniereChasse },
      { title: "L'Empire des loups", year: 2003, image: lEmpireDesLoups },
      { title: 'Le vol des cigognes', year: 1994, image: leVolDesCigognes },
    ],
    ragComment: {
      fr: "Jean-Christophe Grangé maîtrise parfaitement le roman noir, et on sent beaucoup son travail de recherche journalistique dans ses livres. Un auteur similaire : Maxime Chattam.",
      en: 'Jean-Christophe Grangé has a real mastery of noir fiction, and his journalistic background clearly shows through in his research. A similar author: Maxime Chattam.',
    },
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
      fr: "Jeu de pêche à l'ambiance lovecraftienne avec un gameplay reposant.",
      en: 'An original Lovecraftian fishing game with wonderfully relaxing gameplay.',
    },
    image: dredge,
  },
  {
    year: 2022,
    title: 'Square Valley',
    subtitle: 'Rycekube Games',
    description: {
      fr: "Un city-builder puzzle aussi malin qu'apaisant, avec un vrai game design ingénieux.",
      en: 'A clever, wonderfully relaxing city-building puzzle game.',
    },
    image: squareValley,
  },
];
