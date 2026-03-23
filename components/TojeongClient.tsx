'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { seededRandom } from '@/lib/fortune-data';
import ProductAdBanner from '@/components/ads/ProductAdBanner';

const CURRENT_YEAR = 2026;

/* ── 토정비결 운세 문구 데이터 ── */

const GENERAL_FORTUNES = [
  '올해는 새로운 시작의 해입니다. 지난해의 경험을 발판 삼아 도약할 수 있는 기회가 많습니다. 상반기에는 기반을 다지는 데 집중하고, 하반기에는 적극적으로 행동에 옮기세요. 귀인이 나타나 큰 도움을 줄 수 있으니 인간관계를 소중히 하세요.',
  '올해는 안정과 내실을 다지는 해입니다. 무리한 확장보다는 현재 가진 것을 견고히 하는 것이 유리합니다. 재물운은 하반기에 상승하며, 건강 관리에 특별히 신경 쓰면 좋은 한 해가 될 것입니다.',
  '올해는 변화와 전환의 해입니다. 예상치 못한 기회가 찾아올 수 있으니 유연한 자세를 유지하세요. 직업이나 거주지의 변화가 있을 수 있으며, 이는 궁극적으로 좋은 방향으로 이끌어줄 것입니다.',
  '올해는 인간관계가 빛나는 해입니다. 새로운 인연이 인생에 큰 영향을 줄 수 있으며, 협력과 소통이 성공의 열쇠가 됩니다. 재물운은 꾸준히 상승하며, 건강은 규칙적인 생활을 통해 유지하세요.',
  '올해는 도전과 성장의 해입니다. 두려워했던 일에 과감히 도전하면 예상 밖의 좋은 결과를 얻을 수 있습니다. 학업이나 자기 계발에 투자하면 큰 성과가 있을 것이며, 하반기에 큰 행운이 찾아옵니다.',
  '올해는 지혜와 통찰의 해입니다. 급하게 서두르기보다 신중한 판단이 필요한 시기입니다. 주변의 조언에 귀 기울이되, 최종 결정은 자신의 내면의 소리를 따르세요. 건강과 재물 모두 안정적인 흐름을 보입니다.',
  '올해는 풍요와 수확의 해입니다. 그동안의 노력이 결실을 맺는 시기로, 재물운이 크게 상승합니다. 새로운 수입원이 생기거나 투자에서 좋은 결과를 얻을 수 있습니다. 감사하는 마음으로 주변과 나누면 더 큰 복이 옵니다.',
  '올해는 자기 발견의 해입니다. 자신의 진정한 가치와 방향을 깨닫는 중요한 시기입니다. 내면의 성장이 외적인 성공으로 이어질 것이며, 상반기에 시작한 일이 하반기에 빛을 발합니다.',
];

const MONTHLY_FORTUNES = [
  // 각 월별 운세 다양한 문구 (인덱스로 선택)
  [
    '새해의 시작과 함께 활기찬 에너지가 감돌합니다. 올해의 계획을 세우고 첫 발을 내딛기에 좋은 달입니다.',
    '차분하게 한 해를 준비하는 달입니다. 무리하지 말고 체력을 비축하세요.',
    '새로운 인연이 찾아올 수 있는 달입니다. 모임이나 행사에 적극 참여하세요.',
  ],
  [
    '재물운이 상승하는 달입니다. 재테크에 관심을 가져보면 좋은 기회를 잡을 수 있습니다.',
    '건강에 신경 쓸 필요가 있는 달입니다. 규칙적인 운동과 충분한 수면을 유지하세요.',
    '직장이나 사업에서 인정받을 수 있는 기회가 있습니다. 실력을 보여주세요.',
  ],
  [
    '인간관계에서 좋은 소식이 있을 수 있습니다. 오래된 친구와의 재회도 기대됩니다.',
    '창의적인 아이디어가 빛나는 달입니다. 새로운 프로젝트를 시작하기에 좋습니다.',
    '여행 운이 좋은 달입니다. 가까운 곳이라도 다녀오면 기분 전환이 됩니다.',
  ],
  [
    '직장에서 승진이나 이동이 있을 수 있습니다. 변화를 두려워하지 마세요.',
    '연애운이 상승하는 달입니다. 커플은 관계가 더 깊어지고, 솔로는 좋은 만남이 기대됩니다.',
    '학업이나 자격증 시험에 좋은 결과를 얻을 수 있는 달입니다. 집중하세요.',
  ],
  [
    '에너지가 넘치는 달입니다. 적극적으로 행동하면 뜻밖의 성과를 거둘 수 있습니다.',
    '가족과의 유대가 강해지는 달입니다. 함께하는 시간을 소중히 하세요.',
    '건강이 회복되는 달입니다. 새로운 운동이나 건강 습관을 시작하기에 좋습니다.',
  ],
  [
    '재물이 들어오는 달이지만, 지출도 많을 수 있습니다. 계획적인 소비가 필요합니다.',
    '직감이 예민해지는 달입니다. 첫 느낌을 신뢰하면 좋은 선택을 할 수 있습니다.',
    '대인관계에서 주의가 필요한 달입니다. 말 한마디에 신경 쓰세요.',
  ],
  [
    '올해의 전환점이 될 수 있는 달입니다. 큰 결정을 내리기에 적합한 시기입니다.',
    '건강에 특별히 주의가 필요한 달입니다. 무리하지 말고 충분히 쉬세요.',
    '새로운 수입원이 생길 수 있는 달입니다. 부업이나 투자에 관심을 가져보세요.',
  ],
  [
    '노력의 결실이 보이기 시작하는 달입니다. 포기하지 말고 조금만 더 힘내세요.',
    '여행이나 이동에 관련된 좋은 일이 있을 수 있습니다. 기회를 놓치지 마세요.',
    '정신적 성장이 이루어지는 달입니다. 독서나 명상이 큰 도움이 됩니다.',
  ],
  [
    '대인관계가 활발해지는 달입니다. 새로운 모임에 참여하면 좋은 인연을 만날 수 있습니다.',
    '재물운이 하락할 수 있는 달입니다. 큰 지출은 다음 달로 미루는 것이 좋습니다.',
    '창의적인 프로젝트에서 성과를 낼 수 있는 달입니다. 아이디어를 실행에 옮기세요.',
  ],
  [
    '건강 운이 좋아지는 달입니다. 그동안의 건강 관리가 효과를 보이기 시작합니다.',
    '직장에서 중요한 프로젝트를 맡게 될 수 있습니다. 자신감을 가지고 임하세요.',
    '가족에게서 좋은 소식이 올 수 있는 달입니다. 소통을 유지하세요.',
  ],
  [
    '연말을 앞두고 재물운이 상승합니다. 보너스나 임시 수입이 기대됩니다.',
    '올해를 마무리하며 정리할 것들이 있는 달입니다. 미뤄둔 일을 처리하세요.',
    '인간관계를 정리하기 좋은 달입니다. 진정한 인연을 가려내는 지혜가 필요합니다.',
  ],
  [
    '한 해를 마무리하며 감사하는 마음이 행운을 부릅니다. 주변에 베풀면 복이 돌아옵니다.',
    '새해를 맞이하는 준비를 하기 좋은 달입니다. 내년의 목표를 세워보세요.',
    '건강하게 한 해를 마무리할 수 있는 달입니다. 가족과 따뜻한 시간을 보내세요.',
  ],
];

const SANGWON_TITLES = [
  '천문(天門) - 하늘의 기운이 열리다',
  '천예(天藝) - 예술적 재능이 빛나다',
  '천권(天權) - 권위와 리더십의 해',
  '천파(天破) - 변화와 파격의 해',
  '천간(天間) - 여유와 안정의 해',
  '천문(天紋) - 학문의 기운이 충만하다',
  '천복(天福) - 복이 넘치는 해',
  '천역(天驛) - 이동과 변화의 해',
];

type TojeongResult = {
  sangwon: string;         // 상원 제목
  totalFortune: string;    // 총운
  monthlyFortunes: string[]; // 12개월
  luckyMonths: number[];   // 행운의 달 (1-12)
  cautionMonths: number[]; // 주의할 달 (1-12)
  luckyDirection: string;
  luckyColor: string;
  overallScore: number;    // 총운 점수 (0-100)
};

function calculateTojeong(birthYear: number, gender: string): TojeongResult {
  const age = CURRENT_YEAR - birthYear + 1;
  const seed = birthYear * 10000 + CURRENT_YEAR * 100 + (gender === 'male' ? 1 : 2);
  const rng = seededRandom(seed);

  // 상원 (나이 기반)
  const sangwonIdx = (age + Math.floor(rng() * 3)) % SANGWON_TITLES.length;
  const sangwon = SANGWON_TITLES[sangwonIdx];

  // 총운
  const fortuneIdx = Math.floor(rng() * GENERAL_FORTUNES.length);
  const totalFortune = GENERAL_FORTUNES[fortuneIdx];

  // 총운 점수
  const overallScore = Math.floor(rng() * 35) + 55; // 55-90 range

  // 월별 운세
  const monthlyFortunes: string[] = [];
  const monthScores: number[] = [];
  for (let i = 0; i < 12; i++) {
    const mIdx = Math.floor(rng() * MONTHLY_FORTUNES[i].length);
    monthlyFortunes.push(MONTHLY_FORTUNES[i][mIdx]);
    monthScores.push(Math.floor(rng() * 5) + 1); // 1-5 score per month
  }

  // 행운의 달 (점수 4 이상인 달)
  const luckyMonths: number[] = [];
  const cautionMonths: number[] = [];
  for (let i = 0; i < 12; i++) {
    if (monthScores[i] >= 4) luckyMonths.push(i + 1);
    if (monthScores[i] <= 2) cautionMonths.push(i + 1);
  }
  // Ensure at least 2 lucky and 1 caution
  if (luckyMonths.length < 2) {
    const candidates = Array.from({ length: 12 }, (_, i) => i + 1).filter(m => !luckyMonths.includes(m) && !cautionMonths.includes(m));
    while (luckyMonths.length < 2 && candidates.length > 0) {
      const idx = Math.floor(rng() * candidates.length);
      luckyMonths.push(candidates.splice(idx, 1)[0]);
    }
  }
  if (cautionMonths.length < 1) {
    const candidates = Array.from({ length: 12 }, (_, i) => i + 1).filter(m => !luckyMonths.includes(m) && !cautionMonths.includes(m));
    if (candidates.length > 0) {
      cautionMonths.push(candidates[Math.floor(rng() * candidates.length)]);
    }
  }

  // 행운의 방향/색상
  const directions = ['동쪽', '서쪽', '남쪽', '북쪽', '동남쪽', '서북쪽', '동북쪽', '서남쪽'];
  const colors = ['보라색', '파란색', '초록색', '노란색', '흰색', '빨간색', '금색', '은색'];
  const luckyDirection = directions[Math.floor(rng() * directions.length)];
  const luckyColor = colors[Math.floor(rng() * colors.length)];

  return {
    sangwon,
    totalFortune,
    monthlyFortunes,
    luckyMonths: luckyMonths.sort((a, b) => a - b),
    cautionMonths: cautionMonths.sort((a, b) => a - b),
    luckyDirection,
    luckyColor,
    overallScore,
  };
}

function MonthBadge({ month, type }: { month: number; type: 'lucky' | 'caution' }) {
  const isLucky = type === 'lucky';
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.25rem 0.625rem',
      borderRadius: '9999px',
      fontSize: '0.8125rem',
      fontWeight: 600,
      background: isLucky ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)',
      color: isLucky ? '#34d399' : '#f87171',
      marginRight: '0.375rem',
      marginBottom: '0.375rem',
    }}>
      {isLucky ? '\u2728' : '\u26A0\uFE0F'}{' '}{month}{'월'}
    </span>
  );
}

export default function TojeongClient() {
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [result, setResult] = useState<TojeongResult | null>(null);
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 71 }, (_, i) => 2010 - i); // 2010 to 1940

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!birthYear || !gender) return;
    setLoading(true);
    setTimeout(() => {
      const r = calculateTojeong(parseInt(birthYear), gender);
      setResult(r);
      setLoading(false);
    }, 400);
  }

  const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <div>
      <div className="page-header">
        <div className="page-icon">{'\uD83D\uDCDC'}</div>
        <h1>{'토정비결 - '}{CURRENT_YEAR}{'년 무료 토정비결'}</h1>
        <p>{'출생연도를 입력하고 올해의 운세를 확인하세요'}</p>
      </div>

      <form className="saju-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tojeong-year">{'출생연도'}</label>
          <span className="label-desc">{'양력 기준 출생연도를 선택해주세요'}</span>
          <select
            id="tojeong-year"
            className="form-input"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            required
          >
            <option value="">{'출생연도 선택'}</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}{'년생 (만 '}{CURRENT_YEAR - y}{'세)'}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label id="tojeong-gender-label">{'성별'}</label>
          <div className="gender-buttons" role="radiogroup" aria-labelledby="tojeong-gender-label">
            <button
              type="button"
              className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
              role="radio"
              aria-checked={gender === 'male'}
              onClick={() => setGender('male')}
            >
              {'남성'}
            </button>
            <button
              type="button"
              className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
              role="radio"
              aria-checked={gender === 'female'}
              onClick={() => setGender('female')}
            >
              {'여성'}
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={!birthYear || !gender}>
          {'토정비결 보기'}
        </button>
      </form>

      {loading && (
        <div className="loading-spinner" role="status">
          <span className="spinner" />
          <span>{'토정비결을 풀이하고 있습니다...'}</span>
        </div>
      )}

      {result && !loading && (
        <>
          <div className="result-panel" aria-live="polite">
            <h2>{'\uD83D\uDCDC '}{CURRENT_YEAR}{'년 토정비결'}</h2>

            {/* 상원 */}
            <div style={{ textAlign: 'center', margin: '1.25rem 0' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#a78bfa',
                fontWeight: 700,
                fontSize: '0.9375rem',
              }}>
                {result.sangwon}
              </span>
            </div>

            {/* 총운 점수 */}
            <div style={{ textAlign: 'center', margin: '1rem 0 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1 }}>
                <span style={{
                  background: 'linear-gradient(135deg, #c084fc, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {result.overallScore}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>{' / 100'}</span>
              </div>
            </div>

            {/* 총운 */}
            <div className="saju-section">
              <div className="saju-section-title">{'\uD83C\uDF1F 총운'}</div>
              <p className="saju-section-text">{result.totalFortune}</p>
            </div>

            {/* 행운의 달 / 주의할 달 */}
            <div className="saju-section">
              <div className="saju-section-title">{'\uD83C\uDF40 행운의 달'}</div>
              <div style={{ padding: '0.5rem 0' }}>
                {result.luckyMonths.map((m) => (
                  <MonthBadge key={`lucky-${m}`} month={m} type="lucky" />
                ))}
              </div>
            </div>

            <div className="saju-section">
              <div className="saju-section-title">{'\u26A0\uFE0F 주의할 달'}</div>
              <div style={{ padding: '0.5rem 0' }}>
                {result.cautionMonths.map((m) => (
                  <MonthBadge key={`caution-${m}`} month={m} type="caution" />
                ))}
              </div>
            </div>

            {/* 행운의 방향/색상 */}
            <div className="saju-section">
              <div className="saju-section-title">{'\uD83E\uDDED 올해의 행운 키워드'}</div>
              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                padding: '0.5rem 0',
              }}>
                <div style={{
                  flex: '1 1 auto',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>{'행운의 방향'}</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-accent, #a78bfa)' }}>{result.luckyDirection}</div>
                </div>
                <div style={{
                  flex: '1 1 auto',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>{'행운의 색상'}</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-accent, #a78bfa)' }}>{result.luckyColor}</div>
                </div>
              </div>
            </div>

            {/* 월별 운세 */}
            <div className="saju-section" style={{ borderBottom: 'none' }}>
              <div className="saju-section-title">{'\uD83D\uDCC5 월별 운세'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                {result.monthlyFortunes.map((fortune, idx) => {
                  const isLucky = result.luckyMonths.includes(idx + 1);
                  const isCaution = result.cautionMonths.includes(idx + 1);
                  return (
                    <div key={idx} style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      background: isLucky
                        ? 'rgba(52, 211, 153, 0.06)'
                        : isCaution
                          ? 'rgba(248, 113, 113, 0.06)'
                          : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isLucky ? 'rgba(52, 211, 153, 0.2)' : isCaution ? 'rgba(248, 113, 113, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.375rem',
                      }}>
                        <span style={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: isLucky ? '#34d399' : isCaution ? '#f87171' : 'var(--color-accent, #a78bfa)',
                          minWidth: '2.5rem',
                        }}>
                          {MONTH_NAMES[idx]}
                        </span>
                        {isLucky && <span style={{ fontSize: '0.75rem', color: '#34d399' }}>{'\u2728 행운'}</span>}
                        {isCaution && <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{'\u26A0\uFE0F 주의'}</span>}
                      </div>
                      <p style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        {fortune}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <ProductAdBanner
            context={{ type: 'saju', dominantElement: 2, weakElement: 4 }}
            icon="\uD83D\uDCDC"
            title="올해의 행운 아이템"
            desc="토정비결이 추천하는 올해의 행운 아이템을 확인하세요"
          />
        </>
      )}
    </div>
  );
}
