<p align="center">
  <img src="public/icon-512.png" alt="운세미 로고" width="120" />
</p>

<h1 align="center">운세미 (unse.me)</h1>

<p align="center">
  <strong>AI 기반 무료 운세 서비스</strong><br/>
  띠별·별자리별 오늘의 운세 · 사주풀이 · 타로카드 · 꿈해몽
</p>

<p align="center">
  <a href="https://unse.me">unse.me</a>
</p>

---

## 서비스 소개

**운세미**는 매일 바뀌는 운세를 재미있게 확인할 수 있는 웹 서비스입니다.

- **띠별 운세** — 12간지 기반 오늘의 운세, 행운 컬러·숫자 제공
- **별자리 운세** — 12별자리별 연애·재물·건강 운세
- **타로 카드** — 메이저 아르카나 기반 일일 타로 리딩
- **꿈해몽** — 키워드 기반 꿈 해석 및 행운 분석
- **사주 분석** — 생년월일시 기반 사주팔자 풀이 (십신, 12운성, 신살, 대운 분석)

## 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | Next.js 14 (App Router) |
| **언어** | TypeScript |
| **스타일링** | CSS Custom Properties, Glassmorphism |
| **배포** | Vercel |

## 빠른 시작

### 요구 사항

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
git clone https://github.com/memekr/unse.git
cd unse
npm install
npm run dev
```

`http://localhost:3000`에서 바로 확인할 수 있습니다.
환경 변수 설정 없이도 운세 기능이 모두 동작합니다.

### 빌드 및 배포

```bash
npm run build
npm start
```

Vercel에 연결하면 `git push`만으로 자동 배포됩니다.

## 프로젝트 구조

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
│   ├── ads/                  # 광고 배너 (스텁)
│   ├── horoscope/            # 별자리 운세 클라이언트
│   ├── AuthContext.tsx        # 인증 컨텍스트 (스텁)
│   ├── AuthButton.tsx         # 로그인 버튼 (스텁)
│   └── GoogleAnalytics.tsx    # GA (스텁)
├── lib/
│   ├── fortune-utils.ts       # 운세 계산 유틸
│   ├── fortune-data.ts        # 운세 데이터
│   ├── saju-engine.ts         # 사주 엔진
│   ├── saju-advanced.ts       # 고급 사주 분석
│   ├── dream-data.ts          # 꿈해몽 데이터
│   ├── firebase.ts            # Firebase (스텁)
│   └── ads/                   # 광고 핸들러 (스텁)
└── public/                    # 정적 파일
```

## Private 모듈 (선택 사항)

운세미의 핵심 운세 기능은 환경 변수나 외부 서비스 설정 없이 동작합니다.
아래 기능들은 `_private/` 디렉토리에 모듈을 추가하면 자동으로 활성화됩니다.

### 동작 원리

`next.config.mjs`의 webpack alias가 `_private/` 디렉토리 존재 여부를 확인하고,
해당 디렉토리가 있으면 스텁(빈 컴포넌트)을 실제 구현으로 자동 교체합니다.
디렉토리가 없으면 스텁이 사용되어 해당 기능이 비활성화됩니다.

### 광고 모듈 (`_private/ads/`)

쿠팡파트너스 상품 추천 광고를 활성화합니다.

필요한 파일:

```
_private/ads/
├── ProductAdBanner.tsx     # 상품 광고 배너 컴포넌트
├── LocalAdBanner.tsx       # 로컬 광고 배너
├── SharedAdBanner.tsx      # 공유 광고 배너
├── local-ads.ts            # 로컬 광고 데이터
├── shared-feed.ts          # 공유 광고 피드
├── product-pool.ts         # 상품 풀 (카테고리별 상품 목록)
└── products-handler.ts     # 쿠팡 딥링크 API 핸들러
```

필요한 환경 변수 (`.env.local`):

```
COUPANG_ACCESS_KEY=your-access-key
COUPANG_SECRET_KEY=your-secret-key
COUPANG_SUB_ID=your-sub-id
```

### 인증 모듈 (`_private/auth/`)

Google 로그인과 결과 저장 기능을 활성화합니다.

필요한 파일:

```
_private/auth/
├── firebase.ts        # Firebase 초기화 (동적 로딩)
├── AuthContext.tsx     # 인증 컨텍스트 프로바이더
└── AuthButton.tsx     # Google 로그인 버튼
```

필요한 환경 변수 (`.env.local`):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 애널리틱스 모듈 (`_private/analytics/`)

Google Analytics 4 추적을 활성화합니다.

필요한 파일:

```
_private/analytics/
└── GoogleAnalytics.tsx   # GA4 스크립트 컴포넌트
```

필요한 환경 변수 (`.env.local`):

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 환경 변수 참고

모든 환경 변수는 선택 사항입니다. `.env.example` 파일을 참고하세요.

```bash
cp .env.example .env.local
```

| 변수 | 설명 | 필요 조건 |
|------|------|-----------|
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL | Vercel 배포 시 자동 감지 |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | 구글 서치콘솔 인증 | 선택 |
| `NEXT_PUBLIC_NAVER_VERIFICATION` | 네이버 서치어드바이저 인증 | 선택 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | `_private/analytics/` 필요 |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase 설정 | `_private/auth/` 필요 |
| `COUPANG_ACCESS_KEY` | 쿠팡파트너스 Access Key | `_private/ads/` 필요 |
| `COUPANG_SECRET_KEY` | 쿠팡파트너스 Secret Key | `_private/ads/` 필요 |
| `COUPANG_SUB_ID` | 쿠팡파트너스 Sub ID | `_private/ads/` 필요 |

## 라이선스

MIT License

---

<p align="center">
  Made with &#x1f52e; by <strong>운세미</strong>
</p>
