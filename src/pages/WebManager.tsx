import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import logoHtml from '../assets/pages/logo-html.png';
import logoCss from '../assets/pages/logo-css.png';
import logoJs from '../assets/pages/logo-js.png';
import iconResponsive from '../assets/pages/img-responsive.png';
import iconDevelopment from '../assets/pages/img-development.png';
import iconWriting from '../assets/pages/img-writing.png';
import iconOptimization from '../assets/pages/img-optimization.png';
import projectToulimmo from '../assets/pages/interface-toulimmo.jpg';
import projectFoxyz from '../assets/pages/interface-foxyz.jpg';
import projectArmoireplus from '../assets/pages/interface-armoireplus.jpg';
import projectMecajetdeau from '../assets/pages/interface-mecajetdeau.jpg';
import projectTextbeans from '../assets/pages/interface-textbeans.jpg';
import projectTopwings from '../assets/pages/interface-topwings.jpg';
import projectAirbusds from '../assets/pages/interface-airbusds.jpg';
import projectSpherea from '../assets/pages/interface-spherea.jpg';
import style from './WebManager.module.css';

const SERVICES = [
  {
    icon: iconResponsive,
    title: 'Responsive design',
    description:
      "Une charte graphique adaptée à votre budget : template optimisé pour réduire les coûts, ou interface sur-mesure pour un rendu plus original et différenciant.",
  },
  {
    icon: iconDevelopment,
    title: 'Développement',
    description:
      'Sites clé en main sous WordPress/WooCommerce, ou applications web sur-mesure avec React et Symfony selon la complexité de votre projet.',
  },
  {
    icon: iconWriting,
    title: 'Rédaction web',
    description:
      "Un contenu bien rédigé et optimisé conditionne votre position dans les moteurs de recherche. Je vous accompagne dans la rédaction et le référencement naturel de vos pages.",
  },
  {
    icon: iconOptimization,
    title: 'Optimisation',
    description:
      "Amélioration technique et sémantique de votre site existant pour gagner des positions sur les moteurs de recherche et améliorer les temps de chargement.",
  },
];

const PROJECTS = [
  {
    image: projectToulimmo,
    title: 'Refonte du site toulimmo-realisation.fr',
    client: 'Toul-Immo Réalisation',
    url: 'https://www.toulimmo-realisation.fr',
  },
  {
    image: projectFoxyz,
    title: "Aide au développement de l'ERP et refonte du site foxyz.fr",
    client: 'Foxyz',
    url: 'https://foxyz.fr',
  },
  {
    image: projectArmoireplus,
    title: 'Charte graphique et fonctionnalités du site armoireplus.fr',
    client: 'DBA',
    url: 'https://www.armoireplus.fr',
  },
  {
    image: projectMecajetdeau,
    title: 'Conception et référencement du site mecajetdeau.com',
    client: "Méca Jet d'Eau",
    url: 'https://www.mecajetdeau.com',
  },
  { image: projectTextbeans, title: 'Intégration et optimisation de la plateforme TextBeans', client: 'Lingocentric' },
  { image: projectTopwings, title: "Conception graphique et développement de l'application Topwings", client: 'Virtual-IT · Thales Aerospace' },
  { image: projectAirbusds, title: 'Magazine interactif pour la mission JUICE', client: 'Virtual-IT · Airbus DS' },
  { image: projectSpherea, title: "Application de salon interactive U-TEST", client: 'Virtual-IT · Spherea' },
];

const HERO_LOGOS = [
  { src: logoHtml, alt: 'HTML5' },
  { src: logoCss, alt: 'CSS3' },
  { src: logoJs, alt: 'JavaScript' },
];
const HERO_LOGO_INTERVAL_MS = 4000;

// Distance avant de trancher drag horizontal (carousel) vs scroll vertical natif.
const DRAG_LOCK_THRESHOLD_PX = 10;
const INERTIA_FRICTION = 0.965;
const INERTIA_MIN_VELOCITY = 0.015; // px/ms
// Compense le lissage du sampling d'events, qui sous-estime la vitesse réelle du flick.
const INERTIA_VELOCITY_BOOST = 5;
// Vélocité moyennée sur les ~100 dernières ms : le seul dernier delta est trop bruité.
const VELOCITY_SAMPLE_WINDOW_MS = 100;

type DragSample = { x: number; t: number };

type DragState = {
  pointerId: number | null;
  pointerType: string;
  gesture: 'pending' | 'horizontal' | 'vertical';
  startX: number;
  startY: number;
  startScrollLeft: number;
  samples: DragSample[];
  moved: boolean;
};

export default function WebManager() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({
    pointerId: null,
    pointerType: '',
    gesture: 'pending',
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    samples: [],
    moved: false,
  });
  const inertiaFrameRef = useRef<number | null>(null);
  const inertiaVelocityRef = useRef(0); // px/ms, décroît pendant l'animation d'inertie
  const [logoIndex, setLogoIndex] = useState(0);
  const [flippedServices, setFlippedServices] = useState<Set<string>>(new Set());

  const toggleService = (title: string) => {
    setFlippedServices((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  useEffect(() => {
    document.title = 'Web Manager et développeur freelance à Pau et Tarbes | Julien Agullo';
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      'content',
      'Julien Agullo, web manager et développeur freelance à Pau et Tarbes. Création de sites Internet professionnels, développement web sur-mesure, rédaction et optimisation SEO.',
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIndex((prev) => (prev + 1) % HERO_LOGOS.length);
    }, HERO_LOGO_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const stopInertia = () => {
    if (inertiaFrameRef.current === null) return;
    cancelAnimationFrame(inertiaFrameRef.current);
    inertiaFrameRef.current = null;
  };

  const runInertia = () => {
    const track = trackRef.current;
    if (!track) return;
    inertiaVelocityRef.current *= INERTIA_FRICTION;
    if (Math.abs(inertiaVelocityRef.current) < INERTIA_MIN_VELOCITY) {
      inertiaFrameRef.current = null;
      track.style.scrollSnapType = '';
      return;
    }
    track.scrollLeft -= inertiaVelocityRef.current * 16;
    inertiaFrameRef.current = requestAnimationFrame(runInertia);
  };

  const scrollTrack = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    stopInertia();
    const card = track.querySelector<HTMLElement>('[data-card]');
    const amount = card ? card.offsetWidth + 20 : track.clientWidth;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  // Drag souris + tactile (Pointer Events), verrouillage horizontal/vertical cf. CurriculumContent.
  const handleTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    stopInertia();
    const drag = dragRef.current;
    drag.pointerId = event.pointerId;
    drag.pointerType = event.pointerType;
    drag.gesture = 'pending';
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    drag.startScrollLeft = track.scrollLeft;
    drag.samples = [{ x: event.clientX, t: performance.now() }];
    drag.moved = false;
  };

  const handleTrackPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || drag.pointerId !== event.pointerId || drag.gesture === 'vertical') return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (drag.gesture === 'pending') {
      // Seuil utile qu'au tactile (ambiguïté avec le scroll de page) ; aucun seuil à la souris.
      if (drag.pointerType !== 'mouse') {
        if (Math.hypot(dx, dy) < DRAG_LOCK_THRESHOLD_PX) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          drag.gesture = 'vertical';
          return;
        }
      }
      drag.gesture = 'horizontal';
      drag.moved = true;
      track.setPointerCapture(event.pointerId);
      track.style.scrollSnapType = 'none';
      track.style.cursor = 'grabbing';
    }

    const now = performance.now();
    drag.samples.push({ x: event.clientX, t: now });
    while (drag.samples.length > 1 && now - drag.samples[0].t > VELOCITY_SAMPLE_WINDOW_MS) {
      drag.samples.shift();
    }

    track.scrollLeft = drag.startScrollLeft - dx;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || drag.pointerId !== event.pointerId) return;

    if (drag.gesture === 'horizontal') {
      track.style.cursor = '';
      const first = drag.samples[0];
      const last = drag.samples[drag.samples.length - 1];
      const dt = last.t - first.t;
      const velocity = dt > 0 ? (last.x - first.x) / dt : 0;
      if (Math.abs(velocity) > INERTIA_MIN_VELOCITY) {
        inertiaVelocityRef.current = velocity * INERTIA_VELOCITY_BOOST;
        inertiaFrameRef.current = requestAnimationFrame(runInertia);
      } else {
        track.style.scrollSnapType = '';
      }
    }

    drag.pointerId = null;
    drag.gesture = 'pending';
  };

  // Un vrai drag ne doit pas déclencher le lien "Visiter" au relâchement.
  const handleTrackClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  useEffect(() => stopInertia, []);

  return (
    <main className={style.main}>
      <section className={style.hero}>
        <div className={style.heroInner}>
          <div className={style.heroText}>
            <span className={style.kicker}>Développement web freelance</span>
            <h1>Web Manager et <span className={style.highlight}>Webmaster</span> sur Pau et Tarbes</h1>
            <p>
              Bienvenue sur mon site dédié au développement web pour les entreprises et les professionnels. Spécialisé
              depuis plus de 15 ans en gestion de projet, communication, design et programmation, j'étudie chaque
              projet pour proposer la solution technique la plus adaptée à vos besoins.
            </p>
            <p>
              Du cahier des charges à la mise en ligne, je vous accompagne à chaque étape pour définir la meilleure
              approche en communication comme en technologie. Un site professionnel bien conçu améliore votre
              visibilité sur les moteurs de recherche et l'image de marque de votre entreprise.
            </p>
            <a href="/" className={style.heroCta}>
              Découvrir mon portfolio
            </a>
          </div>
          <div className={style.heroCard}>
            <div className={style.heroLogos}>
              {HERO_LOGOS.map((logo, i) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className={i === logoIndex ? style.heroLogoActive : undefined}
                />
              ))}
            </div>
            <span>Web Manager &amp; développeur freelance</span>
          </div>
        </div>
      </section>

      <section className={style.services}>
        <div className={style.sectionInner}>
          <h2>
            Découvrir <span className={style.highlight}>les services</span> proposés
          </h2>
          <div className={style.servicesGrid}>
            {SERVICES.map((service) => {
              const flipped = flippedServices.has(service.title);
              return (
                <button
                  type="button"
                  className={style.serviceCard}
                  key={service.title}
                  onClick={() => toggleService(service.title)}
                  aria-pressed={flipped}
                >
                  <div className={`${style.serviceCardInner} ${flipped ? style.serviceCardFlipped : ''}`}>
                    <div className={style.serviceFront}>
                      <img src={service.icon} alt="{service.title}" />
                      <h3>{service.title}</h3>
                    </div>
                    <div className={style.serviceBack}>
                      <p>{service.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={style.projects}>
        <div className={style.sectionInner}>
          <div className={style.projectsHeader}>
            <h2>
              Focus sur <span className={style.highlight}>quelques projets</span> réalisés
            </h2>
            <div className={style.carouselControls}>
              <button type="button" aria-label="Projet précédent" onClick={() => scrollTrack(-1)}>
                ‹
              </button>
              <button type="button" aria-label="Projet suivant" onClick={() => scrollTrack(1)}>
                ›
              </button>
            </div>
          </div>
          <div
            className={style.carouselTrack}
            ref={trackRef}
            onPointerDown={handleTrackPointerDown}
            onPointerMove={handleTrackPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={handleTrackClickCapture}
          >
            {PROJECTS.map((project) => {
              return (
                <figure className={style.projectCard} data-card key={project.title}>
                  <img src={project.image} alt={project.title} loading="lazy" draggable={false} />
                  <figcaption>
                    <h3>{project.title}</h3>
                    <p>{project.client}</p>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noreferrer" className={style.projectVisit}>
                        Visiter
                      </a>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section className={style.cta}>
        <div className={style.sectionInner}>
          <h2>Une autre approche de l'expérience web.</h2>
          <a href="/" className={style.ctaButton}>
            Explorer le portfolio
          </a>
        </div>
      </section>
    </main>
  );
}
