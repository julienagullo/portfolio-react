import { useEffect, useState } from 'react';

import type { Language } from '../../config.ts';
import { t } from '../../lang.ts';
import style from './OrientationGate.module.css';

function isPortraitMobile() {
  return window.matchMedia('(pointer: coarse)').matches && window.matchMedia('(orientation: portrait)').matches;
}

type OrientationGateProps = {
  language: Language;
};

export default function OrientationGate({ language }: OrientationGateProps) {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const update = () => setBlocked(isPortraitMobile());
    update();

    const orientationQuery = window.matchMedia('(orientation: portrait)');
    orientationQuery.addEventListener('change', update);
    window.addEventListener('resize', update);

    return () => {
      orientationQuery.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (!blocked) return null;

  return (
    <div className={style.overlay}>
      <p>{t(language, 'orientationGate')}</p>
    </div>
  );
}