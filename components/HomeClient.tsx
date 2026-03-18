'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { calculateSaju, FIVE_ELEMENTS_NAME, FIVE_ELEMENTS_COLOR } from '@/lib/saju-engine';
import type { SajuResult } from '@/lib/saju-engine';
import { ZODIAC_SIGNS, getDailySeed, HEAVENLY_STEMS, EARTHLY_BRANCHES } from '@/lib/fortune-data';
import {
  getZodiacSign, getZodiacFortune, hashName, getDailyTarot,
  getLuckyNumbers, BIRTH_TIMES, getHoroscopeSummary, getSajuSummary,
  getTarotSummary, getOverallScore, getElementAdvice,
  getChineseZodiac, getZodiacPersonality, getThreeCardTarot,
  getTimeFortune, getZodiacCompat, getSpreadInterpretation, getActionGuide,
} from '@/lib/fortune-utils';
import { analyzeAdvancedSaju, type AdvancedSajuResult } from '@/lib/saju-advanced';
import ProductAdBanner from '@/components/ads/ProductAdBanner';
import AppDownloadSection from '@/components/AppDownloadSection';

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
  advSaju: AdvancedSajuResult;
  tarot: ReturnType<typeof getDailyTarot>;
  threeCards: ReturnType<typeof getThreeCardTarot>;
  luckyNumbers: number[];
  birthTime: number;
  gender: string;
  chineseZodiac: { name: string; emoji: string };
};

type ViewMode = 'input' | 'select' | 'horoscope' | 'saju' | 'tarot' | 'lucky';

/* ── 메인 컴포넌트 ── */

export default function HomeClient() {
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
      const advSaju = analyzeAdvancedSaju(saju, gender, y, birthTime);
      const ns = hashName(name.trim());
      const seed = getDailySeed() + ns;
      const tarot = getDailyTarot(seed);
      const threeCards = getThreeCardTarot(seed);
      const chineseZodiac = getChineseZodiac(y);

      setResult({
        name: name.trim(), birthYear: y, zodiac, zodiacIndex, fortune, saju, advSaju, tarot, threeCards,
        luckyNumbers: getLuckyNumbers(seed * 7),
        birthTime, gender, chineseZodiac,
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
          <h1>{'무료 운세 \u00B7 사주풀이 \u00B7 타로 \u00B7 꿈해몽'}</h1>
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

        {/* 앱 다운로드 CTA */}
        <AppDownloadSection />

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
  const timeFortune = getTimeFortune(r.fortune.overall);
  const zodiacCompat = getZodiacCompat(r.zodiac.slug);
  const spreadInterpretation = getSpreadInterpretation(r.threeCards, getDailySeed() + hashName(r.name));
  const actionGuide = getActionGuide(getDailySeed() + hashName(r.name));

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

        {/* 시간대별 운세 */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem' }}>{'시간대별 운세'}</h2>
          {[
            { label: '오전', icon: '\u2600\uFE0F', time: '06:00 ~ 12:00', text: timeFortune.morning, color: '#fbbf24' },
            { label: '오후', icon: '\uD83C\uDF24\uFE0F', time: '12:00 ~ 18:00', text: timeFortune.afternoon, color: '#60a5fa' },
            { label: '저녁', icon: '\uD83C\uDF19', time: '18:00 ~ 24:00', text: timeFortune.evening, color: '#a78bfa' },
          ].map((slot, i) => (
            <div key={i} style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '0.5rem', borderLeft: `3px solid ${slot.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                <span>{slot.icon}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>{slot.label}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>{slot.time}</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{slot.text}</p>
            </div>
          ))}
        </section>

        {/* 오늘의 행동 가이드 */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem' }}>{'오늘의 행동 가이드'}</h2>
          {[
            { label: '연애 & 인간관계', icon: '\u2764\uFE0F', text: actionGuide.love, color: '#f472b6' },
            { label: '금전 & 재물', icon: '\uD83D\uDCB0', text: actionGuide.money, color: '#fbbf24' },
            { label: '건강 & 컨디션', icon: '\uD83D\uDC9A', text: actionGuide.health, color: '#34d399' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: item.color, marginBottom: '0.375rem' }}>{item.icon}{' '}{item.label}</div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{item.text}</p>
            </div>
          ))}
        </section>

        {/* 별자리 궁합 */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem' }}>{'별자리 궁합'}</h2>
          {[
            { label: '최고의 궁합', slugs: zodiacCompat.best, color: '#34d399', icon: '\uD83D\uDC95' },
            { label: '좋은 궁합', slugs: zodiacCompat.good, color: '#60a5fa', icon: '\uD83D\uDE0A' },
            { label: '주의할 궁합', slugs: zodiacCompat.caution, color: '#f87171', icon: '\u26A0\uFE0F' },
          ].map((group, i) => (
            <div key={i} style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: group.color, marginBottom: '0.375rem' }}>
                {group.icon}{' '}{group.label}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {group.slugs.map(slug => {
                  const sign = ZODIAC_SIGNS.find(z => z.slug === slug);
                  return sign ? (
                    <span key={slug} style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', background: `${group.color}15`, border: `1px solid ${group.color}30`, fontSize: '0.8125rem', color: group.color }}>
                      {sign.icon}{' '}{sign.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </section>

        {/* 운세 맞춤 상품 추천 */}
        <ProductAdBanner
          context={{ type: 'horoscope', luckyColor: r.fortune.luckyColor, zodiacName: r.zodiac.name }}
          icon={r.fortune.overall >= 4 ? '🌟' : r.fortune.overall >= 3 ? '🔮' : '🍀'}
          title={r.fortune.overall >= 4 ? '좋은 기운을 더 높이세요' : r.fortune.overall >= 3 ? '행운의 아이템으로 운기 상승' : '오늘의 운을 바꿔보세요'}
          desc={`${r.zodiac.name} ${r.fortune.luckyColor} 컬러 아이템이 행운을 가져다줍니다`}
        />

        {backBtn}
      </div>
    );
  }

  /* ── 사주팔자 상세 ── */
  if (view === 'saju') {
    const adv = r.advSaju;
    const qualityColors = { excellent: '#34d399', good: '#60a5fa', neutral: '#a78bfa', caution: '#fbbf24', difficult: '#f87171' };
    const qualityLabels = { excellent: '대길', good: '길', neutral: '보통', caution: '주의', difficult: '흉' };

    return (
      <div className="home-page">
        {backBtn}

        {/* 한줄 요약 */}
        <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(251,191,36,0.1))', border: '1px solid var(--color-glass-border)', marginBottom: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            {'\uD83C\uDFB4 '}{sajuSummary}
          </p>
        </div>

        {/* 기본 정보 */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.375rem' }}>
            {r.name}{'님의 사주팔자'}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
            {r.birthYear}{'년생 · '}{r.chineseZodiac.emoji}{' '}{r.chineseZodiac.name}{'띠 · '}{r.saju.yinYang === 'yang' ? '양(陽)' : '음(陰)'}{' · '}{adv.dayMasterStrength === 'strong' ? '신강' : adv.dayMasterStrength === 'weak' ? '신약' : '중화'}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {adv.dayMasterDesc}
          </p>

          {/* 사주 원국 테이블: 4주 + 십신 + 12운성 */}
          <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-glass-border)' }}>
                  <th style={{ padding: '0.5rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{''}</th>
                  <th style={{ padding: '0.5rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{'시주'}</th>
                  <th style={{ padding: '0.5rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{'일주'}</th>
                  <th style={{ padding: '0.5rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{'월주'}</th>
                  <th style={{ padding: '0.5rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{'연주'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.375rem', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.6875rem' }}>{'십신'}</td>
                  <td style={{ padding: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{r.birthTime < 0 ? '-' : adv.tenGods.time.ko}</td>
                  <td style={{ padding: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-gold)' }}>{'일간(나)'}</td>
                  <td style={{ padding: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{adv.tenGods.month.ko}</td>
                  <td style={{ padding: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{adv.tenGods.year.ko}</td>
                </tr>
                <tr style={{ background: 'var(--color-glass)' }}>
                  <td style={{ padding: '0.5rem', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.6875rem' }}>{'천간'}</td>
                  <td style={{ padding: '0.5rem', fontSize: '1.25rem', fontWeight: 800 }}>{r.birthTime < 0 ? '-' : r.saju.timePillar.stemHanja}</td>
                  <td style={{ padding: '0.5rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gold)' }}>{r.saju.dayPillar.stemHanja}</td>
                  <td style={{ padding: '0.5rem', fontSize: '1.25rem', fontWeight: 800 }}>{r.saju.monthPillar.stemHanja}</td>
                  <td style={{ padding: '0.5rem', fontSize: '1.25rem', fontWeight: 800 }}>{r.saju.yearPillar.stemHanja}</td>
                </tr>
                <tr style={{ background: 'var(--color-glass)' }}>
                  <td style={{ padding: '0.5rem', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.6875rem' }}>{'지지'}</td>
                  <td style={{ padding: '0.5rem', fontSize: '1.25rem', fontWeight: 800 }}>{r.birthTime < 0 ? '-' : r.saju.timePillar.branchHanja}</td>
                  <td style={{ padding: '0.5rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gold)' }}>{r.saju.dayPillar.branchHanja}</td>
                  <td style={{ padding: '0.5rem', fontSize: '1.25rem', fontWeight: 800 }}>{r.saju.monthPillar.branchHanja}</td>
                  <td style={{ padding: '0.5rem', fontSize: '1.25rem', fontWeight: 800 }}>{r.saju.yearPillar.branchHanja}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.375rem', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.6875rem' }}>{'12운성'}</td>
                  <td style={{ padding: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{r.birthTime < 0 ? '-' : adv.twelveStages.time.ko}</td>
                  <td style={{ padding: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{adv.twelveStages.day.ko}</td>
                  <td style={{ padding: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{adv.twelveStages.month.ko}</td>
                  <td style={{ padding: '0.375rem', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{adv.twelveStages.year.ko}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 오행 분석 */}
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

          {/* 용신 */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: `linear-gradient(135deg, ${adv.yongshin.color}15, ${adv.yongshin.color}08)`, border: `1px solid ${adv.yongshin.color}30`, marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.5rem', color: adv.yongshin.color }}>
              {'용신(用神): '}{adv.yongshin.elementName}{'('}{adv.yongshin.elementHanja}{') · 방위: '}{adv.yongshin.direction}
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              {adv.yongshin.description}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', lineHeight: 1.5 }}>
              {'\uD83D\uDCA1 보충법: '}{adv.yongshin.supplement}
            </p>
          </div>

          {/* 신살 */}
          {adv.sinsal.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--color-text)' }}>{'신살(神煞) 분석'}</div>
              {adv.sinsal.map((s, i) => (
                <div key={i} style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '0.5rem', borderLeft: `3px solid ${s.type === 'good' ? '#34d399' : s.type === 'bad' ? '#f87171' : '#a78bfa'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)' }}>{s.name}</span>
                    <span style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)' }}>{'('}{s.hanja}{')'}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.625rem', padding: '0.125rem 0.375rem', borderRadius: '9999px', fontWeight: 600, background: s.type === 'good' ? 'rgba(52,211,153,0.15)' : s.type === 'bad' ? 'rgba(248,113,113,0.15)' : 'rgba(167,139,250,0.15)', color: s.type === 'good' ? '#34d399' : s.type === 'bad' ? '#f87171' : '#a78bfa' }}>
                      {s.type === 'good' ? '길신' : s.type === 'bad' ? '흉신' : '중립'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{s.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* 형충파합해 */}
          {adv.interactions.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--color-text)' }}>{'형충파합해(刑沖破合害)'}</div>
              {adv.interactions.map((it, i) => (
                <div key={i} style={{ padding: '0.625rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: it.isGood ? '#34d399' : '#f87171', minWidth: '1.5rem', textAlign: 'center' }}>{it.type}</span>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>{it.branch1Ko}{'('}{it.pillar1}{')'}{' ↔ '}{it.branch2Ko}{'('}{it.pillar2}{')'}</span>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginTop: '0.125rem' }}>{it.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 분야별 상세 분석 */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem' }}>{'분야별 상세 분석'}</h2>

          <div className="saju-section">
            <div className="saju-section-title">{'\uD83E\uDDD1 성격 분석'}</div>
            <p className="saju-section-text">{r.saju.personality}</p>
          </div>
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
          <div className="saju-section" style={{ borderBottom: 'none' }}>
            <div className="saju-section-title">{'\uD83D\uDC9A 건강운'}</div>
            <p className="saju-section-text">{r.saju.health}</p>
          </div>
        </section>

        {/* 대운 타임라인 */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.25rem' }}>{'대운(大運) — 인생의 10년 주기'}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '1rem' }}>{'10년 단위로 바뀌는 운의 흐름입니다'}</p>

          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {adv.daeun.map((d, i) => {
              const currentAge = new Date().getFullYear() - r.birthYear;
              const isCurrent = currentAge >= d.startAge && currentAge < d.startAge + 10;
              return (
                <div key={i} style={{ minWidth: '5.5rem', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-sm)', background: isCurrent ? 'rgba(139,92,246,0.15)' : 'var(--color-glass)', border: isCurrent ? '2px solid var(--color-accent)' : '1px solid transparent', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.625rem', color: isCurrent ? 'var(--color-accent)' : 'var(--color-text-dim)', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {d.startAge}{'~'}{d.startAge + 9}{'세'}
                    {isCurrent && ' (현재)'}
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.125rem' }}>{d.stemHanja}{d.branchHanja}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)' }}>{d.stemKo}{d.branchKo}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.25rem' }}>{d.tenGod.ko}</div>
                  <div style={{ fontSize: '0.5625rem', color: 'var(--color-text-dim)' }}>{d.twelveStage.ko}</div>
                </div>
              );
            })}
          </div>

          {/* 현재 대운 해석 */}
          {(() => {
            const currentAge = new Date().getFullYear() - r.birthYear;
            const current = adv.daeun.find(d => currentAge >= d.startAge && currentAge < d.startAge + 10);
            if (!current) return null;
            return (
              <div style={{ marginTop: '1rem', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.375rem' }}>
                  {'현재 대운: '}{current.stemHanja}{current.branchHanja}{' ('}{current.tenGod.ko}{' · '}{current.twelveStage.ko}{')'}
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{current.interpretation}</p>
              </div>
            );
          })()}
        </section>

        {/* 세운 (향후 5년) */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.25rem' }}>{'세운(歲運) — 향후 5년 전망'}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '1rem' }}>{'매년 바뀌는 운의 흐름을 미리 살펴보세요'}</p>

          {adv.seun.map((s, i) => (
            <div key={i} style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '0.5rem', borderLeft: `3px solid ${qualityColors[s.quality]}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text)' }}>{s.year}{'년'}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>{s.stemHanja}{s.branchHanja}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>{'('}{s.tenGod.ko}{')'}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.625rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: 700, background: `${qualityColors[s.quality]}20`, color: qualityColors[s.quality] }}>
                  {qualityLabels[s.quality]}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{s.summary}</p>
            </div>
          ))}
        </section>

        {/* 올해 운세 */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.75rem' }}>{'\uD83C\uDF1F '}{today.getFullYear()}{'년 운세'}</h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: 1.8 }}>{r.saju.yearly}</p>
        </section>

        {/* 오행 보충 조언 */}
        <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-gold-soft)', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.375rem' }}>{'오행 조화 조언'}</div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-gold)', lineHeight: 1.6 }}>
            {'\u2705 '}{elementAdvice.good}<br/>
            {'\u26A0\uFE0F '}{elementAdvice.avoid}<br/>
            {'\uD83D\uDCA1 '}{elementAdvice.tip}
          </p>
        </div>

        {/* 사주 맞춤 상품 추천 */}
        <ProductAdBanner
          context={{ type: 'saju', dominantElement: r.saju.dominantElement, weakElement: r.saju.weakElement }}
          icon="🎴"
          title={`${FIVE_ELEMENTS_NAME[r.saju.dominantElement]}의 기운을 보완하세요`}
          desc={`사주 분석 결과, ${FIVE_ELEMENTS_NAME[r.saju.weakElement]} 기운 보충이 필요합니다. 맞춤 아이템으로 균형을 찾아보세요.`}
        />

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

          {/* 3카드 종합 해석 */}
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.5rem' }}>{'종합 해석'}</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>{spreadInterpretation}</p>
          </div>

          {/* 각 카드 상세 의미 */}
          <div style={{ marginTop: '1rem' }}>
            {r.threeCards.map((tc, i) => (
              <div key={i} style={{ padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '0.5rem', borderLeft: `3px solid ${['#a78bfa', '#fbbf24', '#34d399'][i]}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                  <span>{tc.card.emoji}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {tc.label}{' — '}{tc.card.nameKo}
                  </span>
                  <span style={{ fontSize: '0.625rem', color: tc.isReversed ? '#f87171' : '#34d399', fontWeight: 600 }}>
                    {tc.isReversed ? '역방향' : '정방향'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  {tc.isReversed ? tc.card.reversedMeaning : tc.card.uprightMeaning}
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

        {/* 오늘의 타로 행동 조언 */}
        <section style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem' }}>{'카드가 전하는 오늘의 메시지'}</h2>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#34d399', marginBottom: '0.375rem' }}>{'해야 할 것'}</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
              {r.tarot.isReversed
                ? '오늘은 한 발짝 물러서서 상황을 관찰하세요. 성급한 판단보다 인내가 더 좋은 결과를 가져옵니다.'
                : '오늘의 에너지를 적극적으로 활용하세요. 망설이던 일에 첫 걸음을 내딛기에 좋은 날입니다.'}
            </p>
          </div>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f87171', marginBottom: '0.375rem' }}>{'피해야 할 것'}</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
              {r.tarot.isReversed
                ? '무리한 계획이나 약속은 피하세요. 에너지를 분산시키기보다 하나에 집중하는 것이 중요합니다.'
                : '자만하거나 타인의 의견을 무시하지 마세요. 겸손한 태도가 더 큰 성공을 이끕니다.'}
            </p>
          </div>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-gold-soft)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-gold)', marginBottom: '0.375rem' }}>{'핵심 키워드'}</div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gold)', textAlign: 'center' }}>
              {(r.tarot.isReversed ? r.tarot.card.reversedKeywords : r.tarot.card.uprightKeywords).split(', ').slice(0, 3).join(' · ')}
            </p>
          </div>
        </section>

        {/* 타로 맞춤 상품 추천 */}
        <ProductAdBanner
          context={{ type: 'tarot', tarotCardName: r.tarot.card.nameKo, luckyColor: r.fortune.luckyColor }}
          icon={r.tarot.card.emoji}
          title={`${r.tarot.card.nameKo}의 에너지를 일상에 담아보세요`}
          desc="오늘의 타로가 알려주는 행운 아이템을 만나보세요"
        />

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

        {/* 행운 부스터 상품 추천 */}
        <ProductAdBanner
          context={{ type: 'lucky', luckyColor: r.fortune.luckyColor, zodiacName: r.zodiac.name }}
          icon="🍀"
          title="행운의 번호, 행운의 아이템과 함께"
          desc={`${r.fortune.luckyColor} 컬러 아이템과 함께하면 행운이 배가됩니다`}
        />

        {backBtn}
      </div>
    );
  }

  return null;
}
