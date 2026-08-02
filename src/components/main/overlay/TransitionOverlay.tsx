import style from './TransitionOverlay.module.css';

type TransitionOverlayProps = {
  visible: boolean;
  onTransitionEnd: () => void;
};

export default function TransitionOverlay({ visible, onTransitionEnd }: TransitionOverlayProps) {
  return (
    <div className={style.overlay} style={{ opacity: visible ? 1 : 0 }} onTransitionEnd={onTransitionEnd} />
  );
}