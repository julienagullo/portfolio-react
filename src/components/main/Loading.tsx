import style from './Loading.module.css';

type LoadingProps = {
  progress: number; // 0-100
};

export default function Loading({ progress }: LoadingProps) {
  return (
    <div className={style.overlay}>
      <div className={style.barTrack}>
        <div className={style.barFill} style={{ width: `${progress}%` }} />
      </div>
      <span className={style.label}>{Math.round(progress)}%</span>
    </div>
  );
}