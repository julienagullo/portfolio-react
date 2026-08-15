import type { CSSProperties } from 'react';

import { SPRITE_ICONS_URL } from '../../../config.ts';
import LanguageButton from './LanguageButton.tsx';
import FullscreenButton from './FullscreenButton.tsx';
import SoundButton from './SoundButton.tsx';
import GitHubButton from './GitHubButton.tsx';
import style from './UiOverlay.module.css';

// Injectée en variable CSS plutôt qu'en url() en dur dans les .module.css :
// voir le commentaire dans SpriteButton.module.css.
const spriteIconsStyle = { '--sprite-icons': `url(${SPRITE_ICONS_URL})` } as CSSProperties;

export default function UiOverlay() {
  return (
    <>
      <div className={style.container} style={spriteIconsStyle}>
        <LanguageButton />
        <FullscreenButton />
        <SoundButton />
      </div>
      <div className={style.bottomContainer} style={spriteIconsStyle}>
        <GitHubButton />
      </div>
    </>
  );
}
