import { useEffect, useRef, useState } from 'react';

const DEFAULT_INTERVAL_MS = 18;

// Variante streaming de useTypewriter : avance vers target sans jamais reculer, repart de zéro si target redevient vide.
export function useStreamingTypewriter(target: string, intervalMs = DEFAULT_INTERVAL_MS): string {
  const [displayed, setDisplayed] = useState('');
  const targetRef = useRef(target);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    const interval = setInterval(() => {
      const full = targetRef.current;
      setDisplayed((prev) => {
        if (full === '') return prev === '' ? prev : '';
        return prev.length >= full.length ? prev : full.slice(0, prev.length + 1);
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return displayed;
}
