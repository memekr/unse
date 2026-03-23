/**
 * site-config.ts — 사이트별 설정 파일
 *
 * 새 사이트를 만들 때 이 파일만 수정하면 SEO, 레이아웃, 광고풀이 모두 자동 반영됩니다.
 *
 * siteType:
 *   - 'breaking-news'   : warwar.me, jusik.me (속보/뉴스 타입)
 *   - 'affiliate'       : alihalin.com, alimaster.shop, valuepick.me, plusmoa.shop
 *   - 'service'         : yuchul.com, unse.me, agent.me.kr
 */

export type SiteType = 'breaking-news' | 'affiliate' | 'service';

export type NavItem = {
  href: string;
  label: string;
};

export type SiteConfig = {
  /** 사이트 고유 ID (광고풀, 텔레메트리 등에서 사용) */
  siteId: string;
  /** 사이트 유형 */
  siteType: SiteType;
  /** 표시용 사이트 이름 */
  siteName: string;
  /** 짧은 한줄 태그라인 */
  tagline: string;
  /** 프로덕션 URL (https:// 포함) */
  siteUrl: string;
  /** SEO description */
  description: string;
  /** OG image 경로 (public 기준) */
  ogImage: string;
  /** 테마 컬러 (다크모드 기본) */
  themeColor: string;
  /** 네비게이션 항목 */
  navigation: NavItem[];
  /** GA4 측정 ID */
  gaId: string;
  /** 네이버 서치어드바이저 인증 메타 콘텐츠 */
  naverVerification: string;
  /** 푸터 텍스트 */
  footerText: string;
  /** 광고풀 API 엔드포인트 (외부 서버 or 로컬 API) */
  sharedAdsEndpoint: string;
};

// ────────────────────────────────────────
// 여기서부터 사이트별로 수정
// ────────────────────────────────────────

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://unse.me';
}

export const siteConfig: SiteConfig = {
  siteId: 'unse',
  siteType: 'service',
  siteName: '운세미',
  tagline: 'AI가 분석하는 나만의 운세 서비스',
  siteUrl: resolveSiteUrl(),
  description: '오늘의 운세, 사주, 타로 - AI가 분석하는 나만의 운세 서비스',
  ogImage: '/api/og',
  themeColor: '#0d0a1a',
  navigation: [
    { href: '/', label: '홈' },
    { href: '/horoscope', label: '오늘의운세' },
    { href: '/saju', label: '사주풀이' },
    { href: '/tarot', label: '타로카드' },
    { href: '/dream', label: '꿈해몽' },
    { href: '/compatibility', label: '궁합' },
    { href: '/tojeong', label: '토정비결' },
  ],
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? '',
  naverVerification: process.env.NEXT_PUBLIC_NAVER_VERIFICATION ?? '',
  footerText: '운세미. All rights reserved.',
  sharedAdsEndpoint: '/api/shared-ads',
};
