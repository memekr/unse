'use client';

/**
 * 자체 광고 배너 (스텁)
 * 실제 구현은 빌드 시 _private/ 모듈로 대체됩니다.
 */

import type { LocalAd } from '@/lib/ads/local-ads';

type LocalAdBannerProps = {
  ad: LocalAd | null;
  variant?: 'inline' | 'banner' | 'native';
};

export default function LocalAdBanner(_props: LocalAdBannerProps) {
  return null;
}
