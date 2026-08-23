import style from './Header.module.css';

export default function Header() {
  return (
    <header className={style.header}>
      <div className={style.inner}>
        <a href="/" className={style.logo}>
          <img src="/favicon.svg" alt="" width={28} height={28} />
          <span>jagullo.fr</span>
        </a>
        <a href="/" className={style.cta}>
          Voir le portfolio
        </a>
      </div>
    </header>
  );
}
