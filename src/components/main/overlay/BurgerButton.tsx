import type { CSSProperties } from 'react';

import { SPRITE_ICONS_URL } from '../../../config/config.ts';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import style from './BurgerButton.module.css';

const spriteIconsStyle = { '--sprite-icons': `url(${SPRITE_ICONS_URL})` } as CSSProperties;

type BurgerButtonProps = {
  onClick: () => void;
};

export default function BurgerButton({ onClick }: BurgerButtonProps) {
  const { t } = useLanguage();
  const label = t('roomMenuToggle');

  return (
    <div className={style.wrapper}>
      <button
        type="button"
        className={style.toggle}
        style={spriteIconsStyle}
        onClick={onClick}
        aria-label={label}
        title={label}
      />
    </div>
  );
}
