'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { calculateSaju, FIVE_ELEMENTS_KO, FIVE_ELEMENTS_NAME, FIVE_ELEMENTS_COLOR } from '@/lib/saju-engine';
import type { SajuResult } from '@/lib/saju-engine';
import { ZODIAC_SIGNS, getDailySeed, seededRandom } from '@/lib/fortune-data';
import {
  getZodiacSign, getZodiacFortune, hashName, getDailyTarot,
  getLuckyNumbers, BIRTH_TIMES,
} from '@/lib/fortune-utils';

function stars(n: number) {
  return '\u2B50'.repeat(n) + '\u2606'.repeat(5 - n);
}

/* ── 타입 ── */

type FullResult = {
  name: string;
  zodiac: typeof ZODIAC_SIGNS[number];
  zodiacIndex: number;
  fortune: ReturnType<typeof getZodiacFortune>;
  saju: SajuResult;
  tarot: ReturnType<typeof getDailyTarot>;
  luckyNumbers: number[];
  birthTime: number;
};

/* ── 메인 컴포넌트 ── */

export default function HomePage() {
  const { user, signInWithGoogle, isConfigured } = useAuth();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [birthTime, setBirthTime] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FullResult | null>(null);

  // 저장된 프로필
  const [saved] = useState<Array<{ name: string; birthDate: string; gender: string; birthTime: number }>>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('unse_profiles') ?? '[]'); } catch { return []; }
  });

  function loadProfile(p: typeof saved[number]) {
    setName(p.name); setBirthDate(p.birthDate); setGender(p.gender); setBirthTime(p.birthTime);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !birthDate || !gender) return;
    setLoading(true);
    setTimeout(() => {
      const d = new Date(birthDate);
      const [y, m, day] = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
      const zodiac = getZodiacSign(m, day);
      const zodiacIndex = ZODIAC_SIGNS.indexOf(zodiac);
      const fortune = getZodiacFortune(zodiacIndex);
      const saju = calculateSaju(y, m, day, birthTime, gender);
      const ns = hashName(name.trim());
      const tarot = getDailyTarot(getDailySeed() + ns);

      setResult({
        name: name.trim(), zodiac, zodiacIndex, fortune, saju, tarot,
        luckyNumbers: getLuckyNumbers((getDailySeed() + ns) * 7),
        birthTime,
      });
      setLoading(false);

      // 프로필 저장
      try {
        const p = { name: name.trim(), birthDate, gender, birthTime };
        const list = [p, ...saved.filter(s => s.name !== p.name)].slice(0, 5);
        localStorage.setItem('unse_profiles', JSON.stringify(list));
      } catch { /* */ }
    }, 1000);
  }

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  /* ── 입력 폼 (결과 없을 때) ── */
  if (!result) {
    return (
      <div className="home-page">
        <section className="hero-fortune">
          <div className="hero-visual">
            <span className="hero-moon">{'\uD83C\uDF19'}</span>
            <div className="hero-stars-orbit">
              <span>{'\u2728'}</span><span>{'\u2B50'}</span>
              <span>{'\u2728'}</span><span>{'\u2B50'}</span>
            </div>
          </div>
          <h1>{'나만의 운세를 확인하세요'}</h1>
          <p className="hero-desc">
            {'이름과 생년월일을 입력하면'}
            <br />
            {'별자리 운세 · 사주풀이 · 타로카드 · 행운번호를 한번에!'}
          </p>
        </section>

        <form className="saju-form" onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          {/* 최근 조회 */}
          {saved.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem', display: 'block' }}>
                {'최근 조회'}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {saved.map((p, i) => (
                  <button key={i} type="button" onClick={() => loadProfile(p)} style={{
                    padding: '0.375rem 0.75rem', borderRadius: '9999px',
                    border: '1px solid var(--color-glass-border)', background: 'var(--color-glass)',
                    color: 'var(--color-text)', fontSize: '0.8125rem', cursor: 'pointer',
                  }}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>{'이름'}</label>
            <input type="text" className="form-input" placeholder="이름을 입력하세요"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>{'생년월일'}</label>
            <span className="label-desc">{'양력 기준'}</span>
            <input type="date" className="form-input"
              value={birthDate} onChange={e => setBirthDate(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>{'성별'}</label>
            <div className="gender-buttons">
              <button type="button" className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}>{'남성'}</button>
              <button type="button" className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}>{'여성'}</button>
            </div>
          </div>

          <div className="form-group">
            <label>{'태어난 시간'}</label>
            <span className="label-desc">{'모르면 선택하지 않아도 됩니다'}</span>
            <div className="time-select">
              {BIRTH_TIMES.map(t => (
                <button key={t.value} type="button"
                  className={`time-btn ${birthTime === t.value ? 'active' : ''}`}
                  onClick={() => setBirthTime(birthTime === t.value ? -1 : t.value)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!name.trim() || !birthDate || !gender}>
            {'\uD83D\uDD2E 나의 운세 확인하기'}
          </button>

          {/* 구글 로그인 옵션 */}
          {isConfigured && !user && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
                {'또는'}
              </p>
              <button type="button" onClick={signInWithGoogle} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.5rem', borderRadius: '9999px',
                border: '1px solid var(--color-glass-border)', background: 'var(--color-glass)',
                color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {'Google로 시작하기'}
              </button>
              <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
                {'로그인하면 결과를 저장하고 다시 볼 수 있어요'}
              </p>
            </div>
          )}
        </form>

        {/* 하단 서비스 바로가기 */}
        <section style={{ marginTop: '3rem' }}>
          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginBottom: '1rem' }}>
            {'개별 서비스 바로가기'}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { href: '/horoscope', label: '\u2B50 오늘의운세' },
              { href: '/saju', label: '\uD83C\uDFB4 사주풀이' },
              { href: '/tarot', label: '\uD83C\uDCCF 타로카드' },
              { href: '/dream', label: '\uD83D\uDCAD 꿈해몽' },
            ].map(s => (
              <Link key={s.href} href={s.href} style={{
                padding: '0.5rem 1rem', borderRadius: '9999px',
                border: '1px solid var(--color-glass-border)', background: 'var(--color-glass)',
                color: 'var(--color-text-muted)', fontSize: '0.8125rem', textDecoration: 'none',
              }}>
                {s.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* ── 로딩 ── */
  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-spinner" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="spinner" />
          <span>{result?.name ?? name}{'님의 운세를 분석하고 있습니다...'}</span>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════
     결과 화면 — 모든 운세 한번에
     ══════════════════════════════ */
  const r = result;

  return (
    <div className="home-page">
      {/* ── 프로필 헤더 ── */}
      <section style={{
        textAlign: 'center', padding: '2rem 1.5rem 1.5rem',
        borderRadius: 'var(--radius-lg)', background: 'var(--gradient-card)',
        border: '1px solid var(--color-glass-border)', marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.375rem' }}>{r.zodiac.icon}</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          {r.name}{'님의 오늘의 운세'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          {r.zodiac.name}{' \u00B7 '}{dateStr}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(139,92,246,0.15)', color: 'var(--color-accent)', fontSize: '0.75rem', fontWeight: 600 }}>
            {'\uD83C\uDFB2 '}{r.luckyNumbers.join(', ')}
          </span>
          <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'var(--color-gold-soft)', color: 'var(--color-gold)', fontSize: '0.75rem', fontWeight: 600 }}>
            {'\uD83C\uDF08 '}{r.fortune.luckyColor}
          </span>
          <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', background: r.saju.yinYang === 'yang' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)', color: r.saju.yinYang === 'yang' ? '#f87171' : '#60a5fa', fontSize: '0.75rem', fontWeight: 600 }}>
            {r.saju.yinYang === 'yang' ? '\u2600\uFE0F 양' : '\uD83C\uDF19 음'}{' \u00B7 '}{FIVE_ELEMENTS_NAME[r.saju.dominantElement]}
          </span>
        </div>
        {/* 오늘의 조언 */}
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-gold-soft)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gold)', fontWeight: 600, fontStyle: 'italic' }}>
            {'\uD83D\uDCAB "'}{r.fortune.advice}{'"'}
          </p>
        </div>
      </section>

      {/* ── 1. 별자리 운세 ── */}
      <section style={{
        padding: '1.5rem', borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>{r.zodiac.icon}</span>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>{'오늘의 별자리 운세'}</h2>
          <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--color-gold)' }}>{stars(r.fortune.overall)}</span>
        </div>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          {r.fortune.fortuneText}
        </p>
        {/* 별점 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          {[
            { label: '\u2764\uFE0F 연애', score: r.fortune.love, text: r.fortune.loveText },
            { label: '\uD83D\uDCB0 금전', score: r.fortune.money, text: r.fortune.moneyText },
            { label: '\uD83D\uDC9A 건강', score: r.fortune.health, text: r.fortune.healthText },
            { label: '\uD83C\uDFB2 행운숫자', score: 0, text: String(r.fortune.luckyNumber) },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>{item.label}</div>
              {item.score > 0 ? (
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-gold)' }}>{stars(item.score)}</div>
              ) : (
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-accent)' }}>{item.text}</div>
              )}
            </div>
          ))}
        </div>
        {/* 세부 운세 */}
        <details style={{ marginTop: '0.5rem' }}>
          <summary style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600, padding: '0.5rem 0' }}>
            {'상세 별자리 운세 보기'}
          </summary>
          <div style={{ padding: '0.75rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            <p style={{ marginBottom: '0.75rem' }}><strong style={{ color: 'var(--color-accent)' }}>{'종합운'}</strong>{' \u2014 '}{r.fortune.overallText}</p>
            <p style={{ marginBottom: '0.75rem' }}><strong style={{ color: 'var(--color-accent)' }}>{'연애운'}</strong>{' \u2014 '}{r.fortune.loveText}</p>
            <p style={{ marginBottom: '0.75rem' }}><strong style={{ color: 'var(--color-accent)' }}>{'금전운'}</strong>{' \u2014 '}{r.fortune.moneyText}</p>
            <p><strong style={{ color: 'var(--color-accent)' }}>{'건강운'}</strong>{' \u2014 '}{r.fortune.healthText}</p>
          </div>
        </details>
      </section>

      {/* ── 2. 사주팔자 ── */}
      <section style={{
        padding: '1.5rem', borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)',
        marginBottom: '1rem',
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem' }}>
          {'\uD83C\uDFB4 사주팔자'}
        </h2>
        {/* 4주 */}
        <div className="saju-pillars" style={{ marginBottom: '1rem' }}>
          {([
            { label: '시주', p: r.saju.timePillar, hide: r.birthTime < 0 },
            { label: '일주', p: r.saju.dayPillar, hide: false },
            { label: '월주', p: r.saju.monthPillar, hide: false },
            { label: '연주', p: r.saju.yearPillar, hide: false },
          ] as const).map((item, i) => (
            <div key={i} className="saju-pillar">
              <div className="saju-pillar-label">{item.label}</div>
              <div className="saju-pillar-value">
                {item.hide ? '- -' : `${item.p.stemHanja}${item.p.branchHanja}`}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
                {item.hide ? '미정' : `${item.p.stemKo}${item.p.branchKo}`}
              </div>
            </div>
          ))}
        </div>

        {/* 오행 비율 */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {r.saju.fiveElementPercents.map((pct, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', minWidth: '3.25rem' }}>
              <div style={{ width: '2.25rem', background: 'rgba(255,255,255,0.06)', borderRadius: '0.375rem', overflow: 'hidden', height: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ height: `${Math.max(pct, 5)}%`, background: FIVE_ELEMENTS_COLOR[idx], borderRadius: '0.375rem 0.375rem 0 0', transition: 'height 0.5s', minHeight: '4px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: FIVE_ELEMENTS_COLOR[idx] }}>{FIVE_ELEMENTS_NAME[idx]}</span>
              <span style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)' }}>{pct}{'%'}</span>
            </div>
          ))}
        </div>

        {/* 성격 요약 */}
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          {r.saju.personality}
        </p>

        <details>
          <summary style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600, padding: '0.5rem 0' }}>
            {'상세 사주 분석 보기'}
          </summary>
          <div style={{ padding: '0.75rem 0' }}>
            <div className="saju-section">
              <div className="saju-section-title">{'\uD83D\uDCBC 적성 및 직업'}</div>
              <p className="saju-section-text">{r.saju.career}</p>
            </div>
            <div className="saju-section">
              <div className="saju-section-title">{'\uD83D\uDCB0 재물운'}</div>
              <p className="saju-section-text">{r.saju.wealth}</p>
            </div>
            <div className="saju-section">
              <div className="saju-section-title">{'\u2764\uFE0F 연애운'}</div>
              <p className="saju-section-text">{r.saju.love}</p>
            </div>
            <div className="saju-section">
              <div className="saju-section-title">{'\uD83D\uDC9A 건강운'}</div>
              <p className="saju-section-text">{r.saju.health}</p>
            </div>
            <div className="saju-section" style={{ borderBottom: 'none' }}>
              <div className="saju-section-title">{'\uD83C\uDF1F 올해의 운세'}</div>
              <p className="saju-section-text">{r.saju.yearly}</p>
            </div>
          </div>
        </details>
      </section>

      {/* ── 3. 오늘의 타로 ── */}
      <section style={{
        padding: '1.5rem', borderRadius: 'var(--radius-lg)',
        background: 'var(--gradient-card)', border: '1px solid var(--color-glass-border)',
        textAlign: 'center', marginBottom: '1rem',
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem' }}>
          {'\uD83C\uDCCF 오늘의 타로 1카드'}
        </h2>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.375rem', filter: 'drop-shadow(0 0 16px rgba(251,191,36,0.2))', transform: r.tarot.isReversed ? 'rotate(180deg)' : 'none' }}>
          {r.tarot.card.emoji}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
          {r.tarot.card.nameKo}
        </h3>
        <span style={{
          display: 'inline-block', padding: '0.1875rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600, marginBottom: '0.75rem',
          background: r.tarot.isReversed ? 'rgba(248,113,113,0.15)' : 'rgba(52,211,153,0.15)',
          color: r.tarot.isReversed ? '#f87171' : '#34d399',
        }}>
          {r.tarot.isReversed ? '\u21BB 역방향' : '\u2191 정방향'}
        </span>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
          {r.tarot.isReversed ? r.tarot.card.reversedKeywords : r.tarot.card.uprightKeywords}
        </p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '0.75rem', textAlign: 'left' }}>
          {r.tarot.isReversed ? r.tarot.card.reversedMeaning : r.tarot.card.uprightMeaning}
        </p>
        <details>
          <summary style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600, padding: '0.5rem 0' }}>
            {'연애 · 금전 · 직업 해석 보기'}
          </summary>
          <div style={{ padding: '0.75rem 0', textAlign: 'left', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            <p style={{ marginBottom: '0.75rem' }}><strong style={{ color: 'var(--color-accent)' }}>{'\u2764\uFE0F 연애'}</strong>{' \u2014 '}{r.tarot.isReversed ? r.tarot.card.loveReversed : r.tarot.card.loveUpright}</p>
            <p style={{ marginBottom: '0.75rem' }}><strong style={{ color: 'var(--color-accent)' }}>{'\uD83D\uDCB0 금전'}</strong>{' \u2014 '}{r.tarot.isReversed ? r.tarot.card.moneyReversed : r.tarot.card.moneyUpright}</p>
            <p><strong style={{ color: 'var(--color-accent)' }}>{'\uD83D\uDCBC 직업'}</strong>{' \u2014 '}{r.tarot.isReversed ? r.tarot.card.careerReversed : r.tarot.card.careerUpright}</p>
          </div>
        </details>
        <Link href="/tarot" style={{
          display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 1.25rem', borderRadius: '9999px',
          border: '1px solid var(--color-glass-border)', background: 'var(--color-glass)',
          color: 'var(--color-text-muted)', fontSize: '0.8125rem', textDecoration: 'none',
        }}>
          {'3장 타로 스프레드 해보기 \u2192'}
        </Link>
      </section>

      {/* ── 4. 행운의 로또 번호 ── */}
      <section style={{
        padding: '1.25rem', borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)',
        textAlign: 'center', marginBottom: '1rem',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
          {'\uD83C\uDFB0 오늘의 행운 번호'}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
          {r.luckyNumbers.map((num, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '2.75rem', height: '2.75rem', borderRadius: '50%',
              background: 'var(--gradient-primary)', color: '#fff',
              fontWeight: 800, fontSize: '1rem', boxShadow: '0 2px 8px var(--color-cta-glow)',
            }}>
              {num}
            </span>
          ))}
        </div>
        <p style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)' }}>
          {'* 재미로만 참고하세요. 실제 당첨과는 관련이 없습니다.'}
        </p>
      </section>

      {/* ── 광고 영역 ── */}
      <section style={{
        padding: '1.25rem', borderRadius: '1rem',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(251,191,36,0.08))',
        border: '1px solid var(--color-border)', textAlign: 'center', marginBottom: '1rem',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {'\uD83C\uDF1F 오늘의 행운을 더 높이는 방법'}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginBottom: '0.75rem' }}>
          {'사주에 맞는 행운 아이템과 여행지를 확인해보세요'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          <a href="https://s.click.aliexpress.com/e/_olzd8TL" target="_blank" rel="sponsored nofollow noopener noreferrer" className="button primary" style={{ fontSize: '0.875rem' }}>
            {'\uD83D\uDECD\uFE0F 행운 아이템'}
          </a>
          <a href="https://www.trip.com/t/Ik6QQwDcjT2" target="_blank" rel="sponsored nofollow noopener noreferrer" className="button secondary" style={{ fontSize: '0.875rem' }}>
            {'\u2708\uFE0F 행운의 여행지'}
          </a>
        </div>
        <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
          {'제휴 링크를 통해 구매 시 운세미 운영에 도움이 됩니다'}
        </p>
      </section>

      {/* ── 더 알아보기 + 다시하기 ── */}
      <section style={{ marginBottom: '1rem' }}>
        <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginBottom: '0.75rem' }}>
          {'더 자세히 알아보기'}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { href: '/horoscope', label: '\u2B50 12별자리 전체' },
            { href: '/saju', label: '\uD83C\uDFB4 사주풀이' },
            { href: '/tarot', label: '\uD83C\uDCCF 3장 타로' },
            { href: '/dream', label: '\uD83D\uDCAD 꿈해몽' },
          ].map(s => (
            <Link key={s.href} href={s.href} style={{
              padding: '0.5rem 1rem', borderRadius: '9999px',
              border: '1px solid var(--color-glass-border)', background: 'var(--color-glass)',
              color: 'var(--color-text-muted)', fontSize: '0.8125rem', textDecoration: 'none',
            }}>
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      <button onClick={() => setResult(null)} className="submit-btn">
        {'\uD83D\uDD04 다른 정보로 다시 보기'}
      </button>
    </div>
  );
}
