import type { CSSProperties } from 'react';

import { SPRITE_ICONS_URL, type Language } from '../../../config.ts';
import LanguageToggle from './LanguageToggle.tsx';
import FullscreenToggle from './FullscreenToggle.tsx';
import SoundToggle from './SoundToggle.tsx';
import GitHubButton from './GitHubButton.tsx';
import style from './UiOverlay.module.css';

type UiOverlayProps = {
  language: Language;
  onToggleLanguage: () => void;
};

// Injectée en variable CSS plutôt qu'en url() en dur dans les .module.css :
// voir le commentaire dans IconButton.module.css.
const spriteIconsStyle = { '--sprite-icons': `url(${SPRITE_ICONS_URL})` } as CSSProperties;

export default function UiOverlay({ language, onToggleLanguage }: UiOverlayProps) {
  return (
    <>
      <div className={style.container} style={spriteIconsStyle}>
        <LanguageToggle language={language} onToggle={onToggleLanguage} />
        <FullscreenToggle language={language} />
        <SoundToggle language={language} />
      </div>
      <div className={style.bottomContainer} style={spriteIconsStyle}>
        <GitHubButton language={language} />
      </div>
    </>
  );
}