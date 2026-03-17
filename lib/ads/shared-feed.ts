/**
 * 공용 광고풀 (스텁)
 * 실제 구현은 빌드 시 _private/ 모듈로 대체됩니다.
 */

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
  siteOverrides?: Partial<Record<string, {
    title?: string;
    description?: string;
    cta?: string;
    badge?: string;
  }>>;
};

export type ResolvedAdCreative = SharedAdCreative & {
  placement: SharedAdVariant;
  site: string;
};

export async function resolveSharedAd(
  _site: string,
  _placement: SharedAdVariant,
  _seed?: number,
): Promise<ResolvedAdCreative | null> {
  return null;
}

export async function resolveAllAds(
  _site: string,
  _placement: SharedAdVariant,
): Promise<ResolvedAdCreative[]> {
  return [];
}

export const sharedAdFeed: SharedAdCreative[] = [];
