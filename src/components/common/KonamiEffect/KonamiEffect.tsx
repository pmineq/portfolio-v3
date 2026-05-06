import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import cx from 'classnames';
import './KonamiEffect.scss';

const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9a3c', '#ff84ab'];

interface Props { onDone: () => void }

export default function KonamiEffect({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  const particles = useMemo(() =>
    Array.from({ length: 70 }, (_, i) => {
      const angle = ((i / 70) * 360 + (Math.random() * 30 - 15)) * (Math.PI / 180);
      const dist = 160 + Math.random() * 280;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.floor(Math.random() * 9),
        dur: 1.6 + Math.random() * 1.2,
        rot: (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 400),
      };
    }),
  []);

  return (
    <div className={cx('konami-overlay')} onClick={onDone} role="button" tabIndex={0} aria-label="닫기">
      <div className={cx('konami-burst')}>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className={cx('konami-particle')}
            style={{ background: p.color, width: p.size, height: p.size }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x: p.x, y: p.y + 80, opacity: 0, rotate: p.rot, scale: 0.2 }}
            transition={{ duration: p.dur, ease: 'easeOut' }}
          />
        ))}
      </div>
      <motion.div
        className={cx('konami-card')}
        initial={{ scale: 0, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.45, delay: 0.1 }}
      >
        <div className={cx('konami-card__title')}>KONAMI CODE!</div>
        <div className={cx('konami-card__sub')}>↑↑↓↓←→←→BA 입력 성공 🎊</div>
        <div className={cx('konami-card__hint')}>클릭해서 닫기</div>
      </motion.div>
    </div>
  );
}
