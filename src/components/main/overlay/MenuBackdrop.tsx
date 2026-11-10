import style from './MenuBackdrop.module.css';

type MenuBackdropProps = {
  visible: boolean;
  onClose: () => void;
};

// Fond assombri sous le menu des salles (mode burger) ; un tap dessus referme le menu.
// Toujours monté pour animer le fondu à l'ouverture comme à la fermeture.
export default function MenuBackdrop({ visible, onClose }: MenuBackdropProps) {
  return (
    <div
      className={visible ? `${style.backdrop} ${style.visible}` : style.backdrop}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
