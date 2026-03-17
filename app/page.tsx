'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { calculateSaju, FIVE_ELEMENTS_NAME, FIVE_ELEMENTS_COLOR } from '@/lib/saju-engine';
import type { SajuResult } from '@/lib/saju-engine';
import { ZODIAC_SIGNS, getDailySeed } from '@/lib/fortune-data';
import {
  getZodiacSign, getZodiacFortune, hashName, getDailyTarot,
  getLuckyNumbers, BIRTH_TIMES, getHoroscopeSummary, getSajuSummary,
  getTarotSummary, getOverallScore, getElementAdvice,
  getChineseZodiac, getZodiacPersonality, getThreeCardTarot,
} from '@/lib/fortune-utils';

function stars(n: number) {
  return '\u2B50'.repeat(n) + '\u2606'.repeat(5 - n);
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

/* ── 타입 ── */

type FullResult = {
  name: string;
  birthYear: number;
  zodiac: typeof ZODIAC_SIGNS[number];
  zodiacIndex: number;
  fortune: ReturnType<typeof getZodiacFortune>;
  saju: SajuResult;
  tarot: ReturnType<typeof getDailyTarot>;
  threeCards: ReturnType<typeof getThreeCardTarot>;
  luckyNumbers: number[];
  birthTime: number;
  chineseZodiac: { name: string; emoji: string };
};

type ViewMode = 'input' | 'select' | 'horoscope' | 'saju' | 'tarot' | 'lucky';

/* ── 메인 컴포넌트 ── */

export default function HomePage() {
  const { user, signInWithGoogle, signOutUser, isConfigured } = useAuth();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [birthTime, setBirthTime] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FullResult | null>(null);
  const [view, setView] = useState<ViewMode>('input');

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
      const seed = getDailySeed() + ns;
      const tarot = getDailyTarot(seed);
      const threeCards = getThreeCardTarot(seed);
      const chineseZodiac = getChineseZodiac(y);

      setResult({
        name: name.trim(), birthYear: y, zodiac, zodiacIndex, fortune, saju, tarot, threeCards,
        luckyNumbers: getLuckyNumbers(seed * 7),
        birthTime, chineseZodiac,
      });
      setLoading(false);
      setView('select');

      // 프로필 저장
      try {
        const p = { name: name.trim(), birthDate, gender, birthTime };
        const list = [p, ...saved.filter(s => s.name !== p.name)].slice(0, 5);
        localStorage.setItem('unse_profiles', JSON.stringify(list));
      } catch { /* */ }
    }, 1200);
  }

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  /* ═══════════════════════════════
     STEP 1: 정보 입력
     ═══════════════════════════════ */
  if (view === 'input' || !result) {
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
            {'별자리 운세 · 사주팔자 · 타로카드 · 행운번호를 분석합니다'}
          </p>
        </section>

        {/* Google 로그인 상태 */}
        {isConfigured && user && (
          <div style={{ textAlign: 'center', margin: '1rem 0', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', border: '1px solid var(--color-glass-border)' }}>
            <span style={{ fontSize: '0.875rem' }}>
              {user.photoURL && <img src={user.photoURL} alt="" style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', verticalAlign: 'middle', marginRight: '0.375rem' }} />}
              {user.displayName ?? user.email}{' 님 환영합니다'}
            </span>
            <button onClick={signOutUser} style={{ marginLeft: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', border: '1px solid var(--color-glass-border)', background: 'transparent', color: 'var(--color-text-dim)', fontSize: '0.6875rem', cursor: 'pointer' }}>
              {'로그아웃'}
            </button>
          </div>
        )}

        <form className="saju-form" onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
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

          <button type="submit" className="submit-btn" disabled={!name.trim() || !birthDate || !gender || loading}>
            {loading ? '\u23F3 분석 중...' : '\uD83D\uDD2E 나의 운세 분석하기'}
          </button>

          {/* 구글 로그인 옵션 */}
          {isConfigured && !user && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
                {'결과를 저장하고 싶다면'}
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
                {'Google로 로그인'}
              </button>
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
          <span>{name}{'님의 운세를 분석하고 있습니다...'}</span>
        </div>
      </div>
    );
  }

  const r = result;
  const overallScore = getOverallScore(r.fortune);
  const horoscopeSummary = getHoroscopeSummary(r.name, r.fortune.overall, getDailySeed());
  const sajuSummary = getSajuSummary(r.saju.dominantElement);
  const tarotSummary = getTarotSummary(r.tarot.card.nameKo, r.tarot.isReversed, r.tarot.card.uprightKeywords, r.tarot.card.reversedKeywords);
  const elementAdvice = getElementAdvice(r.saju.dominantElement);
  const zodiacPersonality = getZodiacPersonality(r.zodiac.slug);

  /* ═══════════════════════════════
     STEP 2: 서비스 선택
     ═══════════════════════════════ */
  if (view === 'select') {
    return (
      <div className="home-page">
        {/* 프로필 요약 */}
        <section style={{
          textAlign: 'center', padding: '2rem 1.5rem 1.5rem',
          borderRadius: 'var(--radius-lg)', background: 'var(--gradient-card)',
          border: '1px solid var(--color-glass-border)', marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>{r.zodiac.icon}</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {r.name}{'님'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            {r.zodiac.name}{' · '}{r.chineseZodiac.emoji}{' '}{r.chineseZodiac.name}{'띠 · '}{dateStr}
          </p>

          {/* 종합 점수 */}
          <div style={{ margin: '1rem auto', maxWidth: '200px' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 0.5rem' }}>
              <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-accent)" strokeWidth="10"
                  strokeDasharray={`${overallScore * 3.14} ${314 - overallScore * 3.14}`}
                  strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-accent)' }}>{overallScore}</span>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)' }}>{'종합운'}</span>
              </div>
            </div>
          </div>

          {/* 한줄 요약 */}
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-gold-soft)', marginTop: '0.75rem' }}>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-gold)', fontWeight: 600, fontStyle: 'italic' }}>
              {'\uD83D\uDCAB "'}{r.fortune.advice}{'"'}
            </p>
          </div>

          {/* 태그들 */}
          <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            <span style={{ padding: '0.1875rem 0.625rem', borderRadius: '9999px', background: 'rgba(139,92,246,0.15)', color: 'var(--color-accent)', fontSize: '0.6875rem', fontWeight: 600 }}>
              {'\uD83C\uDFB2 '}{r.luckyNumbers.join(', ')}
            </span>
            <span style={{ padding: '0.1875rem 0.625rem', borderRadius: '9999px', background: 'var(--color-gold-soft)', color: 'var(--color-gold)', fontSize: '0.6875rem', fontWeight: 600 }}>
              {'\uD83C\uDF08 '}{r.fortune.luckyColor}
            </span>
            <span style={{ padding: '0.1875rem 0.625rem', borderRadius: '9999px', background: r.saju.yinYang === 'yang' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)', color: r.saju.yinYang === 'yang' ? '#f87171' : '#60a5fa', fontSize: '0.6875rem', fontWeight: 600 }}>
              {r.saju.yinYang === 'yang' ? '\u2600\uFE0F 양' : '\uD83C\uDF19 음'}{' · '}{FIVE_ELEMENTS_NAME[r.saju.dominantElement]}
            </span>
          </div>
        </section>

        {/* 서비스 선택 카드 */}
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
          {'어떤 운세를 확인하시겠어요?'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {/* 별자리 운세 */}
          <button onClick={() => setView('horoscope')} style={{
            padding: '1.25rem 1rem', borderRadius: 'var(--radius-lg)',
            background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)',
            cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s, transform 0.2s',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{r.zodiac.icon}</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{'별자리 운세'}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
              {r.zodiac.name}{' · '}{stars(r.fortune.overall)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontStyle: 'italic', lineHeight: 1.4 }}>
              {horoscopeSummary}
            </div>
          </button>

          {/* 사주팔자 */}
          <button onClick={() => setView('saju')} style={{
            padding: '1.25rem 1rem', borderRadius: 'var(--radius-lg)',
            background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)',
            cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s, transform 0.2s',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{'\uD83C\uDFB4'}</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{'사주팔자'}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
              {r.saju.dayPillar.stemHanja}{r.saju.dayPillar.branchHanja}{'일주 · '}{FIVE_ELEMENTS_NAME[r.saju.dominantElement]}{'기운'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontStyle: 'italic', lineHeight: 1.4 }}>
              {sajuSummary}
            </div>
          </button>

          {/* 타로카드 */}
          <button onClick={() => setView('tarot')} style={{
            padding: '1.25rem 1rem', borderRadius: 'var(--radius-lg)',
            background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)',
            cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s, transform 0.2s',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{r.tarot.card.emoji}</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{'타로카드'}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
              {r.tarot.card.nameKo}{' · '}{r.tarot.isReversed ? '역방향' : '정방향'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontStyle: 'italic', lineHeight: 1.4 }}>
              {tarotSummary.length > 50 ? tarotSummary.slice(0, 47) + '...' : tarotSummary}
            </div>
          </button>

          {/* 행운번호 */}
          <button onClick={() => setView('lucky')} style={{
            padding: '1.25rem 1rem', borderRadius: 'var(--radius-lg)',
            background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)',
            cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s, transform 0.2s',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{'\uD83C\uDFB0'}</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{'행운의 번호'}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
              {'오늘의 럭키넘버 6개'}
            </div>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {r.luckyNumbers.map((num, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '1.625rem', height: '1.625rem', borderRadius: '50%',
                  background: 'var(--gradient-primary)', color: '#fff',
                  fontWeight: 700, fontSize: '0.6875rem',
                }}>
                  {num}
                </span>
              ))}
            </div>
          </button>
        </div>

        {/* 하단 링크 */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Link href="/dream" style={{
            padding: '0.5rem 1rem', borderRadius: '9999px',
            border: '1px solid var(--color-glass-border)', background: 'var(--color-glass)',
            color: 'var(--color-text-muted)', fontSize: '0.8125rem', textDecoration: 'none',
          }}>
            {'\uD83D\uDCAD 꿈해몽'}
          </Link>
          <Link href="/horoscope" style={{
            padding: '0.5rem 1rem', borderRadius: '9999px',
            border: '1px solid var(--color-glass-border)', background: 'var(--color-glass)',
            color: 'var(--color-text-muted)', fontSize: '0.8125rem', textDecoration: 'none',
          }}>
            {'\u2B50 12별자리 전체보기'}
          </Link>
        </div>

        <button onClick={() => { setResult(null); setView('input'); }} className="submit-btn" style={{ background: 'transparent', border: '1px solid var(--color-glass-border)', color: 'var(--color-text-muted)' }}>
          {'\uD83D\uDD04 다른 정보로 다시 보기'}
        </button>
      </div>
    );
  }

  /* ═══════════════════════════════
     STEP 3: 상세 결과
     ═══════════════════════════════ */

  const backBtn = (
    <button onClick={() => setView('select')} style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
      padding: '0.5rem 1rem', borderRadius: '9999px', marginBottom: '1.25rem',
      border: '1px solid var(--color-glass-border)', background: 'var(--color-glass)',
      color: 'var(--color-text-muted)', fontSize: '0.8125rem', cursor: 'pointer',
    }}>
      {'\u2190 다른 운세 보기'}
    </button>
  );

  /* ── 별자리 운세 상세 ── */
  if (view === 'horoscope') {
    return (
      <div className="home-page">
        {backBtn}

        {/* 한줄 요약 */}
        <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(251,191,36,0.1))', border: '1px solid var(--color-glass-border)', marginBottom: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            {'\uD83D\uDCAB '}{horoscopeSummary}
          </p>
        </div>

        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '2.5rem' }}>{r.zodiac.icon}</span>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{r.name}{'님의 '}{r.zodiac.name}{' 운세'}</h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)' }}>{r.zodiac.dateRange}{' · '}{r.zodiac.element}{' 원소 · '}{dateStr}</p>
            </div>
          </div>

          {/* 별자리 성격 */}
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '0.375rem' }}>{'\uD83D\uDD2E '}{r.zodiac.name}{' 성격'}</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{zodiacPersonality}</p>
          </div>

          {/* 종합 운세 */}
          <p style={{ fontSize: '1rem', color: 'var(--color-text)', lineHeight: 1.8, marginBottom: '1.25rem', fontWeight: 500 }}>
            {r.fortune.fortuneText}
          </p>

          {/* 별점 상세 */}
          <div style={{ display: 'grid', gap: '0.875rem', marginBottom: '1.25rem' }}>
            {[
              { label: '\u2B50 종합운', score: r.fortune.overall, text: r.fortune.overallText, color: '#a78bfa' },
              { label: '\u2764\uFE0F 연애운', score: r.fortune.love, text: r.fortune.loveText, color: '#f472b6' },
              { label: '\uD83D\uDCB0 금전운', score: r.fortune.money, text: r.fortune.moneyText, color: '#fbbf24' },
              { label: '\uD83D\uDC9A 건강운', score: r.fortune.health, text: r.fortune.healthText, color: '#34d399' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>{item.label}</span>
                  <span style={{ fontSize: '0.8125rem', color: item.color }}>{stars(item.score)}</span>
                </div>
                {scoreBar(item.score, item.color)}
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginTop: '0.625rem' }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* 오늘의 조언 */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-gold-soft)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>{'오늘의 조언'}</div>
            <p style={{ fontSize: '1rem', color: 'var(--color-gold)', fontWeight: 700, fontStyle: 'italic' }}>
              {'"'}{r.fortune.advice}{'"'}
            </p>
          </div>

          {/* 행운 정보 */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            <span style={{ padding: '0.375rem 0.75rem', borderRadius: '9999px', background: 'var(--color-gold-soft)', color: 'var(--color-gold)', fontSize: '0.8125rem', fontWeight: 600 }}>
              {'행운의 색 : '}{r.fortune.luckyColor}
            </span>
            <span style={{ padding: '0.375rem 0.75rem', borderRadius: '9999px', background: 'rgba(139,92,246,0.15)', color: 'var(--color-accent)', fontSize: '0.8125rem', fontWeight: 600 }}>
              {'행운의 수 : '}{r.fortune.luckyNumber}
            </span>
          </div>
        </section>

        {/* 광고 */}
        <section style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(251,191,36,0.06))', border: '1px solid var(--color-border)', textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>{'오늘의 행운을 더 높이는 방법'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            <a href="https://s.click.aliexpress.com/e/_olzd8TL" target="_blank" rel="sponsored nofollow noopener noreferrer" className="button primary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
              {'\uD83D\uDECD\uFE0F 행운 아이템'}
            </a>
            <a href="https://www.trip.com/t/Ik6QQwDcjT2" target="_blank" rel="sponsored nofollow noopener noreferrer" className="button secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
              {'\u2708\uFE0F 행운의 여행지'}
            </a>
          </div>
          <p style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', marginTop: '0.375rem' }}>{'제휴 링크입니다'}</p>
        </section>

        {backBtn}
      </div>
    );
  }

  /* ── 사주팔자 상세 ── */
  if (view === 'saju') {
    return (
      <div className="home-page">
        {backBtn}

        {/* 한줄 요약 */}
        <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(251,191,36,0.1))', border: '1px solid var(--color-glass-border)', marginBottom: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            {'\uD83C\uDFB4 '}{sajuSummary}
          </p>
        </div>

        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.375rem' }}>
            {r.name}{'님의 사주팔자'}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginBottom: '1.25rem' }}>
            {r.birthYear}{'년생 · '}{r.chineseZodiac.emoji}{' '}{r.chineseZodiac.name}{'띠 · '}{r.saju.yinYang === 'yang' ? '양(陽)' : '음(陰)'}{' · '}{FIVE_ELEMENTS_NAME[r.saju.dominantElement]}{'('}
            {(['木','火','土','金','水'])[r.saju.dominantElement]}{')'}{' 기운 우세'}
          </p>

          {/* 4주 */}
          <div className="saju-pillars" style={{ marginBottom: '1.25rem' }}>
            {([
              { label: '시주(時柱)', desc: '말년운', p: r.saju.timePillar, hide: r.birthTime < 0 },
              { label: '일주(日柱)', desc: '본인', p: r.saju.dayPillar, hide: false },
              { label: '월주(月柱)', desc: '청년운', p: r.saju.monthPillar, hide: false },
              { label: '연주(年柱)', desc: '초년운', p: r.saju.yearPillar, hide: false },
            ] as const).map((item, i) => (
              <div key={i} className="saju-pillar" style={{ padding: '0.75rem 0.5rem' }}>
                <div className="saju-pillar-label">{item.label}</div>
                <div className="saju-pillar-value" style={{ fontSize: '1.5rem' }}>
                  {item.hide ? '- -' : `${item.p.stemHanja}${item.p.branchHanja}`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
                  {item.hide ? '미정' : `${item.p.stemKo}${item.p.branchKo}`}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--color-accent)', marginTop: '0.25rem' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          {/* 오행 비율 */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text)' }}>{'오행(五行) 분석'}</div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {r.saju.fiveElementPercents.map((pct, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', minWidth: '3.5rem' }}>
                  <div style={{ width: '2.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: '0.375rem', overflow: 'hidden', height: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div style={{ height: `${Math.max(pct, 5)}%`, background: FIVE_ELEMENTS_COLOR[idx], borderRadius: '0.375rem 0.375rem 0 0', transition: 'height 0.5s', minHeight: '4px' }} />
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: FIVE_ELEMENTS_COLOR[idx] }}>{FIVE_ELEMENTS_NAME[idx]}</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>{pct}{'%'}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', textAlign: 'center' }}>
              {'주요 기운: '}<strong style={{ color: FIVE_ELEMENTS_COLOR[r.saju.dominantElement] }}>{FIVE_ELEMENTS_NAME[r.saju.dominantElement]}</strong>
              {' · 보완 필요: '}<strong style={{ color: FIVE_ELEMENTS_COLOR[r.saju.weakElement] }}>{FIVE_ELEMENTS_NAME[r.saju.weakElement]}</strong>
            </p>
          </div>

          {/* 오행 궁합 조언 */}
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-gold-soft)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.375rem' }}>{'오행 궁합 조언'}</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-gold)', lineHeight: 1.6 }}>
              {'\u2705 '}{elementAdvice.good}<br/>
              {'\u26A0\uFE0F '}{elementAdvice.avoid}<br/>
              {'\uD83D\uDCA1 '}{elementAdvice.tip}
            </p>
          </div>

          {/* 성격 */}
          <div className="saju-section">
            <div className="saju-section-title">{'\uD83E\uDDD1 성격 분석'}</div>
            <p className="saju-section-text">{r.saju.personality}</p>
          </div>

          {/* 직업 */}
          <div className="saju-section">
            <div className="saju-section-title">{'\uD83D\uDCBC 적성 및 직업'}</div>
            <p className="saju-section-text">{r.saju.career}</p>
          </div>

          {/* 재물운 */}
          <div className="saju-section">
            <div className="saju-section-title">{'\uD83D\uDCB0 재물운'}</div>
            <p className="saju-section-text">{r.saju.wealth}</p>
          </div>

          {/* 연애운 */}
          <div className="saju-section">
            <div className="saju-section-title">{'\u2764\uFE0F 연애운'}</div>
            <p className="saju-section-text">{r.saju.love}</p>
          </div>

          {/* 건강운 */}
          <div className="saju-section">
            <div className="saju-section-title">{'\uD83D\uDC9A 건강운'}</div>
            <p className="saju-section-text">{r.saju.health}</p>
          </div>

          {/* 올해의 운세 */}
          <div className="saju-section" style={{ borderBottom: 'none' }}>
            <div className="saju-section-title">{'\uD83C\uDF1F '}{today.getFullYear()}{'년 운세'}</div>
            <p className="saju-section-text">{r.saju.yearly}</p>
          </div>
        </section>

        {backBtn}
      </div>
    );
  }

  /* ── 타로카드 상세 ── */
  if (view === 'tarot') {
    return (
      <div className="home-page">
        {backBtn}

        {/* 한줄 요약 */}
        <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(251,191,36,0.1))', border: '1px solid var(--color-glass-border)', marginBottom: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            {'\uD83C\uDCCF '}{tarotSummary}
          </p>
        </div>

        {/* 1카드 리딩 */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-card)', border: '1px solid var(--color-glass-border)', textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            {r.name}{'님의 오늘의 타로'}
          </h1>

          <div style={{ fontSize: '4rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.2))', transform: r.tarot.isReversed ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>
            {r.tarot.card.emoji}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
            {r.tarot.card.nameKo}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>{r.tarot.card.name}</p>
          <span style={{
            display: 'inline-block', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem',
            background: r.tarot.isReversed ? 'rgba(248,113,113,0.15)' : 'rgba(52,211,153,0.15)',
            color: r.tarot.isReversed ? '#f87171' : '#34d399',
          }}>
            {r.tarot.isReversed ? '\u21BB 역방향 (Reversed)' : '\u2191 정방향 (Upright)'}
          </span>

          {/* 키워드 */}
          <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {(r.tarot.isReversed ? r.tarot.card.reversedKeywords : r.tarot.card.uprightKeywords).split(', ').map((kw, i) => (
              <span key={i} style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', background: 'var(--color-glass)', border: '1px solid var(--color-glass-border)', fontSize: '0.75rem', color: 'var(--color-accent)' }}>
                {kw}
              </span>
            ))}
          </div>

          {/* 의미 해석 */}
          <p style={{ fontSize: '1rem', color: 'var(--color-text)', lineHeight: 1.8, marginBottom: '1.25rem', textAlign: 'left', fontWeight: 500 }}>
            {r.tarot.isReversed ? r.tarot.card.reversedMeaning : r.tarot.card.uprightMeaning}
          </p>

          {/* 분야별 해석 */}
          <div style={{ textAlign: 'left' }}>
            {[
              { label: '\u2764\uFE0F 연애', text: r.tarot.isReversed ? r.tarot.card.loveReversed : r.tarot.card.loveUpright },
              { label: '\uD83D\uDCB0 금전', text: r.tarot.isReversed ? r.tarot.card.moneyReversed : r.tarot.card.moneyUpright },
              { label: '\uD83D\uDCBC 직업', text: r.tarot.isReversed ? r.tarot.card.careerReversed : r.tarot.card.careerUpright },
            ].map((item, i) => (
              <div key={i} style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '0.625rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.375rem' }}>{item.label}</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3카드 스프레드 */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.25rem', textAlign: 'center' }}>
            {'3카드 스프레드'}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textAlign: 'center', marginBottom: '1.25rem' }}>
            {'과거 · 현재 · 미래의 흐름을 읽어봅니다'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {r.threeCards.map((tc, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0.875rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '0.375rem', fontWeight: 600 }}>{tc.label}</div>
                <div style={{ fontSize: '2rem', marginBottom: '0.25rem', transform: tc.isReversed ? 'rotate(180deg)' : 'none' }}>
                  {tc.card.emoji}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.125rem' }}>{tc.card.nameKo}</div>
                <div style={{ fontSize: '0.625rem', color: tc.isReversed ? '#f87171' : '#34d399', fontWeight: 600 }}>
                  {tc.isReversed ? '역방향' : '정방향'}
                </div>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', lineHeight: 1.5, marginTop: '0.375rem' }}>
                  {(tc.isReversed ? tc.card.reversedKeywords : tc.card.uprightKeywords).split(', ').slice(0, 2).join(', ')}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link href="/tarot" style={{
              display: 'inline-block', padding: '0.5rem 1.25rem', borderRadius: '9999px',
              border: '1px solid var(--color-glass-border)', background: 'var(--color-glass)',
              color: 'var(--color-text-muted)', fontSize: '0.8125rem', textDecoration: 'none',
            }}>
              {'직접 타로 카드 뽑기 \u2192'}
            </Link>
          </div>
        </section>

        {backBtn}
      </div>
    );
  }

  /* ── 행운의 번호 상세 ── */
  if (view === 'lucky') {
    return (
      <div className="home-page">
        {backBtn}

        <section style={{ padding: '2rem 1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-card)', border: '1px solid var(--color-glass-border)', textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {r.name}{'님의 오늘의 행운 번호'}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>
            {dateStr}{' · '}{r.zodiac.name}{' · '}{FIVE_ELEMENTS_NAME[r.saju.dominantElement]}{'('}
            {(['木','火','土','金','水'])[r.saju.dominantElement]}{') 기반 산출'}
          </p>

          {/* 메인 번호 */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {r.luckyNumbers.map((num, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '3.5rem', height: '3.5rem', borderRadius: '50%',
                  background: 'var(--gradient-primary)', color: '#fff',
                  fontWeight: 800, fontSize: '1.25rem', boxShadow: '0 4px 12px var(--color-cta-glow)',
                }}>
                  {num}
                </span>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)' }}>{i + 1}{'번째'}</span>
              </div>
            ))}
          </div>

          {/* 추가 럭키 정보 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem', textAlign: 'left' }}>
            <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>{'행운의 색'}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gold)' }}>{'\uD83C\uDF08 '}{r.fortune.luckyColor}</div>
            </div>
            <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>{'행운의 수'}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-accent)' }}>{'\u2B50 '}{r.fortune.luckyNumber}</div>
            </div>
            <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>{'띠'}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>{r.chineseZodiac.emoji}{' '}{r.chineseZodiac.name}{'띠'}</div>
            </div>
            <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>{'오행'}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: FIVE_ELEMENTS_COLOR[r.saju.dominantElement] }}>{FIVE_ELEMENTS_NAME[r.saju.dominantElement]}{'('}
                {(['木','火','土','金','水'])[r.saju.dominantElement]}{')'}
              </div>
            </div>
          </div>

          {/* 팁 */}
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-gold-soft)' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-gold)', lineHeight: 1.6 }}>
              {'\uD83D\uDCA1 '}{elementAdvice.tip}
            </p>
          </div>

          <p style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', marginTop: '1rem' }}>
            {'* 재미로만 참고하세요. 실제 당첨과는 관련이 없습니다.'}
          </p>
        </section>

        {/* 광고 */}
        <section style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(251,191,36,0.06))', border: '1px solid var(--color-border)', textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{'\uD83C\uDF1F 행운을 높이는 아이템'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            <a href="https://s.click.aliexpress.com/e/_olzd8TL" target="_blank" rel="sponsored nofollow noopener noreferrer" className="button primary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
              {'\uD83D\uDECD\uFE0F 행운 아이템'}
            </a>
            <a href="https://www.trip.com/t/Ik6QQwDcjT2" target="_blank" rel="sponsored nofollow noopener noreferrer" className="button secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
              {'\u2708\uFE0F 행운의 여행지'}
            </a>
          </div>
          <p style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', marginTop: '0.375rem' }}>{'제휴 링크입니다'}</p>
        </section>

        {backBtn}
      </div>
    );
  }

  return null;
}
