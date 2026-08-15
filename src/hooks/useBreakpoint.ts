import { useEffect, useState } from 'react';

/**
 * true si la largeur de la fenêtre est strictement inférieure à `breakpoint` (px).
 * Recalculé au resize/changement d'orientation — pour piloter du comportement React
 * (ex. afficher le burger mobile), pas seulement du CSS.
 */
export function useBreakpoint(breakpoint: number) {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
