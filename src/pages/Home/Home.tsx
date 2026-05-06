import { useState, useRef, useEffect, useCallback, useMemo, type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import cx from 'classnames';
import './Home.scss';
import SunMoonToggle from './SunMoonToggle/SunMoonToggle';
import { useCharacterMovement } from './hook/useCharacterMovement';
import { ACHIEVEMENTS, useGame } from 'context/GameContext';

const DIALOGUES = [
  '픽셀 정렬 중...',
  '버튼 상태 확인 완료!',
  '오늘도 반응형은 꼼꼼하게.',
  'hover, active, focus 모두 챙겼어요.',
  'UI 버그를 발견하면 바로 제보!',
  '오른쪽 포털을 따라가면 능력치와 퀘스트 로그가 열려요.',
  '다크모드도 테스트해 주세요.',
  '접근성 체크는 습관입니다.',
];

const BALLOON_MSGS = ['새로운 의뢰 도착!', '구름 위 QA 중', '디자인 시스템 배송 중', '오늘의 목표: 완성도 +1'];
const ZEPPELIN_MSGS = ['배포 항로 이상 없음', '목적지: Contact', '성능 점검 완료', '다음 스테이지 준비 중'];
const CLOUD_NPC_MSGS = [
  '퀘스트 로그는 위에서 봐도 빼곡하네요.',
  'Career 근처까지 왔다면 꽤 성실한 탐험가예요.',
  '경험치는 숫자보다 회고가 더 오래 남더라고요.',
];

const NPC_LINES = [
  '어서 오세요. 여기는 UI 개발자 MINE의 게임형 포트폴리오입니다.',
  '방향키로 캐릭터를 움직이고, 오브젝트를 클릭하면 작은 이벤트가 열려요.',
  'About에서는 스킬과 성향을, Career에서는 경험치를, Contact에서는 다음 의뢰를 보낼 수 있어요.',
  '이 포트폴리오는 단순 소개 페이지보다 탐험하는 느낌을 주는 데 집중했어요.',
  'Contact에서 메시지를 보내면 다음 퀘스트가 시작됩니다.',
  '그럼, 즐거운 탐험 되세요. [대화 종료]',
];

const NPC_RANDOM_LINES = [
  '음. 설명을 끝까지 들은 사람에게만 알려주는 비밀 루트예요.',
  '가이드는 졸린 게 아니라 절전 모드입니다. 아주 효율적이죠.',
  '오른쪽으로 가면 포털이 하나씩 나타나요. 길을 따라가 보세요.',
  '방향키로 산책하고 오세요. 저는 여기서 화면을 지키겠습니다.',
  '캐릭터가 점프하네요. 착지는 알아서 잘하겠죠. 아마도요.',
  'About은 능력치 창, Career는 퀘스트 로그, Contact는 우체국에 가깝습니다.',
  '오늘의 조언: 마음에 드는 버튼은 한 번 눌러보고, 두 번 눌러보고, 책임은 나눠집시다.',
  'Contact까지 가면 퀘스트 보상이 있을지도요. 없으면 제가 조용히 눈을 피할게요.',
  '이 화면은 새로고침 전까지 기억합니다. 고양이치고는 꽤 성실하죠.',
  '지금은 안내 중입니다. 쓰다듬기 기능은 다음 패치 후보로 올려둘게요.',
];

const NPC_PROGRESS_LINES = [
  { min: 0, line: '업적 도감이 열렸네요. 처음엔 빈칸이 많아야 더 재밌습니다.' },
  { min: 4, line: '도감이 슬슬 차고 있어요. 이제 숨겨진 것들을 찾을 차례입니다.' },
  { min: 9, line: '업적 냄새를 꽤 잘 맡으시네요. 거의 컬렉터의 눈입니다.' },
  { min: 13, line: '이 정도면 제가 안내하는 게 아니라 옆에서 박수만 치면 되겠는데요.' },
];

const QUESTS = [
  { id: 'about', label: 'About 열람' },
  { id: 'contact', label: 'Contact 전송' },
];

const STATS = [
  { label: 'UI', value: 96 },
  { label: 'React', value: 90 },
  { label: 'Motion', value: 82 },
];

const CONTACT_QUEST_KEY = 'quest_contact_sent';
const VISITED_PAGES_KEY = 'ach_vis';

const PORTALS = [
  { id: 'about', label: '스킬 연구소', path: '/about', x: 1120, frame: 0 },
  { id: 'career', label: '퀘스트 게시판', path: '/career', x: 1850, frame: 1 },
  { id: 'contact', label: '우체국', path: '/contact', x: 2580, frame: 2 },
];

interface HomeLocationState {
  spawnX?: number;
}

const JUMP_ITEM_X = 1500;
const SECRET_SHOP_X = 2260;

interface DmgText {
  id: number;
  text: string;
  color: string;
  x: number;
}

function pickDmg(): Omit<DmgText, 'id'> {
  const r = Math.random();
  const x = (Math.random() - 0.5) * 70;
  if (r < 0.35) return { text: String(Math.floor(Math.random() * 90 + 10)), color: '#fff', x };
  if (r < 0.55) return { text: '+EXP', color: '#4ade80', x };
  if (r < 0.75) return { text: 'CRIT!', color: '#fb923c', x };
  if (r < 0.88) return { text: 'MISS!', color: '#94a3b8', x };
  return { text: 'PERFECT!', color: '#fbbf24', x };
}

function pickNpcRandomLine(lastIndex: number | null, extraLines: string[] = []) {
  const lines = [...NPC_RANDOM_LINES, ...extraLines];
  if (lines.length <= 1) return lines[0];

  let nextIndex = Math.floor(Math.random() * lines.length);
  if (nextIndex === lastIndex) {
    nextIndex = (nextIndex + 1) % lines.length;
  }

  return lines[nextIndex];
}

function hasVisitedPage(path: string) {
  try {
    const visited = JSON.parse(localStorage.getItem(VISITED_PAGES_KEY) ?? '[]') as string[];
    return visited.includes(path);
  } catch {
    return false;
  }
}

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  top: Math.random() * 68 + 5,
  left: Math.random() * 90 + 4,
  size: Math.random() * 2 + 1,
  dur: (Math.random() * 2.5 + 1.5).toFixed(2),
  delay: (Math.random() * 4).toFixed(2),
}));

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const spawnX = (location.state as HomeLocationState | null)?.spawnX;
  const homeContentRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLDivElement | null>(null);
  const { posX, isLeft, isRight, isJumping, moveLeft, moveRight, stopMove, jump } =
    useCharacterMovement(homeContentRef, characterRef, 220, spawnX);
  const { playClick, playWalk, playText, unlock, increment, unlocked } = useGame();
  const [aboutQuestDone] = useState(() => hasVisitedPage('/about'));
  const [contactQuestDone] = useState(
    () => localStorage.getItem(CONTACT_QUEST_KEY) === 'true',
  );

  const [dialogue, setDialogue] = useState<string | null>(null);
  const bubbleTimer = useRef<number | null>(null);
  const [dmgTexts, setDmgTexts] = useState<DmgText[]>([]);
  const dmgId = useRef(0);

  const [balloonMsg, setBalloonMsg] = useState<string | null>(null);
  const [zeppelinMsg, setZeppelinMsg] = useState<string | null>(null);
  const [cloudNpcMsg, setCloudNpcMsg] = useState<string | null>(null);
  const [meteorText, setMeteorText] = useState<string | null>(null);
  const [jumpItemCollected, setJumpItemCollected] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const balloonIdx = useRef(0);
  const zeppelinIdx = useRef(0);
  const cloudNpcIdx = useRef(0);
  const balloonTimer = useRef<number | null>(null);
  const zeppelinTimer = useRef<number | null>(null);
  const cloudNpcTimer = useRef<number | null>(null);
  const meteorTimer = useRef<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [cameraCenterX, setCameraCenterX] = useState(0);
  const [npcDialogLines, setNpcDialogLines] = useState(NPC_LINES);
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(false);
  const typeTimer = useRef<number | null>(null);
  const hasCompletedNpcGuide = useRef(false);
  const isGuideDialogRef = useRef(false);
  const quests = useMemo(
    () =>
      QUESTS.map((quest) => ({
        ...quest,
        done: quest.id === 'about' ? aboutQuestDone : contactQuestDone,
      })),
    [aboutQuestDone, contactQuestDone],
  );
  const lastNpcRandomIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!isLeft && !isRight) return;
    const id = setInterval(() => playWalk(), 350);
    return () => clearInterval(id);
  }, [isLeft, isRight, playWalk]);

  const handleCharacterClick = useCallback(() => {
    playClick();
    const text = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
    setDialogue(text);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setDialogue(null), 3000);

    const dmg = pickDmg();
    const id = ++dmgId.current;
    setDmgTexts(prev => [...prev, { id, ...dmg }]);
    window.setTimeout(() => setDmgTexts(prev => prev.filter(d => d.id !== id)), 1100);
    increment('char_click', 5, 'chatterbox');
  }, [playClick, increment]);

  const handleBalloonClick = useCallback(() => {
    playClick();
    const msg = BALLOON_MSGS[balloonIdx.current % BALLOON_MSGS.length];
    balloonIdx.current++;
    setBalloonMsg(msg);
    if (balloonTimer.current) clearTimeout(balloonTimer.current);
    balloonTimer.current = window.setTimeout(() => setBalloonMsg(null), 2500);
  }, [playClick]);

  const handleZeppelinClick = useCallback(() => {
    playClick();
    const msg = ZEPPELIN_MSGS[zeppelinIdx.current % ZEPPELIN_MSGS.length];
    zeppelinIdx.current++;
    setZeppelinMsg(msg);
    if (zeppelinTimer.current) clearTimeout(zeppelinTimer.current);
    zeppelinTimer.current = window.setTimeout(() => setZeppelinMsg(null), 2500);
  }, [playClick]);

  const handleCloudNpcClick = useCallback(() => {
    playClick();
    const msg = CLOUD_NPC_MSGS[cloudNpcIdx.current % CLOUD_NPC_MSGS.length];
    cloudNpcIdx.current++;
    setCloudNpcMsg(msg);
    if (cloudNpcTimer.current) clearTimeout(cloudNpcTimer.current);
    cloudNpcTimer.current = window.setTimeout(() => setCloudNpcMsg(null), 2800);
    increment('cloud_npc', 1, 'sky_talker');
  }, [playClick, increment]);

  const handleMeteorClick = useCallback(() => {
    playClick();
    setMeteorText('+EXP');
    if (meteorTimer.current) clearTimeout(meteorTimer.current);
    meteorTimer.current = window.setTimeout(() => setMeteorText(null), 1000);
    increment('meteor_click', 1, 'star_catcher');
    if (document.documentElement.dataset.darkmode === 'true') {
      unlock('moonlight_hunter');
    }
  }, [playClick, increment, unlock]);

  useEffect(() => () => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    if (balloonTimer.current) clearTimeout(balloonTimer.current);
    if (zeppelinTimer.current) clearTimeout(zeppelinTimer.current);
    if (cloudNpcTimer.current) clearTimeout(cloudNpcTimer.current);
    if (meteorTimer.current) clearTimeout(meteorTimer.current);
  }, []);

  const startTypewriter = useCallback((line: string) => {
    setDisplayed('');
    setTyping(true);
    let i = 0;
    if (typeTimer.current) clearInterval(typeTimer.current);
    typeTimer.current = window.setInterval(() => {
      i++;
      setDisplayed(line.slice(0, i));
      playText();
      if (i >= line.length) {
        clearInterval(typeTimer.current!);
        setTyping(false);
      }
    }, 38);
  }, [playText]);

  const handleNpcClick = useCallback(() => {
    if (dialogOpen) return;
    const unlockedCount = ACHIEVEMENTS.filter(achievement => unlocked.has(achievement.id)).length;
    const progressLines = NPC_PROGRESS_LINES
      .filter(item => unlockedCount >= item.min)
      .map(item => item.line);
    const lines = hasCompletedNpcGuide.current
      ? [pickNpcRandomLine(lastNpcRandomIndex.current, progressLines)]
      : NPC_LINES;
    isGuideDialogRef.current = !hasCompletedNpcGuide.current;
    if (hasCompletedNpcGuide.current) {
      lastNpcRandomIndex.current = [...NPC_RANDOM_LINES, ...progressLines].indexOf(lines[0]);
    }
    setNpcDialogLines(lines);
    setLineIndex(0);
    setDialogOpen(true);
    unlock('talk_npc');
    increment('guide_talk', 5, 'guide_regular');
    startTypewriter(lines[0]);
  }, [dialogOpen, unlock, increment, startTypewriter, unlocked]);

  const handleSecretShopClick = useCallback(() => {
    playClick();
    unlock('secret_shopper');
    setShopOpen(true);
  }, [playClick, unlock]);

  const handleDialogNext = useCallback(() => {
    if (typing) {
      if (typeTimer.current) clearInterval(typeTimer.current);
      setDisplayed(npcDialogLines[lineIndex]);
      setTyping(false);
      return;
    }

    const next = lineIndex + 1;
    if (next >= npcDialogLines.length) {
      if (isGuideDialogRef.current) {
        hasCompletedNpcGuide.current = true;
        isGuideDialogRef.current = false;
      }
      setDialogOpen(false);
      return;
    }

    setLineIndex(next);
    startTypewriter(npcDialogLines[next]);
  }, [typing, lineIndex, npcDialogLines, startTypewriter]);

  const handleDialogClose = useCallback(() => {
    if (typeTimer.current) clearInterval(typeTimer.current);
    isGuideDialogRef.current = false;
    setDialogOpen(false);
  }, []);

  useEffect(() => {
    if (!dialogOpen) return;

    const handleDialogKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleDialogNext();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        handleDialogClose();
      }
    };

    window.addEventListener('keydown', handleDialogKeyDown);
    return () => window.removeEventListener('keydown', handleDialogKeyDown);
  }, [dialogOpen, handleDialogNext, handleDialogClose]);

  useEffect(() => () => {
    if (typeTimer.current) clearInterval(typeTimer.current);
  }, []);

  useEffect(() => {
    const container = homeContentRef.current;
    if (!container) return;

    let frame = 0;
    const updateCameraCenter = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setCameraCenterX(container.scrollLeft + container.clientWidth / 2);
      });
    };

    updateCameraCenter();
    container.addEventListener('scroll', updateCameraCenter, { passive: true });
    window.addEventListener('resize', updateCameraCenter);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      container.removeEventListener('scroll', updateCameraCenter);
      window.removeEventListener('resize', updateCameraCenter);
    };
  }, []);

  const isLastLine = lineIndex === npcDialogLines.length - 1;
  const activePortal = PORTALS.find(portal => Math.abs(posX - portal.x) < 210) ?? null;
  const capturePointer = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const releasePointer = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };
  const enterActivePortal = () => {
    if (!activePortal) return;
    playClick();
    navigate(activePortal.path);
  };

  useEffect(() => {
    if (!isJumping || jumpItemCollected || Math.abs(posX - JUMP_ITEM_X) > 180) return;

    playClick();
    setJumpItemCollected(true);
    unlock('jump_collector');
  }, [isJumping, jumpItemCollected, posX, playClick, unlock]);

  useEffect(() => {
    if (isJumping) unlock('first_jump');
  }, [isJumping, unlock]);

  useEffect(() => {
    if (!activePortal) return;

    const handlePortalEnter = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      playClick();
      navigate(activePortal.path);
    };

    window.addEventListener('keydown', handlePortalEnter);
    return () => window.removeEventListener('keydown', handlePortalEnter);
  }, [activePortal, navigate, playClick]);

  return (
    <div className={cx('home')}>
      <div className={cx('home-content')} ref={homeContentRef}>
        <div className={cx('home-stars')} aria-hidden>
          {STARS.map(s => (
            <span
              key={s.id}
              className={cx('home-star')}
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDuration: `${s.dur}s`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>

        <motion.div
          className={cx('home-title')}
          initial={{ opacity: 0, x: '-50%', y: -10 }}
          animate={{ opacity: 1, x: '-50%', y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className={cx('home-title__eyebrow')}>UI Developer</span>
          <h1 className={cx('home-title__main')}>MINE</h1>
          <strong className={cx('home-title__subtitle')}>Portfolio ver.GAME</strong>
          <motion.span
            className={cx('home-title__hint')}
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ← → 이동 · ↑ 점프 · Enter 입장
          </motion.span>
        </motion.div>

        <motion.aside
          className={cx('home-hud', 'home-hud--profile')}
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className={cx('home-hud__header')}>
            <span>PLAYER</span>
            <strong>Lv.6</strong>
          </div>
          <p className={cx('home-hud__name')}>MINE</p>
          <div className={cx('home-hud__meter')}>
            <span style={{ width: '86%' }} />
          </div>
          <p className={cx('home-hud__caption')}>Frontend UI Developer</p>
        </motion.aside>

        <motion.aside
          className={cx('home-hud', 'home-hud--quest')}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.72 }}
        >
          <div className={cx('home-hud__header')}>
            <span>QUEST</span>
            <strong>{quests.filter(q => q.done).length}/{quests.length}</strong>
          </div>
          <ul className={cx('home-quest-list')}>
            {quests.map(quest => (
              <li key={quest.label} className={cx({ 'is-done': quest.done })}>
                <span>{quest.done ? '완료' : '진행'}</span>
                {quest.label}
              </li>
            ))}
          </ul>
        </motion.aside>

        <motion.div
          className={cx('home-status')}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.84 }}
        >
          {STATS.map(stat => (
            <div key={stat.label} className={cx('home-status__item')}>
              <span>{stat.label}</span>
              <div><i style={{ width: `${stat.value}%` }} /></div>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </motion.div>

        <div className={cx('home-world')}>
          <div className={cx('home-bg-mountain')} />
          <div className={cx('home-bg-cloud', 'home-bg-cloud--left')} />
          <div className={cx('home-bg-cloud', 'home-bg-cloud--right')} />
          <SunMoonToggle x={cameraCenterX} />

          <div className={cx('home-portals')} aria-label="포털 이동">
            {PORTALS.map(portal => {
              const isActive = activePortal?.id === portal.id;

              return (
                <button
                  key={portal.id}
                  type="button"
                  className={cx('home-portal', `home-portal--${portal.id}`, { 'is-active': isActive })}
                  style={
                    {
                      '--portal-x': `${portal.x}px`,
                      '--portal-frame': portal.frame,
                    } as CSSProperties
                  }
                  onClick={() => {
                    playClick();
                    navigate(portal.path);
                  }}
                >
                  <span className={cx('home-portal__prompt')}>
                    {isActive ? 'Enter 입장' : portal.label}
                  </span>
                </button>
              );
            })}
          </div>

          {activePortal && (
            <span
              className={cx('home-active-portal-prompt')}
              style={{ '--portal-x': `${activePortal.x}px` } as CSSProperties}
            >
              Enter 입장
            </span>
          )}

          <button
            type="button"
            className={cx('home-ballon')}
            onClick={handleBalloonClick}
            aria-label="열기구 메시지 보기"
          >
            <AnimatePresence>
              {balloonMsg && (
                <motion.span
                  className={cx('home-object-bubble')}
                  initial={{ opacity: 0, y: 4, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {balloonMsg}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            className={cx('home-zeppelin')}
            onClick={handleZeppelinClick}
            aria-label="비행선 메시지 보기"
          >
            <AnimatePresence>
              {zeppelinMsg && (
                <motion.span
                  className={cx('home-object-bubble', 'home-object-bubble--right')}
                  initial={{ opacity: 0, y: 4, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {zeppelinMsg}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            className={cx('home-cloud-npc')}
            onClick={handleCloudNpcClick}
            aria-label="구름 NPC와 대화하기"
          >
            <AnimatePresence>
              {cloudNpcMsg && (
                <motion.span
                  className={cx('home-object-bubble', 'home-object-bubble--cloud')}
                  initial={{ opacity: 0, y: 4, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {cloudNpcMsg}
                </motion.span>
              )}
            </AnimatePresence>
            <span className={cx('home-cloud-npc__face')} aria-hidden>?</span>
          </button>

          <button
            type="button"
            className={cx('home-meteor')}
            onClick={handleMeteorClick}
            aria-label="유성 잡기"
          >
            <AnimatePresence>
              {meteorText && (
                <motion.span
                  className={cx('home-meteor__text')}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -34, scale: 1.12 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                >
                  {meteorText}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            className={cx('home-jump-item', { 'is-collected': jumpItemCollected })}
            style={{ '--jump-item-x': `${JUMP_ITEM_X}px` } as CSSProperties}
            onClick={playClick}
            aria-label="공중 아이템"
            disabled={jumpItemCollected}
          />

          <button
            type="button"
            className={cx('home-secret-shop')}
            style={{ '--shop-x': `${SECRET_SHOP_X}px` } as CSSProperties}
            onClick={handleSecretShopClick}
            aria-label="비밀 상점 열기"
          >
            <span>SHOP</span>
          </button>

          <div className={cx('home-bottom')} aria-hidden />

          <div className={cx('home-actors')}>
            <button type="button" className={cx('home-npc')} onClick={handleNpcClick} aria-label="가이드와 대화하기">
            <AnimatePresence>
              {!dialogOpen && (
                <motion.span
                  className={cx('home-npc__indicator')}
                  animate={{ y: [-4, 0, -4] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                >
                  !
                </motion.span>
              )}
            </AnimatePresence>
            <div className={cx('home-npc__sprite')} />
            <span className={cx('home-npc__name')}>가이드</span>
            </button>

            <div className={cx('home-character')}>
              <div
                ref={characterRef}
                className={cx(
                  'home-character_character',
                  { 'home-character_character--right': isRight },
                  { 'home-character_character--left': isLeft },
                  { 'home-character_character--jump': isJumping },
                  { 'home-character_character--legendary': unlocked.has('legendary') },
                )}
                style={{ '--character-x': `${posX}px` } as CSSProperties}
                onMouseDown={e => e.preventDefault()}
                onClick={e => {
                  e.currentTarget.blur();
                  handleCharacterClick();
                }}
                onKeyDown={e => e.key === 'Enter' && handleCharacterClick()}
                role="button"
                tabIndex={0}
                aria-label="캐릭터에게 말 걸기"
              >
              {dmgTexts.map(dmg => (
                <motion.span
                  key={dmg.id}
                  className={cx('home-character_dmg')}
                  style={{ color: dmg.color, left: `calc(50% + ${dmg.x}px)` }}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -52, scale: 1.1 }}
                  transition={{ duration: 1.0, ease: 'easeOut' }}
                >
                  {dmg.text}
                </motion.span>
              ))}
              <AnimatePresence>
                {dialogue && (
                  <motion.div
                    key={dialogue}
                    className={cx('home-character_bubble')}
                    initial={{ opacity: 0, y: 6, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.18 }}
                  >
                    {dialogue}
                  </motion.div>
                )}
              </AnimatePresence>
              <span className={cx('home-character_level')}>
                Lv. <em>6</em>
                <span className={cx('home-character_level-small')}>년차</span>
              </span>
              {unlocked.has('legendary') && (
                <span className={cx('home-character_reward')} aria-label="전설의 왕관 스킨" />
              )}
              <span className={cx('home-character_name')}>MINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cx('home-mobile-controls')} aria-label="모바일 이동 키패드">
        <button
          type="button"
          className={cx('home-mobile-key')}
          onPointerDown={(e) => {
            capturePointer(e);
            moveLeft();
          }}
          onPointerUp={(e) => {
            releasePointer(e);
            stopMove('left');
          }}
          onPointerCancel={(e) => {
            releasePointer(e);
            stopMove('left');
          }}
          aria-label="왼쪽 이동"
        >
          ←
        </button>
        <button
          type="button"
          className={cx('home-mobile-key')}
          onPointerDown={jump}
          aria-label="점프"
        >
          ↑
        </button>
        <button
          type="button"
          className={cx('home-mobile-key')}
          onPointerDown={(e) => {
            capturePointer(e);
            moveRight();
          }}
          onPointerUp={(e) => {
            releasePointer(e);
            stopMove('right');
          }}
          onPointerCancel={(e) => {
            releasePointer(e);
            stopMove('right');
          }}
          aria-label="오른쪽 이동"
        >
          →
        </button>
        <button
          type="button"
          className={cx('home-mobile-key', 'home-mobile-key--enter')}
          onClick={enterActivePortal}
          disabled={!activePortal}
          aria-label="포털 입장"
        >
          Enter
        </button>
      </div>

      <AnimatePresence>
        {shopOpen && (
          <motion.div
            className={cx('home-shop')}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-shop-title"
          >
            <div className={cx('home-shop__header')}>
              <span>SECRET SHOP</span>
              <button type="button" onClick={() => setShopOpen(false)} aria-label="비밀 상점 닫기">×</button>
            </div>
            <div className={cx('home-shop__body')}>
              <h2 id="home-shop-title">숨은 상점</h2>
              <p>보유 업적이 늘어날수록 희귀한 보상이 진열됩니다.</p>
              <ul>
                <li className={cx({ 'is-owned': unlocked.has('secret_shopper') })}>
                  <strong>상점 발견 배지</strong>
                  <span>{unlocked.has('secret_shopper') ? '획득 완료' : '표지판을 눌러 입장'}</span>
                </li>
                <li className={cx({ 'is-owned': unlocked.has('legendary') })}>
                  <strong>전설의 왕관 스킨</strong>
                  <span>{unlocked.has('legendary') ? '캐릭터에게 장착됨' : '모든 업적 달성 필요'}</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dialogOpen && (
          <motion.div
            className={cx('home-dialog')}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
          >
            <div className={cx('home-dialog__header')}>
              <span className={cx('home-dialog__speaker')}>가이드</span>
              <button type="button" className={cx('home-dialog__close')} onClick={handleDialogClose} aria-label="닫기">×</button>
            </div>
            <div className={cx('home-dialog__body')}>
              <div className={cx('home-dialog__npc')} />
              <p className={cx('home-dialog__text')}>{displayed}</p>
            </div>
            <button type="button" className={cx('home-dialog__next')} onClick={handleDialogNext}>
              {typing ? '문장 건너뛰기' : isLastLine ? '닫기' : '다음'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
