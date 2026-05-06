import { motion } from 'framer-motion';
import cx from 'classnames';
import { useLocation } from 'react-router-dom';
import './LocationHUD.scss';

const LOCATIONS: Record<string, { label: string; icon: string }> = {
  '/':         { label: "MINE's WORLD",  icon: '🏘️' },
  '/about':    { label: '캐릭터 정보실', icon: '🗂️' },
  '/career':   { label: '커리어 로드', icon: '📜' },
  '/contact':  { label: '편지 배달부',   icon: '📮' },
};

type LocationHUDProps = {
  variant?: 'fixed' | 'content';
};

export default function LocationHUD({ variant = 'fixed' }: LocationHUDProps) {
  const { pathname } = useLocation();
  if (pathname === '/') return null;

  const loc = LOCATIONS[pathname] ?? { label: '알 수 없는 장소', icon: '❓' };

  return (
    <motion.div
      key={pathname}
      className={cx('location-hud', `location-hud--${variant}`)}
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
    >
      <span className={cx('location-hud__icon')}>{loc.icon}</span>
      <div className={cx('location-hud__text')}>
        <span className={cx('location-hud__eyebrow')}>현재 위치</span>
        <span className={cx('location-hud__name')}>{loc.label}</span>
      </div>
    </motion.div>
  );
}
