import { useEffect, useState } from 'react';

/**
 * Hauteur (px) occupée par le clavier virtuel mobile, déduite de l'écart entre
 * le viewport visuel (`window.visualViewport`, qui rétrécit quand le clavier
 * s'ouvre) et le viewport de layout (`window.innerHeight`, qui lui ne bouge
 * pas sur la plupart des navigateurs mobiles). Un élément en `position: fixed`
 * reste positionné par rapport au viewport de layout, donc sans ce correctif
 * il se retrouve caché sous le clavier au lieu de remonter au-dessus.
 * 0 si l'API n'est pas supportée (le comportement retombe alors sur du CSS classique).
 */
export function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const offsetBottom = window.innerHeight - (viewport.height + viewport.offsetTop);
      setInset(Math.max(0, Math.round(offsetBottom)));
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  return inset;
}
