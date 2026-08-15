import { useAudio } from '../../../context/AudioContext.tsx';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import style from './SoundButton.module.css';

export default function SoundButton() {
  const { t } = useLanguage();
  const { muted, toggleMute } = useAudio();

  const label = t(muted ? 'soundToggle.unmute' : 'soundToggle.mute');

  return (
    <button
      type="button"
      className={`${style.toggle} ${muted ? style.muted : style.unmuted}`}
      onClick={toggleMute}
      aria-label={label}
      title={label}
    />
  );
}
