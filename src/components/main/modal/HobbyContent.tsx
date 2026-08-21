import { useLanguage } from '../../../context/LanguageContext.tsx';
import type { HobbyItem } from '../../../config/hobbies.ts';
import style from './HobbyContent.module.css';

const ACCENTS = ['blue', 'orange', 'green', 'red', 'yellow', 'purple'] as const;

type HobbyContentProps = {
  items: HobbyItem[];
  orientation?: 'portrait' | 'landscape';
};

export default function HobbyContent({ items, orientation = 'portrait' }: HobbyContentProps) {
  const { language } = useLanguage();
  const sorted = [...items].sort((a, b) => b.year - a.year);

  return (
    <ol className={style.timeline}>
      {sorted.map((item, index) => {
        const accent = ACCENTS[index % ACCENTS.length];
        return (
          <li key={item.year} className={style.row}>
            <span className={`${style.year} ${style[accent]}`}>{item.year}</span>
            <div className={`${style.card} ${orientation === 'landscape' ? style.landscape : ''}`}>
              {item.image ? (
                <img className={style.poster} src={item.image} alt="" loading="lazy" />
              ) : (
                <div className={`${style.posterFallback} ${style[accent]}`} aria-hidden="true" />
              )}
              <div className={style.info}>
                <p className={style.title}>{item.title}</p>
                {item.subtitle && <p className={style.subtitle}>{item.subtitle}</p>}
                <p className={style.description}>{item.description[language]}</p>
                {item.url && (
                  <a className={style.link} href={item.url} target="_blank" rel="noreferrer">
                    {item.url.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
