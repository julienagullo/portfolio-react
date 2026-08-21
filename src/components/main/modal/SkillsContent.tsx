import { useState } from 'react';

import { useLanguage } from '../../../context/LanguageContext.tsx';
import { useTypewriter } from '../../../hooks/useTypewriter.ts';
import { SKILLS, type SkillItem } from '../../../config/skills.ts';
import style from './SkillsContent.module.css';

type SkillCardProps = {
  item: SkillItem;
};

function SkillCard({ item }: SkillCardProps) {
  const { language } = useLanguage();
  const [active, setActive] = useState(false);
  const desc = item.desc[language];
  const typed = useTypewriter(desc, active);

  return (
    <article
      className={`${style.card} ${active ? style.cardActive : ''}`}
      tabIndex={0}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <div className={style.stage}>
        <img className={style.logo} src={item.logo} alt="" width={32} height={32} loading="lazy" />
        <p className={style.desc}>
          <span>
            {typed}
            {active && typed.length < desc.length && <span className={style.cursor}>_</span>}
          </span>
        </p>
      </div>
      <h4 className={style.name}>{item.name}</h4>
    </article>
  );
}

export default function SkillsContent() {
  const { language } = useLanguage();

  return (
    <div className={style.wrapper}>
      {SKILLS.map((category) => (
        <section key={category.id} className={style.category}>
          <h3 className={`${style.categoryTitle} ${style[category.accent]}`}>{category.title[language]}</h3>
          <div className={style.grid}>
            {category.items.map((item) => (
              <SkillCard key={item.name} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
