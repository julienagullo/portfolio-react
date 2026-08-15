import { useLanguage } from '../../context/LanguageContext.tsx';
import style from './Loading.module.css';

type LoadingProps = {
  progress: number; // 0-100
};

export default function Loading({ progress }: LoadingProps) {
  const { t } = useLanguage();

  return (
    <div className={style.overlay}>
      <span className={style.label}>{t('loading')}</span>
      <div className={style.barTrack}>
        <div className={style.barFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
