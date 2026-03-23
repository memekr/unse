'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ProductAdBanner from '@/components/ads/ProductAdBanner';

export type ZodiacFortune = {
  name: string;
  icon: string;
  dateRange: string;
  slug: string;
  overall: number;
  love: number;
  money: number;
  health: number;
  fortuneText: string;
  overallText: string;
  loveText: string;
  moneyText: string;
  healthText: string;
  advice: string;
  luckyColor: string;
  luckyNumber: number;
};

function renderStars(count: number): string {
  return '\u2B50'.repeat(count) + '\u2606'.repeat(5 - count);
}

function scoreBar(score: number, color: string) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${score * 20}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s' }} />
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color, minWidth: '2.5rem', textAlign: 'right' }}>{score * 20}점</span>
    </div>
  );
}

export default function HoroscopeClient({
  fortunes,
  dateStr,
}: {
  fortunes: ZodiacFortune[];
  dateStr: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [shareMsg, setShareMsg] = useState('');

  // URL 파라미터에서 별자리 복원
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sign = params.get('sign');
    if (sign && fortunes.some(f => f.slug === sign)) {
      setSelected(sign);
    }
  }, [fortunes]);

  const selectedZodiac = selected
    ? fortunes.find((z) => z.slug === selected) ?? null
    : null;

  useEffect(() => {
    if (selectedZodiac && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // URL 업데이트
    if (selected) {
      const today = new Date();
      const dateParam = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      window.history.replaceState(null, '', `/horoscope?date=${dateParam}&sign=${selected}`);
    } else {
      window.history.replaceState(null, '', '/horoscope');
    }
  }, [selectedZodiac, selected]);

  const handleShare = useCallback(() => {
    if (!selected) return;
    const today = new Date();
    const dateParam = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const url = `${window.location.origin}/horoscope?date=${dateParam}&sign=${selected}`;

    if (navigator.share) {
      navigator.share({ title: `${selectedZodiac?.name} 오늘의 운세 - 운세미`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareMsg('링크가 복사되었습니다!');
        setTimeout(() => setShareMsg(''), 2000);
      }).catch(() => {});
    }
  }, [selected, selectedZodiac]);

  // 상세 뷰
  if (selectedZodiac) {
    const z = selectedZodiac;
    const scoreBadgeBg = z.overall >= 4 ? 'rgba(52,211,153,0.15)' : z.overall >= 3 ? 'rgba(96,165,250,0.15)' : 'rgba(248,113,113,0.15)';
    const scoreBadgeBorder = z.overall >= 4 ? 'rgba(52,211,153,0.3)' : z.overall >= 3 ? 'rgba(96,165,250,0.3)' : 'rgba(248,113,113,0.3)';
    const scoreColor = z.overall >= 4 ? '#34d399' : z.overall >= 3 ? '#60a5fa' : '#f87171';

    return (
      <div ref={detailRef}>
        {/* 뒤로가기 */}
        <button onClick={() => setSelected(null)} className="horoscope-back-btn">
          ← 전체 별자리
        </button>

        {/* 헤더 */}
        <div className="horoscope-detail-header">
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{z.icon}</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {z.name} 오늘의 운세
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
            {z.dateRange} · {dateStr}
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            marginTop: '0.75rem', padding: '0.375rem 0.875rem', borderRadius: '9999px',
            background: scoreBadgeBg, border: `1px solid ${scoreBadgeBorder}`,
          }}>
            <span style={{ fontSize: '0.8125rem' }}>{renderStars(z.overall)}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: scoreColor }}>
              {z.overall * 20}점
            </span>
          </div>
        </div>

        {/* 종합운 */}
        <section className="horoscope-section">
          <h3 className="horoscope-section-title">✨ 오늘의 운세</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
            {z.fortuneText}
          </p>
        </section>

        {/* 운세 세부 항목 */}
        <section className="horoscope-section">
          <h3 className="horoscope-section-title" style={{ marginBottom: '1rem' }}>📊 세부 운세</h3>

          {[
            { label: '종합운', text: z.overallText, score: z.overall, color: '#a78bfa', icon: '🌟' },
            { label: '연애운', text: z.loveText, score: z.love, color: '#f472b6', icon: '❤️' },
            { label: '금전운', text: z.moneyText, score: z.money, color: '#fbbf24', icon: '💰' },
            { label: '건강운', text: z.healthText, score: z.health, color: '#34d399', icon: '💚' },
          ].map((item, i) => (
            <div key={i} className="horoscope-detail-item" style={{ borderLeft: `3px solid ${item.color}` }}>
              <div className="horoscope-detail-item-header">
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: item.color }}>
                  {item.icon} {item.label}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                  {renderStars(item.score)}
                </span>
              </div>
              {scoreBar(item.score, item.color)}
              <p style={{
                fontSize: '0.8125rem', color: 'var(--color-text-muted)',
                lineHeight: 1.7, marginTop: '0.5rem',
              }}>
                {item.text}
              </p>
            </div>
          ))}
        </section>

        {/* 행운 정보 */}
        <section className="horoscope-section">
          <h3 className="horoscope-section-title">🍀 행운 정보</h3>
          <div className="horoscope-lucky-grid">
            <div className="horoscope-lucky-item">
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>
                🌈 행운의 색
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                {z.luckyColor}
              </div>
            </div>
            <div className="horoscope-lucky-item">
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>
                🎲 행운의 숫자
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gold)' }}>
                {z.luckyNumber}
              </div>
            </div>
          </div>
        </section>

        {/* 오늘의 조언 */}
        <section className="horoscope-advice">
          <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
            💫 오늘의 한마디
          </div>
          <p style={{
            fontSize: '0.9375rem', color: 'var(--color-text)', fontStyle: 'italic',
            lineHeight: 1.7,
          }}>
            &ldquo;{z.advice}&rdquo;
          </p>
        </section>

        {/* 공유하기 버튼 */}
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <button onClick={handleShare} className="horoscope-share-btn">
            {'\uD83D\uDD17 결과 공유하기'}
          </button>
          {shareMsg && (
            <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', marginTop: '0.5rem' }}>
              {shareMsg}
            </p>
          )}
        </div>

        {/* 맞춤 상품 추천 */}
        <ProductAdBanner
          context={{ type: 'horoscope', luckyColor: z.luckyColor, zodiacName: z.name }}
          icon={z.overall >= 4 ? '🌟' : z.overall >= 3 ? '🔮' : '🍀'}
          title={`${z.name}에게 어울리는 행운 아이템`}
          desc={`${z.luckyColor} 컬러 아이템이 오늘의 행운을 더해줍니다`}
        />

        {/* 다른 별자리 둘러보기 */}
        <section className="horoscope-section" style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>
            다른 별자리 운세 보기
          </h3>
          <div className="horoscope-other-signs">
            {fortunes.filter(f => f.slug !== z.slug).map((f) => (
              <button
                key={f.slug}
                onClick={() => setSelected(f.slug)}
                className="horoscope-sign-btn"
              >
                {f.icon} {f.name}
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // 그리드 뷰 (전체 별자리)
  return (
    <div>
      <div className="horoscope-grid">
        {fortunes.map((zodiac) => (
          <article
            key={zodiac.slug}
            className="horoscope-card"
            id={zodiac.slug}
            onClick={() => setSelected(zodiac.slug)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setSelected(zodiac.slug); }}
          >
            <div className="horoscope-card-header">
              <span className="icon">{zodiac.icon}</span>
              <div className="info">
                <h3>{zodiac.name}</h3>
                <span className="date-range">{zodiac.dateRange}</span>
              </div>
            </div>

            <div className="luck-meters" style={{ borderTop: 'none', paddingTop: 0 }}>
              <div className="luck-meter">
                <span className="label">종합</span>
                <span className="stars">{renderStars(zodiac.overall)}</span>
              </div>
              <div className="luck-meter">
                <span className="label">연애</span>
                <span className="stars">{renderStars(zodiac.love)}</span>
              </div>
              <div className="luck-meter">
                <span className="label">금전</span>
                <span className="stars">{renderStars(zodiac.money)}</span>
              </div>
              <div className="luck-meter">
                <span className="label">건강</span>
                <span className="stars">{renderStars(zodiac.health)}</span>
              </div>
            </div>

            <p className="fortune-text">{zodiac.fortuneText}</p>

            <div className="lucky-info">
              🌈 행운의 색: {zodiac.luckyColor} | 🎲 행운의 숫자: {zodiac.luckyNumber}
            </div>

            {/* 클릭 유도 */}
            <div style={{
              marginTop: '0.625rem', textAlign: 'center',
              fontSize: '0.75rem', color: 'var(--color-accent)',
              opacity: 0.8,
            }}>
              자세히 보기 →
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
