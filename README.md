<p align="center">
  <img src="public/icon-512.png" alt="운세미 로고" width="120" />
</p>

<h1 align="center">🔮 운세미 (unse.me)</h1>

<p align="center">
  <strong>AI 기반 무료 운세 서비스</strong><br/>
  띠별·별자리별 오늘의 운세 · 사주풀이 · 타로카드 · 꿈해몽
</p>

<p align="center">
  <a href="https://unse.me">🌐 unse.me</a>
</p>

---

## ✨ 서비스 소개

**운세미**는 매일 바뀌는 운세를 재미있게 확인할 수 있는 웹 서비스입니다.

- 🐉 **띠별 운세** — 12간지 기반 오늘의 운세, 행운 컬러·숫자 제공
- ⭐ **별자리 운세** — 12별자리별 연애·재물·건강 운세
- 🎴 **타로 카드** — 메이저 아르카나 기반 일일 타로 리딩
- 🌙 **꿈해몽** — 키워드 기반 꿈 해석 및 행운 분석
- 📊 **사주 분석** — 생년월일시 기반 사주팔자 풀이 (십신, 12운성, 신살, 대운 분석)

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | Next.js 14 (App Router) |
| **언어** | TypeScript |
| **스타일링** | CSS Custom Properties, Glassmorphism |
| **인증** | Firebase Auth (Google 로그인) |
| **분석** | Google Analytics 4 |
| **배포** | Vercel |

## 🚀 시작하기

### 요구 사항

- Node.js 18+
- npm 또는 yarn

### 설치

```bash
git clone https://github.com/memekr/unse.git
cd unse
npm install
```

### 환경 변수 설정

`.env.example`을 복사하여 `.env.local`을 생성하고 값을 채워주세요.

```bash
cp .env.example .env.local
```

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 측정 ID |
| `NEXT_PUBLIC_NAVER_VERIFICATION` | 네이버 서치어드바이저 인증 코드 |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase 프로젝트 설정값 |

### 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000`에서 확인할 수 있습니다.

### 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
unse/
├── app/
│   ├── page.tsx              # 메인 (운세 결과 + 서비스 선택)
│   ├── horoscope/page.tsx    # 별자리 운세
│   ├── saju/page.tsx         # 사주 분석
│   ├── tarot/page.tsx        # 타로 카드
│   ├── dream/page.tsx        # 꿈해몽
│   ├── layout.tsx            # 루트 레이아웃
│   ├── globals.css           # 글로벌 스타일
│   └── api/                  # API 라우트
├── components/               # 공통 컴포넌트
├── lib/
│   ├── fortune-utils.ts      # 운세 계산 유틸
│   ├── fortune-data.ts       # 운세 데이터
│   ├── saju-engine.ts        # 사주 엔진
│   ├── saju-advanced.ts      # 고급 사주 분석
│   └── dream-data.ts         # 꿈해몽 데이터
└── public/                   # 정적 파일
```

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다. 무단 복제 및 배포를 금지합니다.

---

<p align="center">
  Made with 🔮 by <strong>운세미</strong>
</p>
