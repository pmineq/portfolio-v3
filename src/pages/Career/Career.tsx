import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import cx from 'classnames';
import LocationHUD from 'components/common/LocationHUD/LocationHUD';
import { hasLegendaryReward, useGame } from 'context/GameContext';
import { useCharacterMovement } from 'pages/Home/hook/useCharacterMovement';
import './Career.scss';

const COMPANIES = [
  {
    id: 'first',
    label: '알디',
    title: '(주) 알디',
    role: '퍼블리셔',
    period: '2019.09 - 2022.06',
    x: 580,
    summary:
      '커머스, 엔터테인먼트, 이러닝 웹 서비스의 반응형/적응형 퍼블리싱과 디자인 작업을 수행했습니다.',
    works: ['현대Shop 초기 구축', 'GNB·상품정보 커스텀 UI', 'YG KPLUS 반응형 퍼블리싱', '이러닝 PC/Mobile 퍼블리싱'],
  },
  {
    id: 'second',
    label: '한국평가데이터',
    title: '한국평가데이터(주)',
    role: '공공사업부 연구원',
    period: '2023.02 - 2024.02',
    x: 1180,
    summary:
      'GIVC 대시보드 리뉴얼을 중심으로 산업 데이터 조회, 수급 분석, 운영 화면 퍼블리싱을 주도했습니다.',
    works: ['GIVC 대시보드 구축', 'amCharts5·Plotly 시각화', '3D Globe·차트 Zoom', '외주 개발 협업 리딩'],
  },
  {
    id: 'current',
    label: '빗썸',
    title: '(주) 빗썸',
    role: '웹FE개발실 · UI웹개발팀 대리',
    period: '2024.07 - 재직 중',
    x: 1890,
    summary:
      'React와 TypeScript 기반의 UI 개발, 공통 컴포넌트 구축, 인터랙션 개선을 통해 서비스 완성도를 높이고 있습니다.',
    works: ['React/TypeScript UI 개발', '공통 컴포넌트·디자인 시스템', 'Three.js 인터랙션 개선', '반응형 UI 가이드 정립'],
  },
];

const EXIT_DOOR_X = 250;
const HOME_PORTAL_X = 1850;

export default function Career() {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLDivElement | null>(null);
  const wrapTransitionTimer = useRef<number | null>(null);
  const [isWrapTransition, setIsWrapTransition] = useState(false);
  const handleWorldWrap = useCallback(() => {
    setIsWrapTransition(true);
    if (wrapTransitionTimer.current) clearTimeout(wrapTransitionTimer.current);
    wrapTransitionTimer.current = window.setTimeout(() => {
      setIsWrapTransition(false);
    }, 440);
  }, []);
  const { posX, isLeft, isRight, isJumping, moveLeft, moveRight, stopMove, jump } =
    useCharacterMovement(contentRef, characterRef, 220, 190, {
      wrap: true,
      onWrapStart: handleWorldWrap,
    });
  const { playClick, playTransition, playWalk, unlocked } = useGame();
  const hasLegendaryCrown = hasLegendaryReward(unlocked);
  const [isLogVisible, setIsLogVisible] = useState(false);

  const activeCompany = useMemo(
    () => COMPANIES.find(company => Math.abs(posX - company.x) < 280) ?? COMPANIES[0],
    [posX],
  );
  const isCompanyActive = Math.abs(posX - activeCompany.x) < 280;
  const isExitActive = Math.abs(posX - EXIT_DOOR_X) < 170;

  const exitToHome = useCallback(() => {
    playClick();
    playTransition();
    navigate('/', { state: { spawnX: HOME_PORTAL_X } });
  }, [navigate, playClick, playTransition]);

  const showCompanyInfo = useCallback(() => {
    if (!isCompanyActive) return;
    playClick();
    setIsLogVisible(true);
  }, [isCompanyActive, playClick]);

  useEffect(() => {
    const handleExit = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (isExitActive) {
        exitToHome();
        return;
      }
      showCompanyInfo();
    };

    window.addEventListener('keydown', handleExit);
    return () => window.removeEventListener('keydown', handleExit);
  }, [exitToHome, isExitActive, showCompanyInfo]);

  useEffect(() => {
    setIsLogVisible(isCompanyActive);
  }, [activeCompany.id, isCompanyActive]);

  useEffect(() => {
    if (!isLeft && !isRight) return;
    const id = window.setInterval(() => playWalk(), 350);
    return () => clearInterval(id);
  }, [isLeft, isRight, playWalk]);

  useEffect(() => () => {
    if (wrapTransitionTimer.current) clearTimeout(wrapTransitionTimer.current);
  }, []);

  return (
    <div className={cx('career')}>
      <div className={cx('career-content')} ref={contentRef}>
        <LocationHUD variant="content" />

        <div className={cx('career-world')}>
          <motion.header
            className={cx('career-title')}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span>CAREER STREET</span>
            <h2>Company Logs</h2>
          </motion.header>

          <div className={cx('career-skyline')} aria-hidden />

          <button
            type="button"
            className={cx('career-exit-door', { 'is-active': isExitActive })}
            style={{ '--exit-x': `${EXIT_DOOR_X}px` } as CSSProperties}
            onClick={exitToHome}
            aria-label="Home으로 돌아가기"
          >
            <span className={cx('career-exit-door__prompt')}>
              {isExitActive ? 'Enter HOME' : 'HOME'}
            </span>
          </button>

          <div className={cx('career-companies')}>
            {COMPANIES.map(company => (
              <button
                key={company.id}
                type="button"
                className={cx('career-company', `career-company--${company.id}`, {
                  'is-active': activeCompany.id === company.id,
                  'is-panel-open':
                    isLogVisible && isCompanyActive && activeCompany.id === company.id,
                })}
                style={{ '--company-x': `${company.x}px` } as CSSProperties}
                onClick={showCompanyInfo}
                aria-label={company.label}
              >
                <span className={cx('career-company__building')} />
                <span className={cx('career-company__sign')}>{company.label}</span>
              </button>
            ))}
          </div>

          <div className={cx('career-road')} aria-hidden />

          <div
            ref={characterRef}
            className={cx('career-character', {
              'career-character--left': isLeft,
              'career-character--right': isRight,
              'career-character--jump': isJumping,
            })}
            style={{ '--character-x': `${posX}px` } as CSSProperties}
            role="img"
            aria-label="이동 중인 캐릭터"
          >
            {hasLegendaryCrown && (
              <span className={cx('career-character__reward')} aria-label="전설의 왕관 스킨" />
            )}
            <span className={cx('career-character__name')}>MINE</span>
          </div>

          <aside
            className={cx('career-log', { 'is-visible': isLogVisible && isCompanyActive })}
            style={{ '--log-x': `${activeCompany.x}px` } as CSSProperties}
          >
            <div className={cx('career-log__bar')}>
              <span>{activeCompany.label}</span>
              <strong>{activeCompany.period}</strong>
            </div>
            <h3>{activeCompany.title}</h3>
            <p className={cx('career-log__role')}>{activeCompany.role}</p>
            <p>{activeCompany.summary}</p>
            <ul>
              {activeCompany.works.map(work => (
                <li key={work}>{work}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {isWrapTransition && (
          <motion.div
            className={cx('career-wrap-transition')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <div className={cx('career-mobile-controls')} aria-label="모바일 이동 키패드">
        <button
          type="button"
          className={cx('career-mobile-key')}
          onPointerDown={moveLeft}
          onPointerUp={() => stopMove('left')}
          onPointerCancel={() => stopMove('left')}
          aria-label="왼쪽 이동"
        >
          ←
        </button>
        <button
          type="button"
          className={cx('career-mobile-key')}
          onPointerDown={jump}
          aria-label="점프"
        >
          ↑
        </button>
        <button
          type="button"
          className={cx('career-mobile-key')}
          onPointerDown={moveRight}
          onPointerUp={() => stopMove('right')}
          onPointerCancel={() => stopMove('right')}
          aria-label="오른쪽 이동"
        >
          →
        </button>
        <button
          type="button"
          className={cx('career-mobile-key', 'career-mobile-key--enter')}
          onClick={isExitActive ? exitToHome : showCompanyInfo}
          disabled={!isExitActive && !isCompanyActive}
          aria-label="Enter"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
