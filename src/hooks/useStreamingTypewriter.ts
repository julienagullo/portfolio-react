import { useEffect, useRef, useState } from 'react';

const DEFAULT_INTERVAL_MS = 18;

/**
 * Variante de useTypewriter pour un texte qui arrive progressivement (ex.
 * streaming réseau) plutôt que connu d'avance : avance vers `target` sans
 * jamais reculer, rattrape automatiquement si la cible grandit plus vite
 * que la frappe. Repart de zéro dès que `target` redevient vide (nouvelle
 * question) plutôt que d'essayer de "reculer" lettre par lettre.
 */
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
