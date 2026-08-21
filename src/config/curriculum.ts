import logoDBA from '../assets/ressources/curriculum/logo-dba.png';
import logoFoxyz from '../assets/ressources/curriculum/logo-foxyz.png';
import logoPortfolio from '../assets/ressources/curriculum/logo-portfolio.png';
import logoVirtualit from '../assets/ressources/curriculum/logo-virtualit.png';
import type { Language } from './config.ts';

export type CvAccent = 'blue' | 'orange' | 'green' | 'red' | 'yellow';

export type CvProject = {
  title: Record<Language, string>;
  detail: Record<Language, string>;
  url?: string;
  date?: string;
};

export type CvExperience = {
  id: string;
  accent: CvAccent;
  role: Record<Language, string>;
  company: string;
  period: string;
  description: Record<Language, string>;
  skills: Record<Language, string[]>;
  projects: CvProject[];
  projectsLabel?: Record<Language, string>;
  logo?: string;
  ragComment?: Record<Language, string>;
};

export const CURRICULUM: CvExperience[] = [
  {
    id: 'foxyz',
    accent: 'orange',
    logo: logoFoxyz,
    role: { fr: 'Développeur web', en: 'Web developer' },
    company: 'Foxyz - Tarbes',
    period: '2022 - 2026',
    description: {
      fr: "Développement de l'ERP Foxyz et de son éco-système (site Internet, plateforme collaborative, etc.).",
      en: "Development of the Foxyz ERP and its ecosystem (website, collaborative platform, etc.).",
    },
    skills: {
      fr: [
        'PHP',
        'MySQL',
        'Symfony',
        'Stimulus',
        'Facturation électronique',
        'API Microsoft Graph, Gmail, Jefacture, Yousign, Bridge, SMS Factor',
        "GIT",
        'Documentation technique',
        "Encadrement d'alternants",
      ],
      en: [
        'PHP',
        'MySQL',
        'Symfony',
        'Stimulus',
        'Electronic invoicing',
        'Microsoft Graph, Gmail, Jefacture, Yousign, Bridge, SMS Factor APIs',
        "GIT",
        'Technical documentation',
        'Apprentice mentoring',
      ],
    },
    projects: [
      {
        title: { fr: "Amélioration transverse de l'ERP", en: 'Cross-cutting ERP improvements' },
        date: '2022 - 2026',
        detail: {
          fr: "Refonte des lignes de calcul sur tous les modules commerciaux (devis, commandes, achats...) ; modernisation des exports PDF avec certificat électronique (intégration de mPDF, normalisation des documents) ; mise en place de la synchronisation avec des services tiers (Microsoft 365, Google Workspace, Yousign, etc.) ; aide à la migration de l'infrastructure vers un cloud privé.",
          en: 'Reworked the calculation logic on line items across all commercial modules (quotes, orders, purchases...); modernized PDF exports with electronic certification (integrated mPDF, standardized documents); set up synchronization with third-party services (Microsoft 365, Google Workspace, Yousign, etc.); helped migrate the infrastructure to a private cloud.',
        },
      },
      {
        title: { fr: 'Réforme de la facturation électronique', en: 'E-invoicing reform' },
        date: '2025 - 2026',
        detail: {
          fr: "Intégration de la norme FacturX dans les exports PDF des factures ; mise en place d'un parseur XML pour récupérer les données d'une facture ; connexion avec l'API Jefacture pour gérer les statuts des factures depuis l'ERP.",
          en: 'Integrated the FacturX standard into invoice PDF exports; built an XML parser to extract invoice data; connected to the Jefacture API to manage invoice statuses directly from the ERP.',
        },
      },
      {
        title: { fr: 'Système de mise à jour', en: 'Update system' },
        date: '2025',
        detail: {
          fr: "Conception d'un système de déploiement centralisé, sur un serveur dédié, pour planifier et automatiser les mises à jour de l'ERP.",
          en: "Designed a centralized deployment system, hosted on a dedicated server, to schedule and automate ERP updates.",
        },
      },
      {
        title: { fr: "Déploiement de l'API Foxyz", en: 'Foxyz API deployment' },
        date: '2024 - 2026',
        detail: {
          fr: "Création de l'API Foxyz pour l'interconnexion des ERP ; mise en place d'une passerelle sécurisée pour la connexion avec des API tierces (Bridge, Jefacture, etc.).",
          en: 'Built the Foxyz API for ERP interconnection; set up a secure gateway for connections to third-party APIs (Bridge, Jefacture, etc.).',
        },
      },
      {
        title: { fr: 'Plateforme collaborative', en: 'Collaborative platform' },
        date: '2022 - 2026',
        detail: {
          fr: "Refonte de la plateforme collaborative (ticket, documentation, etc).",
          en: 'Redesigned the collaborative platform (ticketing, documentation, etc.).',
        },
      },
      {
        title: { fr: 'Site Internet', en: 'Website' },
        date: '2022 - 2023',
        detail: {
          fr: "Refonte et référencement du site Internet de l'entreprise.",
          en: 'Redesign and SEO for the company website.',
        },
        url: 'https://foxyz.fr',
      },
    ],
    ragComment: {
      fr: "Travailler dans l'écosystème ERP de Foxyz a été une expérience professionnelle enrichissante, mais aussi exigeante : comprendre la structure d'un ERP existant et s'adapter à du code déjà en place demande un vrai effort d'appropriation. Ce poste a aussi été une source importante d'enrichissement personnel sur le développement d'API.",
      en: "Working within Foxyz's ERP ecosystem has been a professionally enriching experience, though a demanding one: understanding the structure of an existing ERP and adapting to code already in place takes real effort. This role was also a major source of personal growth in API development.",
    },
  },
  {
    id: 'dba',
    accent: 'blue',
    logo: logoDBA,
    role: { fr: 'Développeur web', en: 'Web developer' },
    company: 'DBA - Toulouse',
    period: '2019 - 2022',
    description: {
      fr: 'Développement web axé e-commerce du groupe DBA Armoires et de son réseau multi-sites (Armoire Plus, Mon Atelier Pro, etc.).',
      en: 'E-commerce-focused web development for the DBA Armoires group and its multi-site network (Armoire Plus, Mon Atelier Pro, etc.).',
    },
    skills: {
      fr: [
        'PHP',
        'MySQL',
        'WordPress',
        'WooCommerce',
        'SEO',
        'Affinity',
        'Photoshop',
        'Catalogue produit',
        "Encadrement d'alternants",
      ],
      en: [
        'PHP',
        'MySQL',
        'WordPress',
        'WooCommerce',
        'SEO',
        'Affinity',
        'Photoshop',
        'Product catalog',
        'Apprentice mentoring',
      ],
    },
    projects: [
      {
        title: { fr: 'DBA Armoires', en: 'DBA Armoires' },
        date: '2019 - 2022',
        detail: {
          fr: 'Amélioration de la charte graphique de la marque ; refonte du site sous WooCommerce ; campagnes marketing multicanales (emailing, publipostage, etc.) ; création de supports de communication.',
          en: 'Improved the brand identity; rebuilt the website on WooCommerce; ran multichannel marketing campaigns (email, direct mail, etc.); created communication materials.',
        },
        url: 'https://www.dba-armoires.fr',
      },
      {
        title: { fr: 'Armoire Plus', en: 'Armoire Plus' },
        date: '2019 - 2022',
        detail: {
          fr: "Amélioration de la charte graphique de la marque ; conception d'un plugin de suivi de commande personnalisé ; adaptation de plugins tiers ; mise à jour du catalogue produit.",
          en: 'Improved the brand identity; built a custom order-tracking plugin; adapted third-party plugins; updated the product catalog.',
        },
        url: 'https://www.armoireplus.fr',
      },
      {
        title: { fr: 'Mon Atelier Pro', en: 'Mon Atelier Pro' },
        date: '2020 - 2022',
        detail: {
          fr: 'Conception de la charte graphique de la marque ; refonte du site sous WooCommerce ; implémentation du catalogue produit.',
          en: 'Designed the brand identity; rebuilt the website on WooCommerce; implemented the product catalog.',
        },
        url: 'https://www.monatelierpro.fr/',
      },
      {
        title: { fr: 'Brigade Hocaré', en: 'Brigade Hocaré' },
        date: '2021-2022',
        detail: {
          fr: 'Réalisation de la charte graphique de la marque et du site ; suivi du développement du site Internet par un prestataire externe.',
          en: "Designed the brand and website identity; oversaw the website's development, carried out by an external provider.",
        },
        url: 'https://brigade-hocare.com',
      },
      {
        title: { fr: 'Le Vestiaire Séchant', en: 'Le Vestiaire Séchant' },
        date: '2020',
        detail: {
          fr: 'Amélioration de la charte graphique du site ; aide au développement du site Internet.',
          en: "Improved the website's visual identity; contributed to the website's development.",
        },
        url: 'https://www.le-vestiaire-sechant.fr',
      },
    ],
    ragComment: {
      fr: "Travailler dans l'univers de l'e-commerce chez DBA a été très appréciable, aussi bien sur le développement que sur la gestion d'un catalogue produit ou tout l'aspect interne au commerce en ligne. Ce poste a aussi été une expérience importante pour apprendre WordPress et WooCommerce, notamment le développement de plugins.",
      en: 'Working in the e-commerce world at DBA was really enjoyable, both on the development side and on managing a product catalog or all the internal aspects of online retail. This role was also an important experience for learning WordPress and WooCommerce, particularly plugin development.',
    },
  },
  {
    id: 'microentreprise',
    accent: 'green',
    logo: logoPortfolio,
    role: { fr: 'Développeur web indépendant', en: 'Freelance web developer' },
    company: 'Microentreprise',
    period: '2011 - 2019',
    description: {
      fr: "Activité freelance en développement web et support de communication interactif.",
      en: 'Freelance activity in web development and interactive communication materials.',
    },
    skills: {
      fr: [
        'PHP',
        'MySQL',
        'jQuery',
        'Action Script',
        'Photoshop',
        'Flash',
        'Interface tactile',
        'Animation vectorielle',
        'SEO',
      ],
      en: [
        'PHP',
        'MySQL',
        'jQuery',
        'Action Script',
        'Photoshop',
        'Flash',
        'Touch interface',
        'Vector animation',
        'SEO',
      ],
    },
    projects: [
      {
        title: { fr: 'Toul-Immo Réalisation', en: 'Toul-Immo Réalisation' },
        date: '2025',
        detail: {
          fr: "Refonte du site Internet de l'entreprise ; aide et conseil en communication web.",
          en: 'Redesigned the company website; provided advice and support on web communication.',
        },
        url: 'https://www.toulimmo-realisation.fr',
      },
      {
        title: { fr: 'Les Jardins de Jordi', en: 'Les Jardins de Jordi' },
        date: '2021',
        detail: {
          fr: "Réalisation du site Internet du maraîcher ; intégration du système d'inscription à la newsletter de Brevo.",
          en: "Built the market gardener's website; integrated Brevo's newsletter sign-up system.",
        },
        url: 'https://www.lesjardinsdejordi.com',
      },
      {
        title: { fr: 'Enerbim', en: 'Enerbim' },
        date: '2019',
        detail: {
          fr: "Aide au développement du prototype CN-BIMES pour le métier du BIM.",
          en: 'Contributed to the development of the CN-BIMES prototype for the BIM industry.',
        },
      },
      {
        title: { fr: 'Association Transmettre', en: 'Association Transmettre' },
        date: '2019',
        detail: {
          fr: "Réalisation du site Internet de l'école privée Transmettre et du site de l'Institut Ishes.",
          en: 'Built the website for the private school Transmettre and the website for Institut Ishes.',
        },
        url: 'https://www.ecoletransmettre.fr',
      },
      {
        title: { fr: "Méca Jet d'Eau", en: "Méca Jet d'Eau" },
        date: '2018',
        detail: {
          fr: "Refonte du site Internet de l'entreprise.",
          en: 'Redesigned the company website.',
        },
        url: 'https://www.mecajetdeau.com',
      },
      {
        title: { fr: 'Continental', en: 'Continental' },
        date: '2017',
        detail: {
          fr: "Conception d'un prototype d'application d'aide à la formation interne pour les chaînes de montage.",
          en: 'Designed a prototype application to support internal training on assembly lines.',
        },
      },
      {
        title: { fr: 'Spherea Test & Services', en: 'Spherea Test & Services' },
        date: '2016 - 2017',
        detail: {
          fr: "Réalisation de l'application de salon présentant la plateforme logicielle U-TEST ®.",
          en: 'Built the kiosk application presenting the U-TEST® software platform.',
        },
      },
      {
        title: { fr: 'Airbus Defence & Space', en: 'Airbus Defence & Space' },
        date: '2015',
        detail: {
          fr: "Conception d'un magazine interactif interne pour la mission JUICE.",
          en: 'Designed an interactive internal magazine for the JUICE mission.',
        },
      },
      {
        title: { fr: 'CNES', en: 'CNES' },
        date: '2014 - 2015',
        detail: {
          fr: "Contribution à la conception de l'application de salon Charte Internationale Espace et Catastrophes Majeures.",
          en: 'Contributed to the design of the International Charter Space and Major Disasters kiosk application.',
        },
      },
      {
        title: { fr: 'DGAC', en: 'DGAC' },
        date: '2014',
        detail: {
          fr: "Développement d'un outil interactif de formation pour le Service Technique de l’Aviation Civile (STAC).",
          en: "Developed an interactive training tool for France's Civil Aviation Technical Department (STAC).",
        },
      },
      {
        title: { fr: 'Thales Aéroporté', en: 'Thales Aéroporté' },
        date: '2014',
        detail: {
          fr: "Conception du design et aide au développement de l'application de salon TopWings EFB solution pour support tactile.",
          en: 'Designed the visual identity and developed the TopWings EFB touchscreen kiosk application.',
        },
      },
      {
        title: { fr: 'Thales Avionics', en: 'Thales Avionics' },
        date: '2013 - 2014',
        detail: {
          fr: "Réalisation d'une application de salon pour support tactile.",
          en: 'Built a touchscreen kiosk application.',
        },
      },
      {
        title: { fr: 'Tigergrip', en: 'Tigergrip' },
        date: '2011 - 2012',
        detail: {
          fr: "Amélioration du site Internet de l'entreprise ; aide au référencement.",
          en: 'Improved the company website; helped with SEO.',
        },
      },
    ],
    ragComment: {
      fr: "J'ai eu la chance de pouvoir collaborer avec mon ancienne entreprise sur de nombreux projets durant cette période en microentreprise. L'entrepreneuriat reste néanmoins un domaine difficile : il faut savoir démarcher et gérer une entreprise en plus de fournir le travail dans les temps.",
      en: 'I was fortunate to collaborate with my former employer on many projects during this period as a freelancer. Entrepreneurship remains a challenging field though: it requires knowing how to prospect for clients and run a business on top of delivering the work on time.',
    },
  },
  {
    id: 'virtual-it',
    accent: 'red',
    logo: logoVirtualit,
    role: { fr: 'Chef de projet multimédia', en: 'Multimedia project manager' },
    company: 'Virtual-IT - Toulouse',
    period: '2007 - 2011',
    description: {
      fr: "Conception de sites Internet, production vidéo et contenus interactifs au sein d'une agence multimédia.",
      en: 'Website design, video production and interactive content within a multimedia agency.',
    },
    skills: {
      fr: [
        'PHP',
        'MySQL',
        'jQuery',
        'Action Script',
        'SVN',
        'Photoshop',
        'Flash',
        'Premiere Pro',
        'Gestion de projet',
      ],
      en: [
        'PHP',
        'MySQL',
        'jQuery',
        'Action Script',
        'SVN',
        'Photoshop',
        'Flash',
        'Premiere Pro',
        'Project management',
      ],
    },
    projects: [
      {
        title: { fr: 'EDF R&D', en: 'EDF R&D' },
        date: '2010',
        detail: {
          fr: "Réalisation de plusieurs documentaires vidéo pour le pôle R&D ; création d'animations vectorielles expliquant le compteur Linky.",
          en: 'Produced several video documentaries for the R&D division; created vector animations explaining the Linky smart meter.',
        },
      },
      {
        title: { fr: 'Ineo-RHT', en: 'Ineo-RHT' },
        date: '2009',
        detail: {
          fr: "Refonte et référencement du site Internet ineo-rht.fr.",
          en: 'Redesigned and improved the SEO of ineo-rht.fr.',
        },
      },
      {
        title: { fr: 'Force Ouvrière Airbus', en: 'Force Ouvrière Airbus' },
        date: '2008',
        detail: {
          fr: "Conception du site Internet du syndicat ; réalisation d'un CD-ROM interactif sur l'organisation syndicale.",
          en: "Built the union's website; produced an interactive CD-ROM presenting the union's structure.",
        },
      },
      {
        title: { fr: 'Plateforme client', en: 'Client platform' },
        date: '2008',
        detail: {
          fr: "Développement d'une plateforme en ligne de partage de fichiers client.",
          en: 'Developed an online client file-sharing platform.',
        },
      },
      {
        title: { fr: 'Site Internet', en: 'Website' },
        date: '2007',
        detail: {
          fr: "Refonte et référencement du site Internet de l'entreprise.",
          en: 'Redesign and SEO for the company website.',
        },
      },
    ],
    ragComment: {
      fr: "Une première expérience professionnelle, c'est comme une première voiture : ça ne s'oublie pas. Une expérience inoubliable, avec des projets et des clients comme je n'en reverrai sans doute plus jamais. Mais aussi trop d'implication et une frontière entre vie personnelle et professionnelle quasiment inexistante — un vrai point de vigilance pour ne pas se laisser dévorer par le travail.",
      en: "A first professional experience is like a first car: you never forget it. An unforgettable experience, with projects and clients I'll probably never come across again. But also too much involvement, with almost no boundary between personal and professional life — a real point of caution, to avoid getting consumed by work.",
    },
  },
  {
    id: 'etudes',
    accent: 'yellow',
    projectsLabel: { fr: 'Diplômes universitaires', en: 'Degrees' },
    role: {
      fr: 'Parcours universitaire post Bac SSI',
      en: 'University studies after a science baccalaureate (engineering track)',
    },
    company: 'Études post-bac',
    period: '2001 - 2007',
    description: {
      fr: "Parcours académique après un Bac Scientifique Sciences de l'Ingénieur tourné vers la communication et le multimédia.",
      en: 'Academic path after a science baccalaureate (engineering track), oriented towards communication and multimedia.',
    },
    skills: {
      fr: [
        'Gestion de projet',
        'Communication',
        'Développement',
        'Réseaux',
        'Multimédia',
        'Audiovisuel',
        'Intelligence économique',
      ],
      en: [
        'Project management',
        'Communication',
        'Development',
        'Networks',
        'Multimedia',
        'Audiovisual',
        'Economic intelligence',
      ],
    },
    projects: [
      {
        title: { fr: 'Master 2 IET', en: 'Master 2 IET' },
        date: '2006 - 2007',
        detail: {
          fr: "Master 2 en intelligence économique et territoriale à l'Université de Toulon.",
          en: "Master's degree in economic and territorial intelligence at the University of Toulon.",
        },
      },
      {
        title: { fr: 'IUP INGÉMEDIA', en: 'IUP INGEMEDIA' },
        date: '2004 - 2006',
        detail: {
          fr: "Licence et Master 1 en sciences de l'information et de la communication à l'Université de Toulon.",
          en: "Bachelor's degree and first-year Master's in information and communication sciences at the University of Toulon.",
        },
      },
      {
        title: { fr: 'DUT SERECOM', en: 'DUT SERECOM' },
        date: '2002 - 2004',
        detail: {
          fr: "DUT en services et réseaux de communication à l'Université Paul Sabatier 3 sur Tarbes.",
          en: 'DUT (associate degree) in communication networks and services at Université Paul Sabatier, Tarbes campus.',
        },
      },
      {
        title: { fr: 'Baccalauréat SSI', en: 'Science Baccalaureate (SSI)' },
        date: '2001 - 2002',
        detail: {
          fr: "Bac Scientifique Sciences de l'Ingénieur au lycée Déodat de Séverac sur Toulouse.",
          en: "Science baccalaureate, engineering sciences track, at Lycée Déodat de Séverac in Toulouse.",
        },
      },
    ],
    ragComment: {
      fr: "Les souvenirs des années universitaires, c'est de la nostalgie pure : des nuits blanches pour finir les projets, des soirées étudiantes en faisant semblant de réviser en groupe. Beaucoup d'apprentissage théorique, avec une mise en pratique via les stages. Le début de l'aventure professionnelle...",
      en: 'Memories of university years are pure nostalgia: all-nighters to finish projects, student parties disguised as group study sessions. A lot of theoretical learning, put into practice through internships. The start of the professional adventure...',
    },
  },
];
