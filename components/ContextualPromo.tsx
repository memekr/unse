'use client';

import { useMemo } from 'react';

interface PromoRule {
  keywords: string[];
  target: string;
  text: string;
  icon: string;
}

const PROMO_RULES: PromoRule[] = [
  { keywords: ['경제', '주가', '환율', '주식', '증시'], target: 'https://jusik.me', text: '주식 뉴스도 확인하세요', icon: '\uD83D\uDCC8' },
  { keywords: ['전쟁', '분쟁', '이란', '우크라이나', '러시아', '이스라엘'], target: 'https://warwar.me', text: '전쟁 속보 확인', icon: '\u2694\uFE0F' },
  { keywords: ['유출', '해킹', '보안', '개인정보', '사이버'], target: 'https://yuchul.com', text: '내 정보 유출 확인', icon: '\uD83D\uDD12' },
  { keywords: ['할인', '쿠폰', '알리', '알리익스프레스', '특가'], target: 'https://alihalin.com', text: '최신 알리 할인', icon: '\uD83D\uDED2' },
  { keywords: ['멤버십', '구독', '혜택', '포인트', '적립'], target: 'https://plusmoa.shop', text: '멤버십 비교하기', icon: '\uD83D\uDC8E' },
];

interface ContextualPromoProps {
  content: string;
  currentSite?: string;
  maxItems?: number;
}

export function ContextualPromo({ content, currentSite, maxItems = 2 }: ContextualPromoProps) {
  const matches = useMemo(() => {
    const lc = content.toLowerCase();
    return PROMO_RULES
      .filter(rule => {
        if (currentSite && rule.target.includes(currentSite)) return false;
        return rule.keywords.some(kw => lc.includes(kw));
      })
      .slice(0, maxItems);
  }, [content, currentSite, maxItems]);

  if (matches.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem 0' }} role="complementary" aria-label="관련 서비스">
      {matches.map((rule) => (
        <a
          key={rule.target}
          href={rule.target}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            borderRadius: '0.5rem', border: '1px solid var(--color-glass-border, rgba(255,255,255,0.08))',
            background: 'var(--color-glass, rgba(255,255,255,0.03))',
            padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted, #ccc)',
            textDecoration: 'none', transition: 'border-color 0.2s',
          }}
        >
          <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>{rule.icon}</span>
          <span style={{ fontWeight: 500 }}>{rule.text}</span>
          <svg style={{ width: '0.875rem', height: '0.875rem', marginLeft: 'auto', color: 'var(--color-text-dim, #555)', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </a>
      ))}
    </div>
  );
}
