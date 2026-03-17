/**
 * 상품 추천 API
 * _private/가 있으면 실제 상품 데이터 반환, 없으면 빈 배열 반환
 */
export { type ProductItem, type FortuneContext } from '@/lib/ads/types';
export { POST, GET } from '@/lib/ads/products-handler';
