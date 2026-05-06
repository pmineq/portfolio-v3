import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import cx from 'classnames';
import LocationHUD from 'components/common/LocationHUD/LocationHUD';
import { useGame } from 'context/GameContext';
import { useCharacterMovement } from 'pages/Home/hook/useCharacterMovement';
import './About.scss';

const STATIONS = [
  {
    id: 'profile',
    title: 'PROFILE DESK',
    label: '프로필 책상',
    x: 540,
    body: '화면의 분위기, 사용 흐름, 작은 피드백까지 함께 설계하는 프론트엔드 개발자입니다.',
    tags: ['UI 설계', '인터랙션', '반응형'],
  },
  {
    id: 'skills',
    title: 'SKILL SHELF',
    label: '스킬 서가',
    x: 1060,
    body: 'React, TypeScript, SCSS를 중심으로 읽기 좋고 유지보수하기 쉬운 UI를 만듭니다.',
    tags: ['React', 'TypeScript', 'SCSS'],
  },
  {
    id: 'style',
    title: 'WORK STYLE',
    label: '작업 방식',
    x: 1690,
    body: '작은 상태 변화와 사용자의 다음 행동을 놓치지 않도록 화면을 계속 다듬습니다.',
    tags: ['디테일', '사용성', '문제 추적'],
  },
];

const EXIT_DOOR_X = 210;
const HOME_PORTAL_X = 1120;

export default function About() {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLDivElement | null>(null);
  const { posX, isLeft, isRight, isJumping, moveLeft, moveRight, stopMove, jump } =
    useCharacterMovement(contentRef, characterRef);
  const { playClick, playTransition, playWalk, unlocked } = useGame();
  const [isStatusVisible, setIsStatusVisible] = useState(false);

  const activeStation = useMemo(
    () => STATIONS.find(station => Math.abs(posX - station.x) < 240) ?? STATIONS[0],
    [posX],
  );
  const isStationActive = Math.abs(posX - activeStation.x) < 240;
  const isExitActive = Math.abs(posX - EXIT_DOOR_X) < 170;

  const exitToHome = useCallback(() => {
    playClick();
    playTransition();
    navigate('/', { state: { spawnX: HOME_PORTAL_X } });
  }, [navigate, playClick, playTransition]);

  const showStationInfo = useCallback(() => {
    if (!isStationActive) return;
    playClick();
    setIsStatusVisible(true);
  }, [isStationActive, playClick]);

  useEffect(() => {
    const handleExit = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (isExitActive) {
        exitToHome();
        return;
      }
      showStationInfo();
    };

    window.addEventListener('keydown', handleExit);
    return () => window.removeEventListener('keydown', handleExit);
  }, [exitToHome, isExitActive, showStationInfo]);

  useEffect(() => {
    setIsStatusVisible(false);
  }, [activeStation.id]);

  useEffect(() => {
    if (!isLeft && !isRight) return;
    const id = window.setInterval(() => playWalk(), 350);
    return () => clearInterval(id);
  }, [isLeft, isRight, playWalk]);

  return (
    <div className={cx('about')}>
      <div className={cx('about-content')} ref={contentRef}>
        <LocationHUD variant="content" />

        <div className={cx('about-world')}>
          <motion.header
            className={cx('about-title')}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span>CHARACTER ROOM</span>
            <h2>About Mine</h2>
          </motion.header>

          <div className={cx('about-room')} aria-hidden />

          <button
            type="button"
            className={cx('about-exit-door', { 'is-active': isExitActive })}
            style={{ '--exit-x': `${EXIT_DOOR_X}px` } as CSSProperties}
            onClick={exitToHome}
            aria-label="Home으로 돌아가기"
          >
            <span className={cx('about-exit-door__prompt')}>
              {isExitActive ? 'Enter HOME' : 'HOME'}
            </span>
          </button>

          <div className={cx('about-stations')}>
            {STATIONS.map(station => (
              <button
                key={station.id}
                type="button"
                className={cx('about-station', `about-station--${station.id}`, {
                  'is-active': activeStation.id === station.id,
                  'is-panel-open':
                    isStatusVisible && isStationActive && activeStation.id === station.id,
                })}
                style={{ '--station-x': `${station.x}px` } as CSSProperties}
                onClick={showStationInfo}
                aria-label={station.label}
              >
                <span className={cx('about-station__icon')} />
                <span className={cx('about-station__prompt')}>Enter</span>
                <span className={cx('about-station__label')}>{station.label}</span>
              </button>
            ))}
          </div>

          <div className={cx('about-floor')} aria-hidden />

          <div
            ref={characterRef}
            className={cx('about-character', {
              'about-character--left': isLeft,
              'about-character--right': isRight,
              'about-character--jump': isJumping,
            })}
            style={{ '--character-x': `${posX}px` } as CSSProperties}
            role="img"
            aria-label="이동 중인 캐릭터"
          >
            {unlocked.has('legendary') && (
              <span className={cx('about-character__reward')} aria-label="전설의 왕관 스킨" />
            )}
            <span className={cx('about-character__name')}>MINE</span>
          </div>

          <aside
            className={cx('about-status', { 'is-visible': isStatusVisible && isStationActive })}
            style={{ '--status-x': `${activeStation.x}px` } as CSSProperties}
          >
            <div className={cx('about-status__bar')}>
              <span>{activeStation.title}</span>
              <strong>Lv.6</strong>
            </div>
            <p>{activeStation.body}</p>
            <div className={cx('about-status__tags')}>
              {activeStation.tags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className={cx('about-mobile-controls')} aria-label="모바일 이동 키패드">
        <button
          type="button"
          className={cx('about-mobile-key')}
          onPointerDown={moveLeft}
          onPointerUp={() => stopMove('left')}
          onPointerCancel={() => stopMove('left')}
          aria-label="왼쪽 이동"
        >
          ←
        </button>
        <button
          type="button"
          className={cx('about-mobile-key')}
          onPointerDown={jump}
          aria-label="점프"
        >
          ↑
        </button>
        <button
          type="button"
          className={cx('about-mobile-key')}
          onPointerDown={moveRight}
          onPointerUp={() => stopMove('right')}
          onPointerCancel={() => stopMove('right')}
          aria-label="오른쪽 이동"
        >
          →
        </button>
        <button
          type="button"
          className={cx('about-mobile-key', 'about-mobile-key--enter')}
          onClick={isExitActive ? exitToHome : showStationInfo}
          disabled={!isExitActive && !isStationActive}
          aria-label="Enter"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
