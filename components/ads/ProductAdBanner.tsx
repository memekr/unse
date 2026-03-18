// @ts-nocheck
'use client';

/**
 * 상품 추천 배너
 * _private/ 존재 시 실제 구현 로드, 없으면 null
 */

import type { FortuneContext } from '@/lib/ads/types';

type Props = {
  context: FortuneContext;
  title?: string;
  desc?: string;
  icon?: string;
};

export type { FortuneContext };

let Impl: any = null;
try {
  Impl = require('../../_private/ads/ProductAdBanner').default;
} catch {}

export default function ProductAdBanner(props: Props) {
  if (Impl) return <Impl {...props} />;
  return null;
}
