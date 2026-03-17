/**
 * local-ads.ts — 운세미 자체 광고풀
 *
 * 외부 shared-ads API 외에 직접 관리하는 광고 데이터입니다.
 * 새 광고를 추가하려면 LOCAL_ADS 배열에 항목을 추가하세요.
 */

export type LocalAdVariant = 'banner' | 'inline' | 'interstitial' | 'native';

export type LocalAd = {
  id: string;
  /** 광고주 또는 브랜드명 */
  sponsor: string;
  /** 클릭 시 이동 URL */
  href: string;
  /** 광고 제목 */
  title: string;
  /** 부제목/설명 */
  description: string;
  /** CTA 버튼 텍스트 */
  cta: string;
  /** 배지 텍스트 (예: "광고", "추천") */
  badge: string;
  /** 표시할 위치 */
  placements: LocalAdVariant[];
  /** 표시 가중치 (높을수록 자주 노출, 기본=1) */
  weight: number;
  /** 만료일 (ISO string, 비어있으면 무기한) */
  expiresAt?: string;
  /** 특정 페이지에만 표시 (비어있으면 전체) */
  pages?: string[];
  /** 이미지 URL (선택) */
  imageUrl?: string;
  /** 배경 그라데이션 (선택) */
  bgGradient?: string;
};

// ════════════════════════════════════════
// 자체 광고 데이터 — 여기에 광고를 추가/수정하세요
// ════════════════════════════════════════

export const LOCAL_ADS: LocalAd[] = [
  // ── 제휴 광고 ──
  {
    id: 'ali-lucky-items',
    sponsor: '알리익스프레스',
    href: 'https://s.click.aliexpress.com/e/_olzd8TL',
    title: '운세에 맞는 행운 아이템',
    description: '사주와 별자리에 맞춘 행운 아이템을 찾아보세요. 특가 세일 진행중!',
    cta: '행운 아이템 보기',
    badge: '추천',
    placements: ['inline', 'native'],
    weight: 3,
    bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(251, 191, 36, 0.08))',
  },
  {
    id: 'trip-lucky-travel',
    sponsor: 'Trip.com',
    href: 'https://www.trip.com/t/Ik6QQwDcjT2',
    title: '행운의 여행지 추천',
    description: '오늘의 운세가 알려주는 나만의 행운 여행지. 최저가 항공·호텔 예약.',
    cta: '여행지 보기',
    badge: '특가',
    placements: ['inline', 'native'],
    weight: 2,
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))',
  },
  // ── 자사 서비스 프로모션 ──
  {
    id: 'unse-my-promo',
    sponsor: '운세미',
    href: '/my',
    title: '나만의 통합 운세',
    description: '이름과 생년월일만 입력하면 별자리·사주·타로를 한번에!',
    cta: '무료 확인하기',
    badge: 'NEW',
    placements: ['banner', 'inline'],
    weight: 2,
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(168, 85, 247, 0.08))',
  },
  {
    id: 'unse-tarot-promo',
    sponsor: '운세미',
    href: '/tarot',
    title: '3장 타로 스프레드',
    description: '과거·현재·미래를 카드로 확인하세요. 연애/금전/직업 카테고리별 해석.',
    cta: '카드 뽑기',
    badge: '인기',
    placements: ['native'],
    weight: 1,
  },
  {
    id: 'unse-saju-promo',
    sponsor: '운세미',
    href: '/saju',
    title: '무료 사주풀이',
    description: '만세력 기반 사주팔자 분석. 성격, 적성, 재물운, 연애운까지.',
    cta: '사주 보기',
    badge: '무료',
    placements: ['native'],
    weight: 1,
  },
];

// ════════════════════════════════════════
// 광고 선택 로직
// ════════════════════════════════════════

/**
 * 가중치 기반 랜덤 선택
 */
function weightedRandom(ads: LocalAd[], seed: number): LocalAd | null {
  if (ads.length === 0) return null;

  // 만료된 광고 필터링
  const now = new Date().toISOString();
  const valid = ads.filter(ad => !ad.expiresAt || ad.expiresAt > now);
  if (valid.length === 0) return null;

  const totalWeight = valid.reduce((sum, ad) => sum + ad.weight, 0);

  // 시드 기반 의사 난수
  let s = seed;
  s = (s * 1103515245 + 12345) & 0x7fffffff;
  const roll = (s / 0x7fffffff) * totalWeight;

  let cumulative = 0;
  for (const ad of valid) {
    cumulative += ad.weight;
    if (roll <= cumulative) return ad;
  }
  return valid[valid.length - 1];
}

/**
 * placement와 page에 맞는 자체 광고 1건 가져오기
 */
export function getLocalAd(
  placement: LocalAdVariant,
  page?: string,
  seed?: number,
): LocalAd | null {
  let candidates = LOCAL_ADS.filter(ad => ad.placements.includes(placement));

  // 특정 페이지 필터
  if (page) {
    candidates = candidates.filter(ad => !ad.pages || ad.pages.includes(page));
  }

  const effectiveSeed = seed ?? Date.now();
  return weightedRandom(candidates, effectiveSeed);
}

/**
 * placement에 맞는 자체 광고 N건 가져오기 (중복 없이)
 */
export function getLocalAds(
  placement: LocalAdVariant,
  count: number,
  page?: string,
): LocalAd[] {
  let candidates = LOCAL_ADS.filter(ad => ad.placements.includes(placement));

  if (page) {
    candidates = candidates.filter(ad => !ad.pages || ad.pages.includes(page));
  }

  // 만료 필터
  const now = new Date().toISOString();
  candidates = candidates.filter(ad => !ad.expiresAt || ad.expiresAt > now);

  // 가중치 순 정렬 후 상위 N개
  candidates.sort((a, b) => b.weight - a.weight);
  return candidates.slice(0, count);
}
