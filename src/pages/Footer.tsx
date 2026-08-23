import style from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={style.footer}>
      <div className={style.inner}>
        <p>
          jagullo.fr © {year} - Web Manager, Pau / Tarbes
        </p>
        <nav className={style.links}>
          <a href="https://github.com/julienagullo" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="/">Portfolio</a>
          <a href="/blog">Blog</a>
        </nav>
      </div>
    </footer>
  );
}
