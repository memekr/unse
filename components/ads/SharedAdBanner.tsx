'use client';

/**
 * 공용 광고 배너 (스텁)
 * 실제 구현은 빌드 시 _private/ 모듈로 대체됩니다.
 */

import type { ResolvedAdCreative, SharedAdVariant } from '@/lib/ads/shared-feed';

type SharedAdBannerProps = {
  ad: ResolvedAdCreative | null;
  variant?: SharedAdVariant;
  className?: string;
};

export default function SharedAdBanner(_props: SharedAdBannerProps) {
  return null;
}
