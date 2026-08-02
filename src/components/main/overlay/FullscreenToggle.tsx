import { useEffect, useState } from 'react';

import type { Language } from '../../../config.ts';
import { t } from '../../../lang.ts';
import style from './FullscreenToggle.module.css';

type FullscreenToggleProps = {
  language: Language;
};

export default function FullscreenToggle({ language }: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const update = () => setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const label = t(language, isFullscreen ? 'fullscreenToggle.exit' : 'fullscreenToggle.enter');

  return (
    <button
      type="button"
      className={`${style.toggle} ${isFullscreen ? style.exit : style.enter}`}
      onClick={toggleFullscreen}
      aria-label={label}
      title={label}
    />
  );
}