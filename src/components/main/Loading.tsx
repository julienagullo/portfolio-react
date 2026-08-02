import { t } from '../../lang.ts';
import type { Language } from '../../config.ts';
import style from './Loading.module.css';

type LoadingProps = {
  progress: number; // 0-100
  language: Language;
};

export default function Loading({ progress, language }: LoadingProps) {
  return (
    <div className={style.overlay}>
      <span className={style.label}>{t(language, 'loading')}</span>
      <div className={style.barTrack}>
        <div className={style.barFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}