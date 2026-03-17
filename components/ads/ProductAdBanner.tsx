'use client';

import { useState, useEffect } from 'react';
import type { ProductItem } from '@/app/api/products/route';
import type { FortuneContext } from '@/lib/product-keywords';
import { getProductKeywords } from '@/lib/product-keywords';

type Props = {
  context: FortuneContext;
  /** 배너 제목 (기본: "운세가 추천하는 아이템") */
  title?: string;
  /** 배너 설명 */
  desc?: string;
  /** 아이콘 이모지 */
  icon?: string;
  /** 기존 AliExpress/Trip.com 폴백 표시 여부 */
  showFallback?: boolean;
};

/** AliExpress 제휴 링크 */
const ALI_LINK = 'https://s.click.aliexpress.com/e/_olzd8TL';
/** Trip.com 제휴 링크 */
const TRIP_LINK = 'https://www.trip.com/t/Ik6QQwDcjT2';

export default function ProductAdBanner({
  context,
  title = '운세가 추천하는 아이템',
  desc,
  icon = '🛍️',
  showFallback = true,
}: Props) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const keywords = getProductKeywords(context, 2);
        // 첫 번째 키워드로 검색 시도
        const keyword = keywords[0];
        if (!keyword) { setLoading(false); setError(true); return; }

        const res = await fetch(`/api/products?keyword=${encodeURIComponent(keyword)}&limit=4`);
        if (!res.ok) { setError(true); setLoading(false); return; }

        const data = await res.json();
        if (!cancelled) {
          setProducts(data.products ?? []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) { setError(true); setLoading(false); }
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, [context]);

  // API 키 미설정 또는 에러 시 기존 배너로 폴백
  if (!loading && (error || products.length === 0)) {
    if (!showFallback) return null;
    return (
      <div className="promo-banner" style={{ marginBottom: '1rem' }}>
        <div className="promo-banner__icon">{icon}</div>
        <div className="promo-banner__title">{title}</div>
        {desc && <div className="promo-banner__desc">{desc}</div>}
        <div className="promo-banner__buttons">
          <a
            href={ALI_LINK}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="promo-banner__btn promo-banner__btn--primary"
          >
            🛒 행운 아이템 찾기
          </a>
          <a
            href={TRIP_LINK}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="promo-banner__btn promo-banner__btn--secondary"
          >
            ✈️ 행운의 여행지
          </a>
        </div>
        <div className="promo-banner__note">제휴 링크를 통해 구매 시 운세미 운영에 도움이 됩니다</div>
      </div>
    );
  }

  // 로딩 중
  if (loading) {
    return (
      <div className="promo-banner" style={{ marginBottom: '1rem' }}>
        <div className="promo-banner__icon">{icon}</div>
        <div className="promo-banner__title">{title}</div>
        <div className="product-ad__loading">
          <div className="product-ad__skeleton" />
          <div className="product-ad__skeleton" />
        </div>
      </div>
    );
  }

  // 상품 노출
  return (
    <div className="promo-banner" style={{ marginBottom: '1rem' }}>
      <div className="promo-banner__icon">{icon}</div>
      <div className="promo-banner__title">{title}</div>
      {desc && <div className="promo-banner__desc">{desc}</div>}

      <div className="product-ad__grid">
        {products.map((p) => (
          <a
            key={p.id}
            href={p.link}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="product-ad__card"
          >
            <div className="product-ad__img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.title} className="product-ad__img" loading="lazy" />
              <span className="product-ad__source">쿠팡</span>
            </div>
            <div className="product-ad__info">
              <div className="product-ad__name">{p.title}</div>
              <div className="product-ad__price">{p.price}</div>
            </div>
          </a>
        ))}
      </div>

      <div className="promo-banner__note">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다
      </div>
    </div>
  );
}
