import { useState } from 'react';

import type { Language } from '../../../config.ts';
import { t } from '../../../lang.ts';
import style from './SoundToggle.module.css';

type SoundToggleProps = {
  language: Language;
};

export default function SoundToggle({ language }: SoundToggleProps) {
  const [muted, setMuted] = useState(true);

  const label = t(language, muted ? 'soundToggle.unmute' : 'soundToggle.mute');

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