import { useEffect, type CSSProperties, type ReactNode } from 'react';

import { SPRITE_ICONS_URL } from '../../../config.ts';
import CloseButton from '../overlay/CloseButton.tsx';
import style from './MainModal.module.css';

type MainModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

const spriteIconsStyle = { '--sprite-icons': `url(${SPRITE_ICONS_URL})` } as CSSProperties;

export default function MainModal({ title, onClose, children }: MainModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={style.backdrop} style={spriteIconsStyle} onClick={onClose}>
      <div
        className={style.panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <h2 className={style.title}>{title}</h2>
          <CloseButton onClick={onClose} />
        </div>
        <div className={style.content}>{children}</div>
      </div>
    </div>
  );
}
