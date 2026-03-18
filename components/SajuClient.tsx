'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { calculateSaju, FIVE_ELEMENTS_KO, FIVE_ELEMENTS_NAME, FIVE_ELEMENTS_COLOR } from '@/lib/saju-engine';
import ProductAdBanner from '@/components/ads/ProductAdBanner';
import type { SajuResult } from '@/lib/saju-engine';

const BIRTH_TIMES = [
  { label: '자시 (23~01)', value: 0 },
  { label: '축시 (01~03)', value: 1 },
  { label: '인시 (03~05)', value: 2 },
  { label: '묘시 (05~07)', value: 3 },
  { label: '진시 (07~09)', value: 4 },
  { label: '사시 (09~11)', value: 5 },
  { label: '오시 (11~13)', value: 6 },
  { label: '미시 (13~15)', value: 7 },
  { label: '신시 (15~17)', value: 8 },
  { label: '유시 (17~19)', value: 9 },
  { label: '술시 (19~21)', value: 10 },
  { label: '해시 (21~23)', value: 11 },
];

export default function SajuClient() {
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [birthTime, setBirthTime] = useState<number>(-1);
  const [result, setResult] = useState<SajuResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!birthDate || !gender) return;

    setLoading(true);
    setTimeout(() => {
      const date = new Date(birthDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const sajuResult = calculateSaju(year, month, day, birthTime, gender);
      setResult(sajuResult);
      setLoading(false);
    }, 1000);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-icon">{'\uD83C\uDFB4'}</div>
        <h1>{'사주풀이 - 생년월일로 보는 나의 운명'}</h1>
        <p>{'생년월일시를 입력하고 나의 사주팔자를 확인하세요'}</p>
      </div>

      <form className="saju-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{'생년월일'}</label>
          <span className="label-desc">{'양력 기준으로 입력해주세요'}</span>
          <input
            type="date"
            className="form-input"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>{'성별'}</label>
          <div className="gender-buttons">
            <button
              type="button"
              className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
              onClick={() => setGender('male')}
            >
              {'남성'}
            </button>
            <button
              type="button"
              className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
              onClick={() => setGender('female')}
            >
              {'여성'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>{'태어난 시간'}</label>
          <span className="label-desc">{'모르면 선택하지 않아도 됩니다'}</span>
          <div className="time-select">
            {BIRTH_TIMES.map((time) => (
              <button
                key={time.value}
                type="button"
                className={`time-btn ${birthTime === time.value ? 'active' : ''}`}
                onClick={() => setBirthTime(birthTime === time.value ? -1 : time.value)}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={!birthDate || !gender}>
          {'사주 분석하기'}
        </button>
      </form>

      {loading && (
        <div className="loading-spinner">
          <span className="spinner" />
          <span>{'만세력 기반으로 사주를 분석하고 있습니다...'}</span>
        </div>
      )}

      {result && !loading && (
        <>
          <div className="result-panel">
            <h2>{'\uD83C\uDFB4 사주팔자 분석 결과'}</h2>

            {/* 사주 4주 표시 */}
            <div className="saju-pillars">
              <div className="saju-pillar">
                <div className="saju-pillar-label">{'시주'}</div>
                <div className="saju-pillar-value">
                  {birthTime >= 0 ? (
                    <>
                      {result.timePillar.stemHanja}
                      {result.timePillar.branchHanja}
                    </>
                  ) : '- -'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
                  {birthTime >= 0 ? `${result.timePillar.stemKo}${result.timePillar.branchKo}` : '미정'}
                </div>
              </div>
              <div className="saju-pillar">
                <div className="saju-pillar-label">{'일주'}</div>
                <div className="saju-pillar-value">
                  {result.dayPillar.stemHanja}
                  {result.dayPillar.branchHanja}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
                  {result.dayPillar.stemKo}{result.dayPillar.branchKo}
                </div>
              </div>
              <div className="saju-pillar">
                <div className="saju-pillar-label">{'월주'}</div>
                <div className="saju-pillar-value">
                  {result.monthPillar.stemHanja}
                  {result.monthPillar.branchHanja}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
                  {result.monthPillar.stemKo}{result.monthPillar.branchKo}
                </div>
              </div>
              <div className="saju-pillar">
                <div className="saju-pillar-label">{'연주'}</div>
                <div className="saju-pillar-value">
                  {result.yearPillar.stemHanja}
                  {result.yearPillar.branchHanja}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
                  {result.yearPillar.stemKo}{result.yearPillar.branchKo}
                </div>
              </div>
            </div>

            {/* 음양 */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.375rem 1rem',
                borderRadius: '9999px',
                background: result.yinYang === 'yang'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(59, 130, 246, 0.15)',
                color: result.yinYang === 'yang' ? '#f87171' : '#60a5fa',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}>
                {result.yinYang === 'yang' ? '\u2600\uFE0F 양(陽)' : '\uD83C\uDF19 음(陰)'}
                {' | 주요 오행: '}
                {FIVE_ELEMENTS_NAME[result.dominantElement]}
                {'('}
                {FIVE_ELEMENTS_KO[result.dominantElement]}
                {')'}
              </span>
            </div>

            {/* 오행 비율 차트 */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.75rem', textAlign: 'center' }}>
                {'오행 비율 분석'}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {result.fiveElementPercents.map((pct, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.375rem',
                    minWidth: '3.5rem',
                  }}>
                    <div style={{
                      width: '2.5rem',
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '0.375rem',
                      overflow: 'hidden',
                      height: '5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}>
                      <div style={{
                        height: `${Math.max(pct, 5)}%`,
                        background: FIVE_ELEMENTS_COLOR[idx],
                        borderRadius: '0.375rem 0.375rem 0 0',
                        transition: 'height 0.5s ease',
                        minHeight: '4px',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: FIVE_ELEMENTS_COLOR[idx] }}>
                      {FIVE_ELEMENTS_NAME[idx]}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>
                      {pct}{'%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 해석 섹션들 */}
            <div className="saju-section">
              <div className="saju-section-title">{'\uD83D\uDD2E 성격 분석'}</div>
              <p className="saju-section-text">{result.personality}</p>
            </div>

            <div className="saju-section">
              <div className="saju-section-title">{'\uD83D\uDCBC 적성 및 직업'}</div>
              <p className="saju-section-text">{result.career}</p>
            </div>

            <div className="saju-section">
              <div className="saju-section-title">{'\uD83D\uDCB0 재물운'}</div>
              <p className="saju-section-text">{result.wealth}</p>
            </div>

            <div className="saju-section">
              <div className="saju-section-title">{'\u2764\uFE0F 연애운'}</div>
              <p className="saju-section-text">{result.love}</p>
            </div>

            <div className="saju-section">
              <div className="saju-section-title">{'\uD83D\uDC9A 건강운'}</div>
              <p className="saju-section-text">{result.health}</p>
            </div>

            <div className="saju-section" style={{ borderBottom: 'none' }}>
              <div className="saju-section-title">{'\uD83C\uDF1F 올해의 운세'}</div>
              <p className="saju-section-text">{result.yearly}</p>
            </div>
          </div>

          {/* 사주 결과 하단 상품 추천 */}
          <ProductAdBanner
            context={{ type: 'saju', dominantElement: result.dominantElement, weakElement: result.weakElement }}
            icon="🎴"
            title="사주에 맞는 행운 아이템"
            desc="오행의 균형을 맞춰주는 아이템을 찾아보세요"
          />
        </>
      )}
    </div>
  );
}
