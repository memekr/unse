'use client';

/**
 * 상품 추천 배너 (스텁)
 * 실제 구현은 빌드 시 _private/ 모듈로 대체됩니다.
 */

import type { FortuneContext } from '@/lib/ads/types';

type Props = {
  context: FortuneContext;
  title?: string;
  desc?: string;
  icon?: string;
};

export type { FortuneContext };

export default function ProductAdBanner(_props: Props) {
  return null;
}
