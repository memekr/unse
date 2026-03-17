'use client';

import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { DREAM_DATABASE, generateLottoNumbers } from '@/lib/dream-data';
import ProductAdBanner from '@/components/ads/ProductAdBanner';
import type { DreamEntry } from '@/lib/dream-data';

const CATEGORIES = [
  { label: '전체', value: '' },
  { label: '\uD83D\uDC3E 동물', value: '동물' },
  { label: '\uD83C\uDF3F 자연', value: '자연' },
  { label: '\uD83D\uDC64 사람', value: '사람' },
  { label: '\uD83D\uDCE6 사물', value: '사물' },
  { label: '\uD83C\uDFAC 상황', value: '상황' },
  { label: '\uD83D\uDD22 숫자', value: '숫자' },
];

export default function DreamPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showLotto, setShowLotto] = useState(false);

  const results = useMemo(() => {
    let filtered: DreamEntry[] = DREAM_DATABASE;
    if (query.trim()) {
      filtered = filtered.filter(
        (d) => d.keyword.includes(query.trim()) || d.meaning.includes(query.trim()),
      );
    }
    if (category) {
      filtered = filtered.filter((d) => d.category === category);
    }
    return filtered;
  }, [query, category]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    // results는 이미 memo로 계산됨
  }

  function handleCategoryClick(cat: string) {
    setCategory(cat);
  }

  function toggleKeyword(keyword: string) {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword].slice(-3) // 최대 3개
    );
  }

  const lottoNumbers = useMemo(() => {
    if (selectedKeywords.length === 0) return [];
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return generateLottoNumbers(selectedKeywords, seed);
  }, [selectedKeywords]);

  return (
    <div>
      <div className="page-header">
        <div className="page-icon">{'\uD83D\uDCAD'}</div>
        <h1>{'꿈해몽'}</h1>
        <p>{'간밤의 꿈이 무엇을 의미하는지 알아보세요'}</p>
      </div>

      <div className="dream-search">
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-input"
            placeholder={'꿈에 나온 키워드를 입력하세요 (예: 뱀, 물, 불...)'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {'검색'}
          </button>
        </form>

        <div className="dream-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`dream-tag ${category === cat.value ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.value)}
              style={
                category === cat.value
                  ? { borderColor: 'var(--color-cta)', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--color-text)' }
                  : undefined
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 로또 번호 추천 */}
      <div style={{
        maxWidth: '42rem', margin: '0 auto 2rem', textAlign: 'center',
      }}>
        <button
          className="dream-tag"
          onClick={() => setShowLotto(!showLotto)}
          style={{
            borderColor: 'var(--color-gold)',
            background: 'rgba(251, 191, 36, 0.1)',
            color: 'var(--color-gold)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {'\uD83C\uDFB0 로또 번호 추천'}
          {showLotto ? ' \u25B2' : ' \u25BC'}
        </button>

        {showLotto && (
          <div style={{
            marginTop: '1rem',
            padding: '1.25rem',
            borderRadius: '1rem',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-glass-border)',
          }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              {'꿈 키워드를 선택하면 행운의 숫자 기반 로또 번호를 추천합니다'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', justifyContent: 'center', marginBottom: '1rem' }}>
              {DREAM_DATABASE.slice(0, 20).map((d) => (
                <button
                  key={d.keyword}
                  className="dream-tag"
                  onClick={() => toggleKeyword(d.keyword)}
                  style={
                    selectedKeywords.includes(d.keyword)
                      ? { borderColor: 'var(--color-gold)', background: 'rgba(251, 191, 36, 0.15)', color: 'var(--color-gold)', fontSize: '0.75rem', padding: '0.25rem 0.625rem' }
                      : { fontSize: '0.75rem', padding: '0.25rem 0.625rem' }
                  }
                >
                  {d.emoji}{' '}{d.keyword}
                </button>
              ))}
            </div>

            {lottoNumbers.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
                  {'\uD83C\uDFB1 오늘의 추천 번호'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  {lottoNumbers.map((num, i) => (
                    <span key={i} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      background: 'var(--gradient-primary)',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.9375rem',
                      boxShadow: '0 2px 8px var(--color-cta-glow)',
                    }}>
                      {num}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
                  {'* 재미로만 참고하세요. 실제 당첨과는 관련이 없습니다.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 검색 결과 */}
      <div className="dream-results">
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-dim)' }}>
            {'검색 결과가 없습니다. 다른 키워드로 검색해보세요.'}
          </div>
        ) : (
          results.map((dream) => (
            <article key={dream.keyword} className="dream-item">
              <h3>
                <span>{dream.emoji}</span>
                <span>{dream.keyword}{' 꿈'}</span>
              </h3>
              <p className="dream-meaning">{dream.meaning}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                <span className="dream-lucky">
                  {'\uD83C\uDFB2 행운의 숫자: '}{dream.luckyNumber}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: 'var(--color-accent)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {dream.category}
                </span>
              </div>
            </article>
          ))
        )}
      </div>

      {/* 꿈해몽 결과가 있을 때 상품 추천 */}
      {(query.trim() || category) && results.length > 0 && (
        <ProductAdBanner
          context={{
            type: 'lucky',
            luckyColor: results[0]?.category === '자연' ? '초록' : results[0]?.category === '동물' ? '금색' : undefined,
          }}
          icon="💭"
          title="꿈이 알려준 행운 아이템"
          desc="꿈에서 받은 행운의 기운을 실제 생활로 가져오세요"
        />
      )}
    </div>
  );
}
