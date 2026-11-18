import { useCallback, useEffect, type RefObject, useRef, useState } from 'react';

interface CharacterMovementOptions {
  wrap?: boolean;
  wrapDelayMs?: number;
  onWrapStart?: () => void;
}

const MOVEMENT_SPEED_MULTIPLIER = 2;

export function useCharacterMovement(
  containerRef: RefObject<HTMLElement | null>,
  characterRef: RefObject<HTMLElement | null>,
  speed = 220,
  initialX = 190,
  options: CharacterMovementOptions = {},
) {
  const [posX, setPosX] = useState(initialX);
  const [isRight, setIsRight] = useState(false);
  const [isLeft, setIsLeft] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const posXRef = useRef(initialX);
  const boundsRef = useRef({ min: 0, max: 0 });
  const idleTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const jumpTimerRef = useRef<number | null>(null);
  const wrapTimerRef = useRef<number | null>(null);
  const isWrappingRef = useRef(false);
  const keyLeftRef = useRef(false);
  const keyRightRef = useRef(false);
  const optionsRef = useRef(options);

  optionsRef.current = options;

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const startIdleTimer = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = window.setTimeout(() => {
      setIsLeft(false);
      setIsRight(false);
    }, 1000);
  }, [clearIdleTimer]);

  const updateBounds = () => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const worldWidth = containerRef.current?.scrollWidth ?? containerWidth;
    const characterWidth = characterRef.current?.offsetWidth ?? 0;
    const min = 70;
    const max = Math.max(min, worldWidth - characterWidth - 70);
    boundsRef.current = { min, max };
    setPosX((prev) => {
      const next = Math.max(min, Math.min(max, prev));
      posXRef.current = next;
      return next;
    });
  };

  const syncCamera = () => {
    const container = containerRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const target = Math.max(0, Math.min(maxScroll, posXRef.current - container.clientWidth * 0.45));
    const diff = target - container.scrollLeft;

    if (Math.abs(diff) < 0.5) {
      container.scrollLeft = target;
      return;
    }

    container.scrollLeft += diff * 0.14;
  };

  const jumpCameraTo = (x: number) => {
    const container = containerRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    container.scrollLeft = Math.max(0, Math.min(maxScroll, x - container.clientWidth * 0.45));
  };

  const scheduleWrap = (targetX: number) => {
    if (isWrappingRef.current) return;

    isWrappingRef.current = true;
    keyLeftRef.current = false;
    keyRightRef.current = false;
    setIsLeft(false);
    setIsRight(false);
    optionsRef.current.onWrapStart?.();

    if (wrapTimerRef.current) clearTimeout(wrapTimerRef.current);
    wrapTimerRef.current = window.setTimeout(() => {
      posXRef.current = targetX;
      setPosX(targetX);
      jumpCameraTo(targetX);
      isWrappingRef.current = false;
      wrapTimerRef.current = null;
      lastTsRef.current = null;
    }, optionsRef.current.wrapDelayMs ?? 180);
  };

  const startJump = useCallback(() => {
    if (jumpTimerRef.current) return;
    setIsJumping(true);
    jumpTimerRef.current = window.setTimeout(() => {
      setIsJumping(false);
      jumpTimerRef.current = null;
    }, 560);
  }, []);

  const moveLeft = useCallback(() => {
    clearIdleTimer();
    keyLeftRef.current = true;
    keyRightRef.current = false;
    setIsLeft(true);
    setIsRight(false);
  }, [clearIdleTimer]);

  const moveRight = useCallback(() => {
    clearIdleTimer();
    keyRightRef.current = true;
    keyLeftRef.current = false;
    setIsRight(true);
    setIsLeft(false);
  }, [clearIdleTimer]);

  const stopMove = useCallback((direction?: 'left' | 'right') => {
    if (direction === 'left') {
      keyLeftRef.current = false;
    } else if (direction === 'right') {
      keyRightRef.current = false;
    } else {
      keyLeftRef.current = false;
      keyRightRef.current = false;
    }

    if (keyLeftRef.current) {
      setIsLeft(true);
      setIsRight(false);
      return;
    }

    if (keyRightRef.current) {
      setIsRight(true);
      setIsLeft(false);
      return;
    }

    startIdleTimer();
  }, [startIdleTimer]);

  const tick = (ts: number) => {
    if (lastTsRef.current == null) lastTsRef.current = ts;
    const dt = Math.min((ts - (lastTsRef.current ?? ts)) / 1000, 0.05);
    lastTsRef.current = ts;

    const left = keyLeftRef.current;
    const right = keyRightRef.current;
    if (!isWrappingRef.current && left !== right) {
      setPosX((prev) => {
        const dir = right ? 1 : -1;
        const { min, max } = boundsRef.current;
        const isMobile = window.matchMedia('(max-width: 760px)').matches;
        const activeSpeed = (isMobile ? speed * 1.4 : speed) * MOVEMENT_SPEED_MULTIPLIER;
        const rawNext = prev + activeSpeed * dir * dt;

        if (optionsRef.current.wrap) {
          if (rawNext > max) {
            scheduleWrap(min);
            return prev;
          }

          if (rawNext < min) {
            scheduleWrap(max);
            return prev;
          }
        }

        const next = Math.max(min, Math.min(max, rawNext));
        posXRef.current = next;
        return next;
      });
    }
    syncCamera();
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const resetMovement = () => {
      keyLeftRef.current = false;
      keyRightRef.current = false;
      clearIdleTimer();
      setIsLeft(false);
      setIsRight(false);
      lastTsRef.current = null;
    };
    const handleVisibilityChange = () => {
      if (document.hidden) resetMovement();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        moveRight();
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        moveLeft();
      } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowUp' || e.key === 'Up') {
        e.preventDefault();
        startJump();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        stopMove('right');
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        stopMove('left');
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', resetMovement);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    updateBounds();

    const resizeObserver = new ResizeObserver(updateBounds);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (characterRef.current) resizeObserver.observe(characterRef.current);
    window.addEventListener('resize', updateBounds);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', resetMovement);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', updateBounds);
      resizeObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
      if (wrapTimerRef.current) clearTimeout(wrapTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveLeft, moveRight, startJump, stopMove]);

  return { posX, isLeft, isRight, isJumping, moveLeft, moveRight, stopMove, jump: startJump };
}
