# Portfolio v3

UI Developer 포트폴리오 웹사이트

## 기술 스택

- React 18
- TypeScript
- Vite
- React Router
- Framer Motion
- Sass
- EmailJS

## 시작하기

### 설치

```bash
# 의존성 설치
yarn install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# EmailJS 설정
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

#### EmailJS 설정 방법

1. [EmailJS](https://www.emailjs.com/)에 가입하고 로그인합니다.
2. **Email Services** 메뉴에서 이메일 서비스를 추가합니다 (Gmail, Outlook 등).
3. **Service ID**를 복사하여 `VITE_EMAILJS_SERVICE_ID`에 입력합니다.
4. **Email Templates** 메뉴에서 새 템플릿을 생성합니다.
   - Template 변수: `{{subject}}`, `{{from_name}}`, `{{from_email}}`, `{{message}}`
5. **Template ID**를 복사하여 `VITE_EMAILJS_TEMPLATE_ID`에 입력합니다.
6. **Account** > **General** 메뉴에서 **Public Key**를 복사하여 `VITE_EMAILJS_PUBLIC_KEY`에 입력합니다.

### 개발 서버 실행

```bash
yarn dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173)을 열어 확인하세요.

### 빌드

```bash
yarn build
```

### 프리뷰

```bash
yarn preview
```

## 프로젝트 구조

```
src/
├── app/              # 앱 설정 및 라우팅
├── assets/           # 이미지, 스타일, 폰트
├── components/       # 공통 컴포넌트
├── hooks/            # 커스텀 훅
└── pages/            # 페이지 컴포넌트
    ├── Home/         # 홈 페이지
    ├── About/        # 소개 페이지
    ├── Career/       # 경력 페이지
    └── Contact/      # 연락 페이지
```

## 주요 기능

- 🏠 인터랙티브 홈 페이지 (캐릭터 이동, 다크모드)
- 📧 이메일 전송 기능 (EmailJS)
- 🎨 반응형 디자인
- 🌙 다크 모드 지원
- ⚡️ 빠른 페이지 로딩 (React lazy loading)

## 라이선스

MIT
