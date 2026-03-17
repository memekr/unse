/**
 * 상품 추천 풀 (스텁)
 * 실제 구현은 빌드 시 _private/ 모듈로 대체됩니다.
 */

import type { FortuneContext } from '@/lib/ads/types';

export type PoolItem = {
  id: string;
  title: string;
  keyword: string;
  emoji: string;
  tags: string[];
};

export type { FortuneContext };

export const ALL_ITEMS: PoolItem[] = [];

export function pickItems(_ctx: FortuneContext, _count?: number): PoolItem[] {
  return [];
}

export function coupangSearchUrl(_keyword: string): string {
  return '';
}
