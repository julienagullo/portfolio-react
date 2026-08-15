import { useEffect, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext.tsx';
import style from './OrientationGate.module.css';

function isPortraitMobile() {
  return window.matchMedia('(pointer: coarse)').matches && window.matchMedia('(orientation: portrait)').matches;
}

export default function OrientationGate() {
  const { t } = useLanguage();
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
      <p>{t('orientationGate')}</p>
    </div>
  );
}
