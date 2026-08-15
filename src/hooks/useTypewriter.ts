import { useEffect, useState } from 'react';

const DEFAULT_TYPE_INTERVAL_MS = 45;

// Anime `text` lettre par lettre tant que `active` est vrai (effet machine à
// écrire) ; revient à une chaîne vide dès que `active` repasse à faux. Version
// générique déclenchée par un booléen (hover, focus...) — voir
// useTypewriterTitle pour la variante dédiée au titre de la page (cycle
// efface + réécrit en continu).
export function useTypewriter(text: string, active: boolean, intervalMs = DEFAULT_TYPE_INTERVAL_MS) {
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (!active) {
      setOutput('');
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const typeFrom = (len: number) => {
      setOutput(text.slice(0, len));
      if (len < text.length) {
        timeoutId = setTimeout(() => typeFrom(len + 1), intervalMs);
      }
    };

    typeFrom(0);

    return () => clearTimeout(timeoutId);
  }, [active, text, intervalMs]);

  return output;
}
