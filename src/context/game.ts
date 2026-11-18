import { createContext, useContext } from 'react';

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_visit', title: '첫 발걸음', desc: '포트폴리오를 처음 방문했다!', icon: '👣' },
  { id: 'first_jump', title: '첫 점프', desc: '처음으로 점프했다!', icon: '🪽' },
  { id: 'dark_mode', title: '어둠의 기사', desc: '다크 모드를 활성화했다!', icon: '🌙' },
  {
    id: 'silent_runner',
    title: '소리 없는 모험',
    desc: '음소거 모드로 모험을 시작했다!',
    icon: '🔇',
  },
  { id: 'talk_npc', title: '대화술사', desc: 'NPC와 대화를 나눴다!', icon: '💬' },
  { id: 'guide_regular', title: '고양이 덕후', desc: '가이드에게 5번 말을 걸었다!', icon: '📣' },
  { id: 'chatterbox', title: '수다쟁이', desc: '캐릭터에게 5번 말을 걸었다!', icon: '🗨️' },
  { id: 'sky_talker', title: '하늘 친구', desc: '구름 NPC와 대화를 나눴다!', icon: '☁️' },
  { id: 'star_catcher', title: '별 사냥꾼', desc: '지나가는 유성을 잡았다!', icon: '⭐' },
  {
    id: 'moonlight_hunter',
    title: '달빛 사냥꾼',
    desc: '밤하늘 아래에서 유성을 잡았다!',
    icon: '🌌',
  },
  {
    id: 'jump_collector',
    title: '점프 수집가',
    desc: '공중 아이템을 점프로 획득했다!',
    icon: '💎',
  },
  { id: 'mail_carrier', title: '메시지 배달부', desc: 'Contact에서 메시지를 보냈다!', icon: '📮' },
  {
    id: 'lost_explorer',
    title: '길 잃은 탐험가',
    desc: '존재하지 않는 주소로 이동했다!',
    icon: '🧭',
  },
  { id: 'secret_shopper', title: '숨은 카멜레온', desc: '숨은 카멜레온을 찾았다!', icon: '🦎' },
  { id: 'explorer', title: '탐험가', desc: '모든 페이지를 방문했다!', icon: '🗺️' },
  { id: 'legendary', title: '전설의 용사', desc: '모든 업적을 달성했다!', icon: '👑' },
];

const LEGENDARY_ID = 'legendary';

export function hasLegendaryReward(unlocked: Set<string>) {
  return (
    unlocked.has(LEGENDARY_ID) &&
    ACHIEVEMENTS.every(
      (achievement) => achievement.id === LEGENDARY_ID || unlocked.has(achievement.id),
    )
  );
}

interface GameCtxValue {
  muted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playWalk: () => void;
  playPhone: () => void;
  playCoffee: () => void;
  playTransition: () => void;
  playText: () => void;
  unlocked: Set<string>;
  toast: Achievement | null;
  dismissToast: () => void;
  unlock: (id: string) => void;
  increment: (key: string, threshold: number, achievementId: string) => void;
  trackPage: (path: string) => void;
}

export const GameContext = createContext<GameCtxValue>({} as GameCtxValue);

export function useGame() {
  return useContext(GameContext);
}

