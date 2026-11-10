import { useEffect, useState } from 'react';

// true si la largeur < breakpoint (px) ; pilote du comportement React, pas juste du CSS.
export function useBreakpoint(breakpoint: number) {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}

// Media query quelconque, réactive (ex. '(hover: none)' pour détecter un écran tactile).
export function useMediaQuery(query: string) {
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
