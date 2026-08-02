import { useEffect, useRef } from 'react';

const ERASE_INTERVAL_MS = 30;
const TYPE_INTERVAL_MS = 45;

const CURSOR = '_';

export function useTypewriterTitle(text: string) {
  const currentRef = useRef('');

  useEffect(() => {
    const from = currentRef.current;
    const to = text;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeFrom = (len: number) => {
      document.title = `${to.slice(0, len)}${CURSOR}`;
      if (len < to.length) {
        timeoutId = setTimeout(() => typeFrom(len + 1), TYPE_INTERVAL_MS);
      } else {
        currentRef.current = to;
      }
    };

    const eraseFrom = (len: number) => {
      document.title = `${from.slice(0, len)}${CURSOR}`;
      if (len > 0) {
        timeoutId = setTimeout(() => eraseFrom(len - 1), ERASE_INTERVAL_MS);
      } else {
        typeFrom(0);
      }
    };

    eraseFrom(from.length);

    return () => clearTimeout(timeoutId);
  }, [text]);
}