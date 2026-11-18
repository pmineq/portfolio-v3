# Portfolio v3

픽셀 월드 콘셉트의 인터랙티브 프론트엔드 포트폴리오입니다.  
캐릭터를 움직이며 About, Career, Contact 영역을 탐색하고, 숨은 상호작용과 업적을 발견할 수 있습니다.

배포 URL: https://pmineq.github.io/portfolio-v3/

## 주요 기능

- 캐릭터 이동 기반 홈 월드와 페이지 포털
- About/Career 서브 월드 탐색 및 근접 정보 패널
- 업적 도감, 업적 토스트, 숨은 업적 힌트
- NPC 대화, 숨은 상점, 점프 아이템, 다크모드 이벤트
- 업적 보상 스킨과 전체 달성 보상 왕관
- Contact 편지 UI와 EmailJS 메일 전송
- 모바일 방향키/Enter 조작 지원
- GitHub Pages 자동 배포

## 기술 스택

- React 19
- TypeScript
- Vite
- React Router
- Framer Motion
- Sass
- EmailJS

## 검증

Node.js 22와 Yarn 1.22.22를 기준으로 실행합니다.

```bash
corepack enable
yarn install --frozen-lockfile
yarn lint
yarn build
yarn playwright install
yarn test:e2e
```

GitHub Actions에서 macOS와 Windows의 설치, 린트, 빌드, Chromium 회귀 테스트를 검사합니다.
로컬 회귀 테스트는 Chromium, Firefox, WebKit에서 직접 경로 진입 시 업적 진행,
포커스 이탈 시 이동 중지, 모바일 알림 위치를 확인합니다.

## 프로젝트 구조

```txt
src/
├── app/                  # 루트 레이아웃, 라우터
├── assets/               # 픽셀 이미지, 폰트, 전역 스타일
├── components/common/    # 업적, HUD, 로더, 이펙트
├── components/layout/    # Header, Footer
├── context/              # 게임 상태와 업적 상태
├── hooks/                # EmailJS, Konami code 등
└── pages/
    ├── Home/             # 메인 월드
    ├── About/            # 캐릭터 정보실
    ├── Career/           # 커리어 로드
    ├── Contact/          # 편지/연락 페이지
    └── NotFound.tsx      # 404 숨은 업적 페이지
```
