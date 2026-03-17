/**
 * 공용 광고풀 — 중앙 API(serus-korea-vercel)에서 광고를 가져옵니다.
 *
 * 로컬 하드코딩 대신 중앙 shared-ads API를 호출하여 항상 최신 광고풀을 사용합니다.
 * API 장애 시 빈 배열을 반환합니다.
 */

const SHARED_ADS_API =
  'https://serus-korea-vercel.vercel.app/api/shared-ads';
const SITE_ID = 'unse';

export type SharedAdVariant = 'inline-card' | 'sidebar' | 'footer-strip';
export type SharedSiteId = string;

export type SharedAdCreative = {
  id: string;
  sponsor: string;
  href: string;
  title: string;
  description: string;
  cta: string;
  badge: string;
  tags: string[];
  placements: SharedAdVariant[];
  weight?: number;
  expiresAt?: string;
  siteOverrides?: Partial<
    Record<
      string,
      {
        title?: string;
        description?: string;
        cta?: string;
        badge?: string;
      }
    >
  >;
};

export type ResolvedAdCreative = SharedAdCreative & {
  placement: SharedAdVariant;
  site: string;
};

// ── API 호출 (Next.js fetch 캐시 활용) ──

async function fetchAds(
  placement: SharedAdVariant,
  limit = 3,
): Promise<ResolvedAdCreative[]> {
  try {
    const url = `${SHARED_ADS_API}?site=${SITE_ID}&placement=${placement}&limit=${limit}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? []).map((item: ResolvedAdCreative) => ({
      ...item,
      placement,
      site: SITE_ID,
    }));
  } catch {
    return [];
  }
}

/**
 * 중앙 API에서 광고 1건을 가져옵니다.
 */
export async function resolveSharedAd(
  site: string,
  placement: SharedAdVariant,
  _seed = 0,
): Promise<ResolvedAdCreative | null> {
  const items = await fetchAds(placement, 1);
  return items[0] ?? null;
}

/**
 * 중앙 API에서 해당 placement의 광고를 모두 가져옵니다.
 */
export async function resolveAllAds(
  site: string,
  placement: SharedAdVariant,
): Promise<ResolvedAdCreative[]> {
  return fetchAds(placement, 10);
}

/**
 * 하위 호환용 — 로컬 API route에서 사용
 * (deprecated: 중앙 API를 직접 호출하세요)
 */
export const sharedAdFeed: SharedAdCreative[] = [];
