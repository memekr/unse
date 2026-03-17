'use client';

import { useState, useEffect } from 'react';
import type { ProductItem } from '@/app/api/products/route';

export type FortuneContext = {
  type: 'horoscope' | 'saju' | 'tarot' | 'lucky';
  luckyColor?: string;
  zodiacName?: string;
  dominantElement?: string | number;
  weakElement?: string | number;
  tarotCardName?: string;
};

type Props = {
  context: FortuneContext;
  /** 배너 제목 (기본: "운세가 추천하는 아이템") */
  title?: string;
  /** 배너 설명 */
  desc?: string;
  /** 아이콘 이모지 */
  icon?: string;
};

export default function ProductAdBanner({
  context,
  title = '운세가 추천하는 아이템',
  desc,
  icon = '🛍️',
}: Props) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(context),
        });

        if (!res.ok) throw new Error(`${res.status}`);

        const data = await res.json();
        if (!cancelled) {
          setProducts(data.products ?? []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, [context]);

  // 로딩
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

  // 상품이 없으면 아무것도 안 보여줌 (풀에서 무조건 4개 나오므로 거의 안 일어남)
  if (products.length === 0) return null;

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
            <div className="product-ad__emoji-wrap">
              <span className="product-ad__emoji">{p.emoji}</span>
              <span className="product-ad__source">쿠팡</span>
            </div>
            <div className="product-ad__info">
              <div className="product-ad__name">{p.title}</div>
              <div className="product-ad__keyword">🔍 {p.keyword}</div>
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
