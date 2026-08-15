import { useState } from 'react';

import { useLanguage } from '../../../context/LanguageContext.tsx';
import style from './SoundButton.module.css';

export default function SoundButton() {
  const { t } = useLanguage();
  const [muted, setMuted] = useState(true);

  const label = t(muted ? 'soundToggle.unmute' : 'soundToggle.mute');

  return (
    <button
      type="button"
      className={`${style.toggle} ${muted ? style.muted : style.unmuted}`}
      onClick={() => setMuted((prev) => !prev)}
      aria-label={label}
      title={label}
    />
  );
}
