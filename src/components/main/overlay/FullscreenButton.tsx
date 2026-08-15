import { useEffect, useState } from 'react';

import { useLanguage } from '../../../context/LanguageContext.tsx';
import style from './FullscreenButton.module.css';

export default function FullscreenButton() {
  const { t } = useLanguage();
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

  const label = t(isFullscreen ? 'fullscreenToggle.exit' : 'fullscreenToggle.enter');

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
