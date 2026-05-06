import { useEffect, useRef } from 'react';

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export function useKonamiCode(onSuccess: () => void) {
  const posRef = useRef(0);
  const cbRef = useRef(onSuccess);
  cbRef.current = onSuccess;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        posRef.current = 0;
        return;
      }
      if (e.key === SEQUENCE[posRef.current]) {
        posRef.current += 1;
        if (posRef.current === SEQUENCE.length) {
          posRef.current = 0;
          cbRef.current();
        }
      } else {
        posRef.current = e.key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
