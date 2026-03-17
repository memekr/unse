'use client';

import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { calculateSaju, FIVE_ELEMENTS_KO, FIVE_ELEMENTS_NAME, FIVE_ELEMENTS_COLOR } from '@/lib/saju-engine';
import type { SajuResult } from '@/lib/saju-engine';
import {
  ZODIAC_SIGNS, FORTUNE_MESSAGES, OVERALL_FORTUNES,
  LOVE_FORTUNES, MONEY_FORTUNES, HEALTH_FORTUNES,
  DAILY_ADVICE, LUCKY_COLORS, getDailySeed, seededRandom,
  MAJOR_ARCANA,
} from '@/lib/fortune-data';

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

// 생년월일로 별자리 찾기
function getZodiacSign(month: number, day: number) {
  const dates = [
    { month: 3, day: 21, sign: 0 },   // 양자리
    { month: 4, day: 20, sign: 1 },   // 황소자리
    { month: 5, day: 21, sign: 2 },   // 쌍둥이자리
    { month: 6, day: 22, sign: 3 },   // 게자리
    { month: 7, day: 23, sign: 4 },   // 사자자리
    { month: 8, day: 23, sign: 5 },   // 처녀자리
    { month: 9, day: 23, sign: 6 },   // 천칭자리
    { month: 10, day: 23, sign: 7 },  // 전갈자리
    { month: 11, day: 22, sign: 8 },  // 사수자리
    { month: 12, day: 22, sign: 9 },  // 염소자리
    { month: 1, day: 20, sign: 10 },  // 물병자리
    { month: 2, day: 19, sign: 11 },  // 물고기자리
  ];

  for (let i = 0; i < dates.length; i++) {
    const curr = dates[i];
    const next = dates[(i + 1) % dates.length];
    if (month === curr.month && day >= curr.day) return ZODIAC_SIGNS[curr.sign];
    if (month === next.month && day < next.day) return ZODIAC_SIGNS[curr.sign];
  }
  return ZODIAC_SIGNS[9]; // 염소자리 기본값
}

// 별자리 운세 생성
function getZodiacFortune(signIndex: number) {
  const seed = getDailySeed();
  const signRng = seededRandom(seed + signIndex * 777 + signIndex * signIndex * 13);

  const overall = Math.floor(signRng() * 5) + 1;
  const love = Math.floor(signRng() * 5) + 1;
  const money = Math.floor(signRng() * 5) + 1;
  const health = Math.floor(signRng() * 5) + 1;

  const fortuneIdx = Math.floor(signRng() * FORTUNE_MESSAGES.length);
  const overallIdx = Math.floor(signRng() * OVERALL_FORTUNES.length);
  const loveIdx = Math.floor(signRng() * LOVE_FORTUNES.length);
  const moneyIdx = Math.floor(signRng() * MONEY_FORTUNES.length);
  const healthIdx = Math.floor(signRng() * HEALTH_FORTUNES.length);
  const adviceIdx = Math.floor(signRng() * DAILY_ADVICE.length);
  const colorIdx = Math.floor(signRng() * LUCKY_COLORS.length);
  const luckyNum = Math.floor(signRng() * 45) + 1;

  return {
    overall, love, money, health,
    fortuneText: FORTUNE_MESSAGES[fortuneIdx],
    overallText: OVERALL_FORTUNES[overallIdx],
    loveText: LOVE_FORTUNES[loveIdx],
    moneyText: MONEY_FORTUNES[moneyIdx],
    healthText: HEALTH_FORTUNES[healthIdx],
    advice: DAILY_ADVICE[adviceIdx],
    luckyColor: LUCKY_COLORS[colorIdx],
    luckyNumber: luckyNum,
  };
}

// 오늘의 타로 1카드
function getDailyTarot(nameSeed: number) {
  const seed = getDailySeed() + nameSeed;
  const rng = seededRandom(seed * 31);
  const idx = Math.floor(rng() * MAJOR_ARCANA.length);
  const card = MAJOR_ARCANA[idx];
  const isReversed = rng() > 0.5;
  return { card, isReversed };
}

// 이름 해시
function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function renderStars(count: number): string {
  return '⭐'.repeat(count) + '☆'.repeat(5 - count);
}

type MyResult = {
  name: string;
  zodiacSign: typeof ZODIAC_SIGNS[number];
  zodiacFortune: ReturnType<typeof getZodiacFortune>;
  saju: SajuResult;
  tarot: ReturnType<typeof getDailyTarot>;
  luckyNumbers: number[];
};

export default function MyPage() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [birthTime, setBirthTime] = useState<number>(-1);
  const [result, setResult] = useState<MyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'saju' | 'horoscope' | 'tarot'>('overview');

  // 저장된 결과 복원 시도
  const [savedProfiles, setSavedProfiles] = useState<Array<{ name: string; birthDate: string; gender: string; birthTime: number }>>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('unse_profiles');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !birthDate || !gender) return;

    setLoading(true);
    setTimeout(() => {
      const date = new Date(birthDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      // 별자리 찾기
      const zodiacSign = getZodiacSign(month, day);
      const signIndex = ZODIAC_SIGNS.indexOf(zodiacSign);
      const zodiacFortune = getZodiacFortune(signIndex);

      // 사주 분석
      const saju = calculateSaju(year, month, day, birthTime, gender);

      // 오늘의 타로
      const nameSeed = hashName(name.trim());
      const tarot = getDailyTarot(nameSeed);

      // 행운의 번호 6개
      const seed = getDailySeed() + nameSeed;
      const lrng = seededRandom(seed * 7);
      const nums = new Set<number>();
      while (nums.size < 6) {
        nums.add(Math.floor(lrng() * 45) + 1);
      }
      const luckyNumbers = Array.from(nums).sort((a, b) => a - b);

      setResult({
        name: name.trim(),
        zodiacSign,
        zodiacFortune,
        saju,
        tarot,
        luckyNumbers,
      });
      setActiveTab('overview');
      setLoading(false);

      // 프로필 로컬 저장
      try {
        const profile = { name: name.trim(), birthDate, gender, birthTime };
        const existing = savedProfiles.filter(p => p.name !== name.trim());
        const updated = [profile, ...existing].slice(0, 5);
        setSavedProfiles(updated);
        localStorage.setItem('unse_profiles', JSON.stringify(updated));
      } catch { /* ignore */ }
    }, 1200);
  }

  function loadProfile(profile: { name: string; birthDate: string; gender: string; birthTime: number }) {
    setName(profile.name);
    setBirthDate(profile.birthDate);
    setGender(profile.gender);
    setBirthTime(profile.birthTime);
  }

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div>
      <div className="page-header">
        <div className="page-icon">{'🔮'}</div>
        <h1>{'나만의 운세'}</h1>
        <p>{'이름과 생년월일을 입력하면 모든 운세를 한번에 확인할 수 있어요'}</p>
      </div>

      {/* 입력 폼 */}
      <form className="saju-form" onSubmit={handleSubmit}>
        {/* 저장된 프로필 */}
        {savedProfiles.length > 0 && !result && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem', display: 'block' }}>
              {'최근 조회'}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {savedProfiles.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => loadProfile(p)}
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-glass-border)',
                    background: 'var(--color-glass)',
                    color: 'var(--color-text)',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>{'이름'}</label>
          <input
            type="text"
            className="form-input"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <button type="submit" className="submit-btn" disabled={!name.trim() || !birthDate || !gender}>
          {'🔮 나의 운세 확인하기'}
        </button>
      </form>

      {/* 로딩 */}
      {loading && (
        <div className="loading-spinner">
          <span className="spinner" />
          <span>
            {name}{'님의 운세를 분석하고 있습니다...'}
          </span>
        </div>
      )}

      {/* 결과 */}
      {result && !loading && (
        <div style={{ marginTop: '2rem' }}>
          {/* 사용자 프로필 헤더 */}
          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--gradient-card)',
            border: '1px solid var(--color-glass-border)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{result.zodiacSign.icon}</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
              {result.name}{'님의 운세'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              {result.zodiacSign.name}{' · '}{dateStr}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{
                padding: '0.25rem 0.75rem', borderRadius: '9999px',
                background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-accent)',
                fontSize: '0.75rem', fontWeight: 600,
              }}>
                {'🎲 행운번호: '}{result.luckyNumbers.join(', ')}
              </span>
              <span style={{
                padding: '0.25rem 0.75rem', borderRadius: '9999px',
                background: 'var(--color-gold-soft)', color: 'var(--color-gold)',
                fontSize: '0.75rem', fontWeight: 600,
              }}>
                {'🌈 '}{result.zodiacFortune.luckyColor}
              </span>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div style={{
            display: 'flex', gap: '0.5rem', marginBottom: '1.5rem',
            overflowX: 'auto', padding: '0.25rem 0',
          }}>
            {([
              { key: 'overview', label: '📋 종합', },
              { key: 'horoscope', label: '⭐ 별자리' },
              { key: 'saju', label: '🎴 사주' },
              { key: 'tarot', label: '🃏 타로' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: activeTab === tab.key ? '1px solid var(--color-cta)' : '1px solid var(--color-glass-border)',
                  background: activeTab === tab.key ? 'rgba(139, 92, 246, 0.15)' : 'var(--color-glass)',
                  color: activeTab === tab.key ? 'var(--color-text)' : 'var(--color-text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* === 종합 탭 === */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {/* 오늘의 운세 요약 */}
              <div style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-glass-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{result.zodiacSign.icon}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                    {'오늘의 별자리 운세'}
                  </h3>
                  <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--color-gold)' }}>
                    {renderStars(result.zodiacFortune.overall)}
                  </span>
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                  {result.zodiacFortune.fortuneText}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)' }}>
                    {'❤️ 연애 '}{renderStars(result.zodiacFortune.love)}
                  </div>
                  <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)' }}>
                    {'💰 금전 '}{renderStars(result.zodiacFortune.money)}
                  </div>
                  <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)' }}>
                    {'💚 건강 '}{renderStars(result.zodiacFortune.health)}
                  </div>
                  <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)' }}>
                    {'🔢 행운숫자 '}{result.zodiacFortune.luckyNumber}
                  </div>
                </div>
              </div>

              {/* 사주 요약 */}
              <div style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-glass-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{'🎴'}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                    {'사주팔자 요약'}
                  </h3>
                  <span style={{
                    marginLeft: 'auto',
                    padding: '0.1875rem 0.5rem', borderRadius: '9999px',
                    fontSize: '0.6875rem', fontWeight: 600,
                    background: result.saju.yinYang === 'yang' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: result.saju.yinYang === 'yang' ? '#f87171' : '#60a5fa',
                  }}>
                    {result.saju.yinYang === 'yang' ? '☀️ 양' : '🌙 음'}
                    {' · '}{FIVE_ELEMENTS_NAME[result.saju.dominantElement]}
                  </span>
                </div>
                {/* 미니 사주 4주 */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  {[
                    { label: '연주', p: result.saju.yearPillar },
                    { label: '월주', p: result.saju.monthPillar },
                    { label: '일주', p: result.saju.dayPillar },
                    { label: '시주', p: result.saju.timePillar },
                  ].map((item, i) => (
                    <div key={i} style={{
                      textAlign: 'center', padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)', background: 'var(--color-glass)',
                      minWidth: '3.5rem',
                    }}>
                      <div style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-gold)' }}>
                        {i === 3 && birthTime < 0 ? '- -' : `${item.p.stemHanja}${item.p.branchHanja}`}
                      </div>
                      <div style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)' }}>
                        {i === 3 && birthTime < 0 ? '미정' : `${item.p.stemKo}${item.p.branchKo}`}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  {result.saju.personality.slice(0, 100)}{'...'}
                </p>
                <button
                  onClick={() => setActiveTab('saju')}
                  style={{
                    marginTop: '0.75rem', width: '100%', padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-glass-border)',
                    background: 'var(--color-glass)', color: 'var(--color-accent)',
                    fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {'상세 사주 분석 보기 →'}
                </button>
              </div>

              {/* 타로 요약 */}
              <div style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--gradient-card)',
                border: '1px solid var(--color-glass-border)',
                textAlign: 'center',
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
                  {'오늘의 타로 1카드'}
                </h3>
                <div style={{ fontSize: '3rem', marginBottom: '0.375rem' }}>
                  {result.tarot.card.emoji}
                </div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
                  {result.tarot.card.nameKo}
                </h4>
                <span style={{
                  display: 'inline-block',
                  padding: '0.1875rem 0.5rem', borderRadius: '9999px',
                  fontSize: '0.6875rem', fontWeight: 600,
                  background: result.tarot.isReversed ? 'rgba(248, 113, 113, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                  color: result.tarot.isReversed ? '#f87171' : '#34d399',
                  marginBottom: '0.5rem',
                }}>
                  {result.tarot.isReversed ? '↻ 역방향' : '↑ 정방향'}
                </span>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', marginBottom: '0.375rem' }}>
                  {result.tarot.isReversed ? result.tarot.card.reversedKeywords : result.tarot.card.uprightKeywords}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  {result.tarot.isReversed ? result.tarot.card.reversedMeaning : result.tarot.card.uprightMeaning}
                </p>
              </div>

              {/* 오늘의 조언 */}
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-gold-soft)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-gold)', fontWeight: 600, fontStyle: 'italic' }}>
                  {'💫 "'}
                  {result.zodiacFortune.advice}
                  {'"'}
                </p>
              </div>

              {/* 행운의 로또 번호 */}
              <div style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-glass-border)',
                textAlign: 'center',
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
                  {'🎰 오늘의 행운 번호'}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  {result.luckyNumbers.map((num, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                      background: 'var(--gradient-primary)', color: '#fff',
                      fontWeight: 800, fontSize: '0.9375rem',
                      boxShadow: '0 2px 8px var(--color-cta-glow)',
                    }}>
                      {num}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)' }}>
                  {'* 재미로만 참고하세요'}
                </p>
              </div>
            </div>
          )}

          {/* === 별자리 탭 === */}
          {activeTab === 'horoscope' && (
            <div style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-glass-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2.5rem' }}>{result.zodiacSign.icon}</span>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                    {result.zodiacSign.name}
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)' }}>
                    {result.zodiacSign.dateRange}
                  </p>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--color-gold)' }}>
                  {renderStars(result.zodiacFortune.overall)}
                </span>
              </div>

              <div className="saju-section">
                <div className="saju-section-title">{'📊 종합운'}</div>
                <p className="saju-section-text">{result.zodiacFortune.overallText}</p>
              </div>
              <div className="saju-section">
                <div className="saju-section-title">{'❤️ 연애운'}</div>
                <p className="saju-section-text">{result.zodiacFortune.loveText}</p>
              </div>
              <div className="saju-section">
                <div className="saju-section-title">{'💰 금전운'}</div>
                <p className="saju-section-text">{result.zodiacFortune.moneyText}</p>
              </div>
              <div className="saju-section" style={{ borderBottom: 'none' }}>
                <div className="saju-section-title">{'💚 건강운'}</div>
                <p className="saju-section-text">{result.zodiacFortune.healthText}</p>
              </div>

              <div style={{
                marginTop: '1rem', padding: '0.75rem',
                borderRadius: 'var(--radius-sm)', background: 'var(--color-gold-soft)',
                textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-gold)', fontWeight: 600,
              }}>
                {'🌈 행운의 색: '}{result.zodiacFortune.luckyColor}
                {' | 🎲 행운의 숫자: '}{result.zodiacFortune.luckyNumber}
              </div>

              <Link href="/horoscope" className="button secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                {'12별자리 전체 운세 보기'}
              </Link>
            </div>
          )}

          {/* === 사주 탭 === */}
          {activeTab === 'saju' && (
            <div className="result-panel">
              <h2>{'🎴 '}{result.name}{'님의 사주팔자'}</h2>

              {/* 사주 4주 */}
              <div className="saju-pillars">
                {[
                  { label: '시주', p: result.saju.timePillar, hide: birthTime < 0 },
                  { label: '일주', p: result.saju.dayPillar },
                  { label: '월주', p: result.saju.monthPillar },
                  { label: '연주', p: result.saju.yearPillar },
                ].map((item, i) => (
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

              {/* 음양 + 오행 */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span style={{
                  display: 'inline-block', padding: '0.375rem 1rem', borderRadius: '9999px',
                  background: result.saju.yinYang === 'yang' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  color: result.saju.yinYang === 'yang' ? '#f87171' : '#60a5fa',
                  fontWeight: 700, fontSize: '0.875rem',
                }}>
                  {result.saju.yinYang === 'yang' ? '☀️ 양(陽)' : '🌙 음(陰)'}
                  {' | 주요 오행: '}{FIVE_ELEMENTS_NAME[result.saju.dominantElement]}
                  {'('}{FIVE_ELEMENTS_KO[result.saju.dominantElement]}{')'}
                </span>
              </div>

              {/* 오행 비율 차트 */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.75rem', textAlign: 'center' }}>
                  {'오행 비율 분석'}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {result.saju.fiveElementPercents.map((pct, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', minWidth: '3.5rem' }}>
                      <div style={{ width: '2.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: '0.375rem', overflow: 'hidden', height: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <div style={{ height: `${Math.max(pct, 5)}%`, background: FIVE_ELEMENTS_COLOR[idx], borderRadius: '0.375rem 0.375rem 0 0', transition: 'height 0.5s ease', minHeight: '4px' }} />
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: FIVE_ELEMENTS_COLOR[idx] }}>
                        {FIVE_ELEMENTS_NAME[idx]}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>{pct}{'%'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 해석 */}
              <div className="saju-section">
                <div className="saju-section-title">{'🔮 성격 분석'}</div>
                <p className="saju-section-text">{result.saju.personality}</p>
              </div>
              <div className="saju-section">
                <div className="saju-section-title">{'💼 적성 및 직업'}</div>
                <p className="saju-section-text">{result.saju.career}</p>
              </div>
              <div className="saju-section">
                <div className="saju-section-title">{'💰 재물운'}</div>
                <p className="saju-section-text">{result.saju.wealth}</p>
              </div>
              <div className="saju-section">
                <div className="saju-section-title">{'❤️ 연애운'}</div>
                <p className="saju-section-text">{result.saju.love}</p>
              </div>
              <div className="saju-section">
                <div className="saju-section-title">{'💚 건강운'}</div>
                <p className="saju-section-text">{result.saju.health}</p>
              </div>
              <div className="saju-section" style={{ borderBottom: 'none' }}>
                <div className="saju-section-title">{'🌟 올해의 운세'}</div>
                <p className="saju-section-text">{result.saju.yearly}</p>
              </div>
            </div>
          )}

          {/* === 타로 탭 === */}
          {activeTab === 'tarot' && (
            <div style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-card)',
              border: '1px solid var(--color-glass-border)',
              textAlign: 'center',
            }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '1rem' }}>
                {result.name}{'님의 오늘의 타로'}
              </h2>
              <div style={{
                fontSize: '4rem', marginBottom: '0.5rem',
                filter: 'drop-shadow(0 0 16px rgba(251, 191, 36, 0.2))',
                transform: result.tarot.isReversed ? 'rotate(180deg)' : 'none',
              }}>
                {result.tarot.card.emoji}
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
                {result.tarot.card.nameKo}
              </h3>
              <span style={{
                display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px',
                fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem',
                background: result.tarot.isReversed ? 'rgba(248, 113, 113, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                color: result.tarot.isReversed ? '#f87171' : '#34d399',
              }}>
                {result.tarot.isReversed ? '↻ 역방향' : '↑ 정방향'}
              </span>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
                {result.tarot.isReversed ? result.tarot.card.reversedKeywords : result.tarot.card.uprightKeywords}
              </p>

              <div style={{ textAlign: 'left' }}>
                <div className="saju-section">
                  <div className="saju-section-title">{'🌟 전체 해석'}</div>
                  <p className="saju-section-text">
                    {result.tarot.isReversed ? result.tarot.card.reversedMeaning : result.tarot.card.uprightMeaning}
                  </p>
                </div>
                <div className="saju-section">
                  <div className="saju-section-title">{'❤️ 연애'}</div>
                  <p className="saju-section-text">
                    {result.tarot.isReversed ? result.tarot.card.loveReversed : result.tarot.card.loveUpright}
                  </p>
                </div>
                <div className="saju-section">
                  <div className="saju-section-title">{'💰 금전'}</div>
                  <p className="saju-section-text">
                    {result.tarot.isReversed ? result.tarot.card.moneyReversed : result.tarot.card.moneyUpright}
                  </p>
                </div>
                <div className="saju-section" style={{ borderBottom: 'none' }}>
                  <div className="saju-section-title">{'💼 직업'}</div>
                  <p className="saju-section-text">
                    {result.tarot.isReversed ? result.tarot.card.careerReversed : result.tarot.card.careerUpright}
                  </p>
                </div>
              </div>

              <Link href="/tarot" className="button secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                {'3장 타로 스프레드 해보기'}
              </Link>
            </div>
          )}

          {/* 다시하기 버튼 */}
          <button
            onClick={() => { setResult(null); setActiveTab('overview'); }}
            className="submit-btn"
            style={{ marginTop: '1.5rem' }}
          >
            {'🔄 다른 정보로 다시 보기'}
          </button>
        </div>
      )}
    </div>
  );
}
