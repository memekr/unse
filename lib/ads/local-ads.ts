/**
 * 자체 광고풀 (스텁)
 * 실제 광고 데이터는 빌드 시 _private/ 모듈로 대체됩니다.
 */

export type LocalAdVariant = 'banner' | 'inline' | 'interstitial' | 'native';

export type LocalAd = {
  id: string;
  sponsor: string;
  href: string;
  title: string;
  description: string;
  cta: string;
  badge: string;
  placements: LocalAdVariant[];
  weight: number;
  expiresAt?: string;
  pages?: string[];
  imageUrl?: string;
  bgGradient?: string;
};

export const LOCAL_ADS: LocalAd[] = [];

export function getLocalAd(
  _placement: LocalAdVariant,
  _page?: string,
  _seed?: number,
): LocalAd | null {
  return null;
}

export function getLocalAds(
  _placement: LocalAdVariant,
  _count: number,
  _page?: string,
): LocalAd[] {
  return [];
}
