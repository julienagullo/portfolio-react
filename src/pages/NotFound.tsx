import { useEffect } from 'react';
import style from './NotFound.module.css';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page introuvable | jagullo.fr';
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex');
  }, []);

  return (
    <main className={style.main}>
      <p className={style.code}>404</p>
      <h1>Page introuvable</h1>
      <p>Cette page n'existe pas ou a été déplacée.</p>
      <a href="/" className={style.cta}>
        Retour à l'accueil
      </a>
    </main>
  );
}
