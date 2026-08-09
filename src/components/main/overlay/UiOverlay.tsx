import type { Language } from '../../../config.ts';
import LanguageToggle from './LanguageToggle.tsx';
import FullscreenToggle from './FullscreenToggle.tsx';
import SoundToggle from './SoundToggle.tsx';
import GitHubButton from './GitHubButton.tsx';
import style from './UiOverlay.module.css';

type UiOverlayProps = {
  language: Language;
  onToggleLanguage: () => void;
};

export default function UiOverlay({ language, onToggleLanguage }: UiOverlayProps) {
  return (
    <>
      <div className={style.container}>
        <LanguageToggle language={language} onToggle={onToggleLanguage} />
        <FullscreenToggle language={language} />
        <SoundToggle language={language} />
      </div>
      <div className={style.bottomContainer}>
        <GitHubButton language={language} />
      </div>
    </>
  );
}