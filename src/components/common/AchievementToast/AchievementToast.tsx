import { AnimatePresence, motion } from 'framer-motion';
import cx from 'classnames';
import { useGame } from 'context/game';
import './AchievementToast.scss';

export default function AchievementToast() {
  const { toast, dismissToast } = useGame();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className={cx('ach-toast')}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={dismissToast}
          role="status"
          aria-live="polite"
        >
          <div className={cx('ach-toast__label')}>ACHIEVEMENT UNLOCKED</div>
          <div className={cx('ach-toast__body')}>
            <span className={cx('ach-toast__icon')}>{toast.icon}</span>
            <div className={cx('ach-toast__text')}>
              <strong className={cx('ach-toast__title')}>{toast.title}</strong>
              <span className={cx('ach-toast__desc')}>{toast.desc}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
