import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { ACHIEVEMENTS, GameContext, type Achievement } from './game';

const REQUIRED_PAGES = ['/about', '/career', '/contact'];

// ─── Sound utilities ──────────────────────────────────────────────

function beep(
  ctx: AudioContext,
  freq: number,
  dur: number,
  vol = 0.07,
  type: OscillatorType = 'square',
  at = ctx.currentTime,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  gain.gain.setValueAtTime(vol, at);
  gain.gain.exponentialRampToValueAtTime(0.001, at + dur);
  osc.start(at);
  osc.stop(at + dur);
}

function readStoredSet(key: string) {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(key) ?? '[]'));
  } catch {
    return new Set<string>();
  }
}

function readStoredCounts() {
  try {
    return JSON.parse(localStorage.getItem('ach_cnt') ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

// ─── Provider ─────────────────────────────────────────────────────

export function GameProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(() => localStorage.getItem('muted') === 'true');
  const muteRef = useRef(muted);
  useEffect(() => {
    muteRef.current = muted;
  }, [muted]);

  const [unlocked, setUnlocked] = useState<Set<string>>(() => readStoredSet('ach'));

  const countsRef = useRef<Record<string, number>>(readStoredCounts());
  const visitedRef = useRef<Set<string>>(readStoredSet('ach_vis'));

  const [toast, setToast] = useState<Achievement | null>(null);
  const toastTimer = useRef<number | null>(null);
  const unlockRef = useRef<(id: string) => void>(() => undefined);

  const syncProgressFromStorage = useCallback(() => {
    setUnlocked(readStoredSet('ach'));
    countsRef.current = readStoredCounts();
    visitedRef.current = readStoredSet('ach_vis');
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) syncProgressFromStorage();
    };

    window.addEventListener('storage', syncProgressFromStorage);
    window.addEventListener('focus', syncProgressFromStorage);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', syncProgressFromStorage);
      window.removeEventListener('focus', syncProgressFromStorage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncProgressFromStorage]);

  const getAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new AudioContext();
    if (audioRef.current.state === 'suspended') void audioRef.current.resume();
    return audioRef.current;
  }, []);

  const play = useCallback(
    (fn: (ctx: AudioContext) => void) => {
      if (muteRef.current) return;
      try {
        fn(getAudio());
      } catch {
        /* browser audio policy */
      }
    },
    [getAudio],
  );

  const showToast = useCallback((ach: Achievement) => {
    setToast(ach);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4500);
  }, []);

  // play achievement sound when toast appears
  useEffect(() => {
    if (!toast) return;
    play((ctx) => {
      [261.63, 329.63, 392, 523.25].forEach((freq, i) =>
        beep(ctx, freq, 0.14, 0.08, 'square', ctx.currentTime + i * 0.1),
      );
    });
  }, [toast, play]);

  const unlock = useCallback(
    (id: string) => {
      setUnlocked((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        localStorage.setItem('ach', JSON.stringify([...next]));
        const ach = ACHIEVEMENTS.find((a) => a.id === id);
        if (ach) showToast(ach);
        const baseIds = ACHIEVEMENTS.filter((a) => a.id !== 'legendary').map((a) => a.id);
        if (baseIds.every((bid) => next.has(bid)) && !next.has('legendary')) {
          window.setTimeout(() => unlockRef.current('legendary'), 2200);
        }
        return next;
      });
    },
    [showToast],
  );
  unlockRef.current = unlock;

  const increment = useCallback((key: string, threshold: number, achievementId: string) => {
    countsRef.current[key] = (countsRef.current[key] ?? 0) + 1;
    localStorage.setItem('ach_cnt', JSON.stringify(countsRef.current));
    if (countsRef.current[key] >= threshold) unlockRef.current(achievementId);
  }, []);

  const trackPage = useCallback((path: string) => {
    if (visitedRef.current.has(path)) return;
    visitedRef.current.add(path);
    localStorage.setItem('ach_vis', JSON.stringify([...visitedRef.current]));
    if (REQUIRED_PAGES.every((p) => visitedRef.current.has(p))) unlockRef.current('explorer');
  }, []);

  const playClick = useCallback(
    () =>
      play((ctx) => {
        beep(ctx, 440, 0.08, 0.07);
        beep(ctx, 220, 0.08, 0.04, 'square', ctx.currentTime + 0.05);
      }),
    [play],
  );

  const playWalk = useCallback(() => play((ctx) => beep(ctx, 160, 0.06, 0.04)), [play]);

  const playPhone = useCallback(
    () =>
      play((ctx) => {
        [0, 0.09, 0.24, 0.33].forEach((offset) => {
          beep(ctx, 92, 0.055, 0.045, 'sawtooth', ctx.currentTime + offset);
          beep(ctx, 138, 0.045, 0.026, 'square', ctx.currentTime + offset + 0.018);
        });
      }),
    [play],
  );

  const playCoffee = useCallback(
    () =>
      play((ctx) => {
        const now = ctx.currentTime;
        const steam = ctx.createOscillator();
        const steamGain = ctx.createGain();
        steam.connect(steamGain);
        steamGain.connect(ctx.destination);
        steam.type = 'sine';
        steam.frequency.setValueAtTime(180, now);
        steam.frequency.exponentialRampToValueAtTime(360, now + 0.42);
        steamGain.gain.setValueAtTime(0.001, now);
        steamGain.gain.linearRampToValueAtTime(0.038, now + 0.06);
        steamGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
        steam.start(now);
        steam.stop(now + 0.5);

        beep(ctx, 132, 0.18, 0.024, 'triangle', now + 0.02);
        [0.1, 0.18, 0.27].forEach((offset, i) => {
          beep(ctx, 420 + i * 52, 0.12, 0.012, 'sine', now + offset);
        });
      }),
    [play],
  );

  const playTransition = useCallback(
    () =>
      play((ctx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }),
    [play],
  );

  const playText = useCallback(
    () => play((ctx) => beep(ctx, 270 + Math.random() * 50, 0.04, 0.03)),
    [play],
  );

  const toggleMute = useCallback(() => {
    setMuted((v) => {
      const next = !v;
      localStorage.setItem('muted', String(next));
      if (next) unlockRef.current('silent_runner');
      return next;
    });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  // first_visit (only on first ever load)
  useEffect(() => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('ach') ?? '[]');
      if (!saved.includes('first_visit')) window.setTimeout(() => unlock('first_visit'), 1500);
    } catch {
      window.setTimeout(() => unlock('first_visit'), 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GameContext.Provider
      value={{
        muted,
        toggleMute,
        playClick,
        playWalk,
        playPhone,
        playCoffee,
        playTransition,
        playText,
        unlocked,
        toast,
        dismissToast,
        unlock,
        increment,
        trackPage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
