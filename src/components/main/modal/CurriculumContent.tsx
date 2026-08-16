import { useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';

import { useLanguage } from '../../../context/LanguageContext.tsx';
import { ModalContentContext } from '../../../context/ModalContentContext.ts';
import { ModalFooterContext } from '../../../context/ModalFooterContext.ts';
import { CURRICULUM } from '../../../curriculum.ts';
import style from './CurriculumContent.module.css';

const SWIPE_THRESHOLD_PX = 60;
const EDGE_DRAG_DAMPING = 0.3;

export default function CurriculumContent() {
  const { language, t } = useLanguage();
  const footerEl = useContext(ModalFooterContext);
  const contentEl = useContext(ModalContentContext);
  const [{ index, direction }, setSlide] = useState({ index: 0, direction: 1 });
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  const goTo = useCallback((next: number) => {
    setSlide((prev) => {
      const clamped = Math.max(0, Math.min(CURRICULUM.length - 1, next));
      return { index: clamped, direction: clamped >= prev.index ? 1 : -1 };
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goTo(index - 1);
      if (event.key === 'ArrowRight') goTo(index + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goTo, index]);

  useEffect(() => {
    contentEl?.scrollTo({ top: 0 });
  }, [contentEl, index]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;
    setDragX(event.clientX - dragStartXRef.current);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>, commit: boolean) => {
    if (pointerIdRef.current !== event.pointerId) return;
    if (commit) {
      if (dragX <= -SWIPE_THRESHOLD_PX) goTo(index + 1);
      else if (dragX >= SWIPE_THRESHOLD_PX) goTo(index - 1);
    }
    pointerIdRef.current = null;
    setIsDragging(false);
    setDragX(0);
  };

  const experience = CURRICULUM[index];
  const atFirst = index === 0;
  const atLast = index === CURRICULUM.length - 1;
  const draggedX =
    (dragX > 0 && atFirst) || (dragX < 0 && atLast) ? dragX * EDGE_DRAG_DAMPING : dragX;
  const slideStyle = {
    '--dir': direction,
    transform: isDragging ? `translateX(${draggedX}px)` : undefined,
    transition: isDragging ? 'none' : undefined,
  } as CSSProperties;

  return (
    <div className={style.wrapper}>
      <div
        className={`${style.slide} ${isDragging ? style.dragging : ''}`}
        style={slideStyle}
        key={experience.id}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => endDrag(event, true)}
        onPointerCancel={(event) => endDrag(event, false)}
      >
        <header className={style.head}>
          <div className={style.headRow}>
            <div className={style.headInfo}>
              <span className={`${style.period} ${style[experience.accent]}`}>{experience.period}</span>
              <h3 className={style.company}>{experience.company}</h3>
              <p className={style.role}>{experience.role[language]}</p>
            </div>
            {experience.logo && <img className={style.logo} src={experience.logo} alt="" width={48} height={48} />}
          </div>
          <p className={style.description}>{experience.description[language]}</p>
        </header>

        <section className={style.section}>
          <h4 className={`${style.sectionTitle} ${style[experience.accent]}`}>{t('curriculum.skillsTitle')}</h4>
          <ul className={style.skills}>
            {experience.skills[language].map((skill) => (
              <li key={skill} className={style.skillPill}>
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section className={style.section}>
          <h4 className={`${style.sectionTitle} ${style[experience.accent]}`}>
            {experience.projectsLabel?.[language] ?? t('curriculum.projectsTitle')}
          </h4>
          <ul className={style.projects}>
            {experience.projects.map((project) => (
              <li key={project.title.fr} className={style.project}>
                {project.date && <span className={style.projectDate}>{project.date}</span>}
                <p className={style.projectTitle}>
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noreferrer">
                      {project.title[language]}
                    </a>
                  ) : (
                    project.title[language]
                  )}
                </p>
                <p className={style.projectDetail}>{project.detail[language]}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {footerEl &&
        createPortal(
          <div className={style.nav}>
            <button
              type="button"
              className={style.arrow}
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label={t('curriculum.prev')}
            >
              ‹
            </button>
            <div className={style.dots}>
              {CURRICULUM.map((exp, i) => (
                <button
                  key={exp.id}
                  type="button"
                  className={`${style.dot} ${i === index ? `${style.dotActive} ${style[exp.accent]}` : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`${t('curriculum.goTo')} ${exp.company}`}
                  aria-current={i === index}
                />
              ))}
            </div>
            <button
              type="button"
              className={style.arrow}
              onClick={() => goTo(index + 1)}
              disabled={index === CURRICULUM.length - 1}
              aria-label={t('curriculum.next')}
            >
              ›
            </button>
          </div>,
          footerEl,
        )}
    </div>
  );
}
