'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { calculateSaju, FIVE_ELEMENTS_NAME, FIVE_ELEMENTS_COLOR } from '@/lib/saju-engine';
import { getZodiacSign, getZodiacCompat, getChineseZodiac, getElementAdvice } from '@/lib/fortune-utils';
import { seededRandom } from '@/lib/fortune-data';
import ProductAdBanner from '@/components/ads/ProductAdBanner';

/* ── 띠 궁합 테이블 ── */
const ZODIAC_ANIMAL_COMPAT: Record<string, { best: string[]; good: string[]; caution: string[] }> = {
  '\uC950': { best: ['\uC6A9', '\uC6D0\uC22D\uC774'], good: ['\uC18C', '\uB3FC\uC9C0'], caution: ['\uB9D0', '\uD1A0\uB07C'] },
  '\uC18C': { best: ['\uB2ED', '\uBC40'], good: ['\uC950', '\uC591'], caution: ['\uB9D0', '\uC591'] },
  '\uD638\uB791\uC774': { best: ['\uB9D0', '\uAC1C'], good: ['\uB3FC\uC9C0', '\uC950'], caution: ['\uC6D0\uC22D\uC774', '\uBC40'] },
  '\uD1A0\uB07C': { best: ['\uC591', '\uAC1C'], good: ['\uB3FC\uC9C0', '\uC950'], caution: ['\uC6A9', '\uB2ED'] },
  '\uC6A9': { best: ['\uC950', '\uC6D0\uC22D\uC774'], good: ['\uBC40', '\uB2ED'], caution: ['\uAC1C', '\uD1A0\uB07C'] },
  '\uBC40': { best: ['\uC18C', '\uB2ED'], good: ['\uC6A9', '\uC6D0\uC22D\uC774'], caution: ['\uD638\uB791\uC774', '\uB3FC\uC9C0'] },
  '\uB9D0': { best: ['\uD638\uB791\uC774', '\uC591'], good: ['\uAC1C', '\uC6A9'], caution: ['\uC950', '\uC18C'] },
  '\uC591': { best: ['\uB9D0', '\uD1A0\uB07C'], good: ['\uB3FC\uC9C0', '\uC6D0\uC22D\uC774'], caution: ['\uC18C', '\uAC1C'] },
  '\uC6D0\uC22D\uC774': { best: ['\uC6A9', '\uC950'], good: ['\uBC40', '\uC591'], caution: ['\uD638\uB791\uC774', '\uB3FC\uC9C0'] },
  '\uB2ED': { best: ['\uC18C', '\uBC40'], good: ['\uC6A9', '\uAC1C'], caution: ['\uD1A0\uB07C', '\uB3FC\uC9C0'] },
  '\uAC1C': { best: ['\uD638\uB791\uC774', '\uD1A0\uB07C'], good: ['\uB9D0', '\uB2ED'], caution: ['\uC6A9', '\uC591'] },
  '\uB3FC\uC9C0': { best: ['\uC950', '\uC591'], good: ['\uD638\uB791\uC774', '\uD1A0\uB07C'], caution: ['\uBC40', '\uC6D0\uC22D\uC774'] },
};

/* ── 오행 상생/상극 관계 ── */
const ELEMENT_RELATION: Record<string, Record<string, 'generate' | 'control' | 'same'>> = {
  '\uBAA9': { '\uBAA9': 'same', '\uD654': 'generate', '\uD1A0': 'control', '\uAE08': 'control', '\uC218': 'generate' },
  '\uD654': { '\uBAA9': 'generate', '\uD654': 'same', '\uD1A0': 'generate', '\uAE08': 'control', '\uC218': 'control' },
  '\uD1A0': { '\uBAA9': 'control', '\uD654': 'generate', '\uD1A0': 'same', '\uAE08': 'generate', '\uC218': 'control' },
  '\uAE08': { '\uBAA9': 'control', '\uD654': 'control', '\uD1A0': 'generate', '\uAE08': 'same', '\uC218': 'generate' },
  '\uC218': { '\uBAA9': 'generate', '\uD654': 'control', '\uD1A0': 'control', '\uAE08': 'generate', '\uC218': 'same' },
};

const ELEMENT_NAMES_SHORT = ['\uBAA9', '\uD654', '\uD1A0', '\uAE08', '\uC218']; // 木火土金水

type CompatResult = {
  totalScore: number;
  ohangScore: number;
  zodiacScore: number;
  animalScore: number;
  ohangAnalysis: string;
  zodiacAnalysis: string;
  animalAnalysis: string;
  advice: string;
  person1Zodiac: { name: string; icon: string; slug: string };
  person2Zodiac: { name: string; icon: string; slug: string };
  person1Animal: { name: string; emoji: string };
  person2Animal: { name: string; emoji: string };
  person1Element: string;
  person2Element: string;
};

function analyzeCompatibility(
  birth1: string, gender1: string,
  birth2: string, gender2: string,
): CompatResult {
  const d1 = new Date(birth1);
  const d2 = new Date(birth2);
  const y1 = d1.getFullYear(), m1 = d1.getMonth() + 1, day1 = d1.getDate();
  const y2 = d2.getFullYear(), m2 = d2.getMonth() + 1, day2 = d2.getDate();

  // Saju for both
  const saju1 = calculateSaju(y1, m1, day1, -1, gender1);
  const saju2 = calculateSaju(y2, m2, day2, -1, gender2);

  // Zodiac signs
  const zodiac1 = getZodiacSign(m1, day1);
  const zodiac2 = getZodiacSign(m2, day2);

  // Chinese zodiac (띠)
  const animal1 = getChineseZodiac(y1);
  const animal2 = getChineseZodiac(y2);

  // Element advice
  const elem1 = FIVE_ELEMENTS_NAME[saju1.dominantElement];
  const elem2 = FIVE_ELEMENTS_NAME[saju2.dominantElement];
  const elemShort1 = ELEMENT_NAMES_SHORT[saju1.dominantElement];
  const elemShort2 = ELEMENT_NAMES_SHORT[saju2.dominantElement];

  // 1) 오행 궁합 점수 (0-100)
  const rel = ELEMENT_RELATION[elemShort1]?.[elemShort2] ?? 'same';
  let ohangScore: number;
  let ohangAnalysis: string;
  if (rel === 'generate') {
    ohangScore = 90;
    ohangAnalysis = `${elem1}(${elemShort1})과 ${elem2}(${elemShort2})은 상생 관계입니다. 서로에게 에너지를 주고받으며 함께 성장할 수 있는 최고의 조합입니다. 한 쪽이 지치면 다른 쪽이 힘을 불어넣어줍니다.`;
  } else if (rel === 'same') {
    ohangScore = 75;
    ohangAnalysis = `두 분 모두 ${elem1}(${elemShort1})의 기운이 강합니다. 같은 오행이라 서로를 잘 이해하지만, 비슷한 성향 때문에 충돌할 수도 있습니다. 서로의 다른 점을 인정하는 것이 관계 발전의 열쇠입니다.`;
  } else {
    ohangScore = 55;
    ohangAnalysis = `${elem1}(${elemShort1})과 ${elem2}(${elemShort2})은 상극 관계입니다. 서로 다른 에너지가 긴장을 만들 수 있지만, 이 긴장이 오히려 서로를 발전시키는 원동력이 됩니다. 상대방의 장점을 배우려는 자세가 중요합니다.`;
  }

  // Add seeded variation
  const seed = y1 * 10000 + m1 * 100 + day1 + y2 * 10000 + m2 * 100 + day2;
  const rng = seededRandom(seed);
  ohangScore = Math.min(100, Math.max(30, ohangScore + Math.floor(rng() * 16) - 8));

  // 2) 별자리 궁합 점수
  const zodiacCompat = getZodiacCompat(zodiac1.slug);
  let zodiacScore: number;
  let zodiacAnalysis: string;
  if (zodiacCompat.best.includes(zodiac2.slug)) {
    zodiacScore = 95;
    zodiacAnalysis = `${zodiac1.name}과 ${zodiac2.name}은 천생연분의 별자리 궁합입니다! 서로의 장점을 극대화하고 단점을 보완해주는 환상적인 조합입니다.`;
  } else if (zodiacCompat.good.includes(zodiac2.slug)) {
    zodiacScore = 78;
    zodiacAnalysis = `${zodiac1.name}과 ${zodiac2.name}은 좋은 별자리 궁합입니다. 서로 다른 매력에 끌리며, 함께 있을 때 즐거운 시간을 보낼 수 있습니다.`;
  } else if (zodiacCompat.caution.includes(zodiac2.slug)) {
    zodiacScore = 48;
    zodiacAnalysis = `${zodiac1.name}과 ${zodiac2.name}은 약간의 주의가 필요한 별자리 궁합입니다. 서로의 차이를 이해하고 존중하면 좋은 관계를 유지할 수 있습니다.`;
  } else {
    zodiacScore = 65;
    zodiacAnalysis = `${zodiac1.name}과 ${zodiac2.name}은 무난한 별자리 궁합입니다. 특별한 갈등 없이 자연스러운 관계를 이어갈 수 있습니다.`;
  }
  zodiacScore = Math.min(100, Math.max(30, zodiacScore + Math.floor(rng() * 12) - 6));

  // 3) 띠 궁합 점수
  const animalCompat = ZODIAC_ANIMAL_COMPAT[animal1.name];
  let animalScore: number;
  let animalAnalysis: string;
  if (animalCompat?.best.includes(animal2.name)) {
    animalScore = 92;
    animalAnalysis = `${animal1.emoji}${animal1.name}띠와 ${animal2.emoji}${animal2.name}띠는 최고의 띠 궁합입니다! 서로를 자연스럽게 이끌고 보완하는 관계로, 함께하면 큰 시너지를 발휘합니다.`;
  } else if (animalCompat?.good.includes(animal2.name)) {
    animalScore = 76;
    animalAnalysis = `${animal1.emoji}${animal1.name}띠와 ${animal2.emoji}${animal2.name}띠는 좋은 띠 궁합입니다. 서로에게 긍정적인 영향을 주며 안정적인 관계를 유지할 수 있습니다.`;
  } else if (animalCompat?.caution.includes(animal2.name)) {
    animalScore = 45;
    animalAnalysis = `${animal1.emoji}${animal1.name}띠와 ${animal2.emoji}${animal2.name}띠는 주의가 필요한 띠 궁합입니다. 성격 차이로 갈등이 생길 수 있지만, 서로를 이해하려는 노력이 관계를 더욱 깊게 만들어줍니다.`;
  } else {
    animalScore = 62;
    animalAnalysis = `${animal1.emoji}${animal1.name}띠와 ${animal2.emoji}${animal2.name}띠는 보통의 띠 궁합입니다. 큰 충돌 없이 편안한 관계를 유지할 수 있습니다.`;
  }
  animalScore = Math.min(100, Math.max(30, animalScore + Math.floor(rng() * 12) - 6));

  // 총합 점수
  const totalScore = Math.round(ohangScore * 0.4 + zodiacScore * 0.3 + animalScore * 0.3);

  // 종합 조언
  const advicePool = [
    totalScore >= 80
      ? '두 분은 매우 높은 궁합을 가지고 있습니다. 서로에 대한 신뢰를 바탕으로 아름다운 관계를 이어가세요. 가끔 사소한 갈등이 생기더라도 대화로 쉽게 해결할 수 있습니다.'
      : totalScore >= 60
        ? '두 분은 서로를 보완해주는 좋은 궁합입니다. 각자의 장점을 인정하고, 다른 점을 이해하려 노력하면 더욱 깊은 관계로 발전할 수 있습니다.'
        : '두 분은 다소 차이가 있는 궁합이지만, 그만큼 배울 점도 많습니다. 서로의 다름을 존중하고, 열린 대화를 통해 관계를 발전시켜 나가세요. 어려움을 함께 극복할 때 더 강한 유대감이 형성됩니다.',
  ];

  return {
    totalScore,
    ohangScore,
    zodiacScore,
    animalScore,
    ohangAnalysis,
    zodiacAnalysis,
    animalAnalysis,
    advice: advicePool[0],
    person1Zodiac: zodiac1,
    person2Zodiac: zodiac2,
    person1Animal: animal1,
    person2Animal: animal2,
    person1Element: elem1,
    person2Element: elem2,
  };
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{label}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color }}>{score}{'점'}</span>
      </div>
      <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          width: `${score}%`,
          height: '100%',
          background: color,
          borderRadius: '4px',
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );
}

export default function CompatibilityClient() {
  const [birth1, setBirth1] = useState('');
  const [gender1, setGender1] = useState('');
  const [birth2, setBirth2] = useState('');
  const [gender2, setGender2] = useState('');
  const [result, setResult] = useState<CompatResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!birth1 || !gender1 || !birth2 || !gender2) return;
    setLoading(true);
    setTimeout(() => {
      const r = analyzeCompatibility(birth1, gender1, birth2, gender2);
      setResult(r);
      setLoading(false);
    }, 400);
  }

  function getScoreEmoji(score: number) {
    if (score >= 90) return '\uD83D\uDC96';
    if (score >= 75) return '\uD83D\uDC95';
    if (score >= 60) return '\uD83D\uDE0A';
    if (score >= 45) return '\uD83E\uDD14';
    return '\uD83D\uDCAA';
  }

  function getScoreLabel(score: number) {
    if (score >= 90) return '\uCC9C\uC0DD\uC5F0\uBD84';
    if (score >= 75) return '\uC88B\uC740 \uAD81\uD569';
    if (score >= 60) return '\uBB34\uB09C\uD55C \uAD81\uD569';
    if (score >= 45) return '\uB178\uB825 \uD544\uC694';
    return '\uC11C\uB85C \uBC30\uC6B0\uB294 \uC0AC\uC774';
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-icon">{'\uD83D\uDC95'}</div>
        <h1>{'궁합 보기 - 생년월일 궁합 무료'}</h1>
        <p>{'두 사람의 생년월일을 입력하고 궁합을 확인하세요'}</p>
      </div>

      <form className="saju-form" onSubmit={handleSubmit}>
        {/* 첫 번째 사람 */}
        <div style={{
          padding: '1rem',
          borderRadius: '0.75rem',
          background: 'rgba(139, 92, 246, 0.06)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          marginBottom: '1rem',
        }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-accent, #a78bfa)', marginBottom: '0.75rem' }}>
            {'\uD83D\uDC64 \uCCAB \uBC88\uC9F8 \uC0AC\uB78C'}
          </div>
          <div className="form-group">
            <label htmlFor="compat-birth1">{'생년월일'}</label>
            <input
              id="compat-birth1"
              type="date"
              className="form-input"
              value={birth1}
              onChange={(e) => setBirth1(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label id="compat-gender1-label">{'성별'}</label>
            <div className="gender-buttons" role="radiogroup" aria-labelledby="compat-gender1-label">
              <button
                type="button"
                className={`gender-btn ${gender1 === 'male' ? 'active' : ''}`}
                role="radio"
                aria-checked={gender1 === 'male'}
                onClick={() => setGender1('male')}
              >
                {'남성'}
              </button>
              <button
                type="button"
                className={`gender-btn ${gender1 === 'female' ? 'active' : ''}`}
                role="radio"
                aria-checked={gender1 === 'female'}
                onClick={() => setGender1('female')}
              >
                {'여성'}
              </button>
            </div>
          </div>
        </div>

        {/* 두 번째 사람 */}
        <div style={{
          padding: '1rem',
          borderRadius: '0.75rem',
          background: 'rgba(236, 72, 153, 0.06)',
          border: '1px solid rgba(236, 72, 153, 0.15)',
          marginBottom: '1rem',
        }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f472b6', marginBottom: '0.75rem' }}>
            {'\uD83D\uDC64 \uB450 \uBC88\uC9F8 \uC0AC\uB78C'}
          </div>
          <div className="form-group">
            <label htmlFor="compat-birth2">{'생년월일'}</label>
            <input
              id="compat-birth2"
              type="date"
              className="form-input"
              value={birth2}
              onChange={(e) => setBirth2(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label id="compat-gender2-label">{'성별'}</label>
            <div className="gender-buttons" role="radiogroup" aria-labelledby="compat-gender2-label">
              <button
                type="button"
                className={`gender-btn ${gender2 === 'male' ? 'active' : ''}`}
                role="radio"
                aria-checked={gender2 === 'male'}
                onClick={() => setGender2('male')}
              >
                {'남성'}
              </button>
              <button
                type="button"
                className={`gender-btn ${gender2 === 'female' ? 'active' : ''}`}
                role="radio"
                aria-checked={gender2 === 'female'}
                onClick={() => setGender2('female')}
              >
                {'여성'}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!birth1 || !gender1 || !birth2 || !gender2}
        >
          {'궁합 분석하기'}
        </button>
      </form>

      {loading && (
        <div className="loading-spinner" role="status">
          <span className="spinner" />
          <span>{'두 사람의 궁합을 분석하고 있습니다...'}</span>
        </div>
      )}

      {result && !loading && (
        <>
          <div className="result-panel" aria-live="polite">
            <h2>{'\uD83D\uDC95 궁합 분석 결과'}</h2>

            {/* 총합 점수 */}
            <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1 }}>
                <span style={{
                  background: 'linear-gradient(135deg, #c084fc, #f472b6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {result.totalScore}
                </span>
                <span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>{' / 100'}</span>
              </div>
              <div style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.375rem 1rem',
                borderRadius: '9999px',
                background: result.totalScore >= 75 ? 'rgba(52, 211, 153, 0.15)' : result.totalScore >= 50 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                color: result.totalScore >= 75 ? '#34d399' : result.totalScore >= 50 ? '#fbbf24' : '#f87171',
                fontWeight: 700,
                fontSize: '0.9375rem',
              }}>
                {getScoreEmoji(result.totalScore)}{' '}{getScoreLabel(result.totalScore)}
              </div>
            </div>

            {/* 점수 바 */}
            <div style={{ margin: '1.5rem 0' }}>
              <ScoreBar label={'\uC624\uD589 \uAD81\uD569'} score={result.ohangScore} color="#a78bfa" />
              <ScoreBar label={'\uBCC4\uC790\uB9AC \uAD81\uD569'} score={result.zodiacScore} color="#60a5fa" />
              <ScoreBar label={'\uB760 \uAD81\uD569'} score={result.animalScore} color="#f472b6" />
            </div>

            {/* 오행 궁합 */}
            <div className="saju-section">
              <div className="saju-section-title">
                {'\u2728 오행 궁합 '}
                {'('}{result.person1Element}{' + '}{result.person2Element}{')'}
              </div>
              <p className="saju-section-text">{result.ohangAnalysis}</p>
            </div>

            {/* 별자리 궁합 */}
            <div className="saju-section">
              <div className="saju-section-title">
                {'\u2B50 별자리 궁합 '}
                {'('}{result.person1Zodiac.icon}{result.person1Zodiac.name}{' + '}{result.person2Zodiac.icon}{result.person2Zodiac.name}{')'}
              </div>
              <p className="saju-section-text">{result.zodiacAnalysis}</p>
            </div>

            {/* 띠 궁합 */}
            <div className="saju-section">
              <div className="saju-section-title">
                {'\uD83C\uDF0A 띠 궁합 '}
                {'('}{result.person1Animal.emoji}{result.person1Animal.name}{'띠 + '}{result.person2Animal.emoji}{result.person2Animal.name}{'띠)'}
              </div>
              <p className="saju-section-text">{result.animalAnalysis}</p>
            </div>

            {/* 종합 조언 */}
            <div className="saju-section" style={{ borderBottom: 'none' }}>
              <div className="saju-section-title">{'\uD83D\uDCAC 종합 조언'}</div>
              <p className="saju-section-text">{result.advice}</p>
            </div>
          </div>

          <ProductAdBanner
            context={{ type: 'saju', dominantElement: 0, weakElement: 1 }}
            icon="\uD83D\uDC95"
            title="궁합에 어울리는 커플 아이템"
            desc="두 사람의 관계를 더욱 빛나게 해줄 아이템을 찾아보세요"
          />
        </>
      )}
    </div>
  );
}
