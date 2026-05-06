import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cx from 'classnames';
import { ACHIEVEMENTS, useGame } from 'context/GameContext';
import './AchievementDex.scss';

const ACHIEVEMENT_HINTS: Record<string, string> = {
  first_visit: '처음 접속하면 자연스럽게 열립니다.',
  first_jump: '위쪽 방향키나 스페이스로 가볍게 뛰어보세요.',
  dark_mode: '하늘에 있는 해와 달을 살펴보세요.',
  silent_runner: '소리를 잠시 꺼두고 조용히 움직여보세요.',
  talk_npc: '땅 위의 가이드에게 말을 걸어보세요.',
  guide_regular: '고양이를 귀찮게 해보자.',
  chatterbox: '플레이어 캐릭터와 여러 번 대화해보세요.',
  sky_talker: '하늘에 떠 있는 친구도 클릭할 수 있습니다.',
  star_catcher: '밤하늘에서 반짝이며 지나가는 것을 잡아보세요.',
  moonlight_hunter: '밤이 된 뒤에 별똥별을 잡아보세요.',
  jump_collector: '공중 아이템 근처에서 점프해보세요.',
  mail_carrier: 'Contact에서 메시지를 보내보세요.',
  lost_explorer: '없는 주소로 살짝 길을 잃어보세요.',
  secret_shopper: '홈 어딘가의 작은 표지판을 찾아보세요.',
  explorer: 'About, Career, Contact를 모두 둘러보세요.',
  legendary: '나머지 업적을 모두 모으면 열립니다.',
};

interface AchievementDexProps {
  open: boolean;
  onClose: () => void;
}

export default function AchievementDex({ open, onClose }: AchievementDexProps) {
  const { unlocked, playClick } = useGame();
  const unlockedCount = ACHIEVEMENTS.filter(achievement => unlocked.has(achievement.id)).length;

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleClose = () => {
    playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cx('ach-dex')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="achievement-dex-title"
        >
          <button
            type="button"
            className={cx('ach-dex__backdrop')}
            aria-label="업적 도감 닫기"
            onClick={handleClose}
          />
          <motion.section
            className={cx('ach-dex__panel')}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <header className={cx('ach-dex__header')}>
              <div>
                <span className={cx('ach-dex__eyebrow')}>COLLECTION</span>
                <h2 id="achievement-dex-title">업적 도감</h2>
              </div>
              <strong className={cx('ach-dex__progress')}>
                {unlockedCount}/{ACHIEVEMENTS.length}
              </strong>
              <button
                type="button"
                className={cx('ach-dex__close')}
                onClick={handleClose}
                aria-label="업적 도감 닫기"
              >
                x
              </button>
            </header>

            <div className={cx('ach-dex__meter')} aria-hidden>
              <span style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }} />
            </div>

            <ul className={cx('ach-dex__grid')}>
              {ACHIEVEMENTS.map(achievement => {
                const isUnlocked = unlocked.has(achievement.id);

                return (
                  <li
                    key={achievement.id}
                    className={cx('ach-dex__item', { 'is-locked': !isUnlocked })}
                  >
                    <span className={cx('ach-dex__icon')} aria-hidden>
                      {isUnlocked ? achievement.icon : '?'}
                    </span>
                    <div className={cx('ach-dex__text')}>
                      <strong>{isUnlocked ? achievement.title : '???'}</strong>
                      <span>{isUnlocked ? achievement.desc : ACHIEVEMENT_HINTS[achievement.id]}</span>
                    </div>
                    <span className={cx('ach-dex__state')}>
                      {isUnlocked ? 'GET' : 'LOCK'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
