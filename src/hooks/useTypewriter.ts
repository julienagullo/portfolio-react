import { useEffect, useState } from 'react';

const DEFAULT_TYPE_INTERVAL_MS = 45;

// Anime text lettre par lettre tant que active est vrai ; voir useTypewriterTitle pour la variante titre de page.
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
