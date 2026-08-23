import { useEffect, useState } from 'react';

// Hauteur du clavier virtuel (visualViewport vs innerHeight), pour remonter les éléments position:fixed. 0 si l'API n'est pas supportée.
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
