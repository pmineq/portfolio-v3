import { useEffect, useRef, useState } from 'react';

export function useCharacterMovement(minX = -45, maxX = 40, speed = 22) {
  const [posVW, setPosVW] = useState(0);
  const [isRight, setIsRight] = useState(false);
  const [isLeft, setIsLeft] = useState(false);

  const idleTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const keyLeftRef = useRef(false);
  const keyRightRef = useRef(false);

  const startIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setIsLeft(false);
      setIsRight(false);
    }, 1000);
  };

  const tick = (ts: number) => {
    if (lastTsRef.current == null) lastTsRef.current = ts;
    const dt = (ts - (lastTsRef.current || ts)) / 1000;
    lastTsRef.current = ts;

    const left = keyLeftRef.current;
    const right = keyRightRef.current;
    if (left !== right) {
      setPosVW((prev) => {
        const dir = right ? 1 : -1;
        const next = Math.max(minX, Math.min(maxX, prev + speed * dir * dt));
        return next;
      });
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        keyRightRef.current = true;
        keyLeftRef.current = false;
        setIsRight(true);
        setIsLeft(false);
        startIdleTimer();
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        keyLeftRef.current = true;
        keyRightRef.current = false;
        setIsLeft(true);
        setIsRight(false);
        startIdleTimer();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        keyRightRef.current = false;
        if (keyLeftRef.current) {
          setIsLeft(true);
          setIsRight(false);
        }
        if (!keyLeftRef.current && !keyRightRef.current) startIdleTimer();
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        keyLeftRef.current = false;
        if (keyRightRef.current) {
          setIsRight(true);
          setIsLeft(false);
        }
        if (!keyLeftRef.current && !keyRightRef.current) startIdleTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { posVW, isLeft, isRight };
}
