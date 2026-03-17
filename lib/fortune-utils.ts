/**
 * fortune-utils.ts — 운세 계산 유틸리티 (공용)
 *
 * page.tsx 등에서 공통으로 사용하는 별자리/운세/타로 유틸 함수
 */

import {
  ZODIAC_SIGNS, FORTUNE_MESSAGES, OVERALL_FORTUNES,
  LOVE_FORTUNES, MONEY_FORTUNES, HEALTH_FORTUNES,
  DAILY_ADVICE, LUCKY_COLORS, getDailySeed, seededRandom,
  MAJOR_ARCANA,
} from '@/lib/fortune-data';

/* ── 별자리 판정 ── */

export function getZodiacSign(month: number, day: number) {
  const ranges: [number, number, number][] = [
    [1, 20, 9], [2, 19, 10], [3, 21, 11], [4, 20, 0],
    [5, 21, 1], [6, 22, 2], [7, 23, 3], [8, 23, 4],
    [9, 23, 5], [10, 23, 6], [11, 22, 7], [12, 22, 8],
  ];
  for (let i = 0; i < ranges.length; i++) {
    const [m, d, prev] = ranges[i];
    if (month === m && day < d) return ZODIAC_SIGNS[prev];
  }
  const monthIdx = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return ZODIAC_SIGNS[monthIdx[month] ?? 9];
}

/* ── 별자리별 일일 운세 ── */

export function getZodiacFortune(signIndex: number) {
  const seed = getDailySeed();
  const rng = seededRandom(seed + signIndex * 777 + signIndex * signIndex * 13);
  return {
    overall: Math.floor(rng() * 5) + 1,
    love: Math.floor(rng() * 5) + 1,
    money: Math.floor(rng() * 5) + 1,
    health: Math.floor(rng() * 5) + 1,
    fortuneText: FORTUNE_MESSAGES[Math.floor(rng() * FORTUNE_MESSAGES.length)],
    overallText: OVERALL_FORTUNES[Math.floor(rng() * OVERALL_FORTUNES.length)],
    loveText: LOVE_FORTUNES[Math.floor(rng() * LOVE_FORTUNES.length)],
    moneyText: MONEY_FORTUNES[Math.floor(rng() * MONEY_FORTUNES.length)],
    healthText: HEALTH_FORTUNES[Math.floor(rng() * HEALTH_FORTUNES.length)],
    advice: DAILY_ADVICE[Math.floor(rng() * DAILY_ADVICE.length)],
    luckyColor: LUCKY_COLORS[Math.floor(rng() * LUCKY_COLORS.length)],
    luckyNumber: Math.floor(rng() * 45) + 1,
  };
}

/* ── 이름 해시 ── */

export function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h) + name.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/* ── 일일 타로 카드 ── */

export function getDailyTarot(seed: number) {
  const rng = seededRandom(seed * 31);
  const card = MAJOR_ARCANA[Math.floor(rng() * MAJOR_ARCANA.length)];
  return { card, isReversed: rng() > 0.5 };
}

/* ── 럭키넘버 생성 ── */

export function getLuckyNumbers(seed: number, count: number = 6): number[] {
  const rng = seededRandom(seed * 17);
  const nums = new Set<number>();
  while (nums.size < count) {
    nums.add(Math.floor(rng() * 45) + 1);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

/* ── 한줄 요약 생성 ── */

const HOROSCOPE_SUMMARY_TEMPLATES = [
  (name: string, score: number) => score >= 4 ? `${name}님, 오늘 별들이 당신 편입니다! 무엇이든 도전하세요.` : score >= 3 ? `${name}님, 무난하지만 작은 기회를 놓치지 마세요.` : `${name}님, 오늘은 차분하게 에너지를 비축하는 날입니다.`,
  (name: string, score: number) => score >= 4 ? `${name}님에게 행운의 빛이 쏟아지는 하루입니다!` : score >= 3 ? `${name}님, 안정적인 하루가 예상됩니다. 기본에 충실하세요.` : `${name}님, 신중한 판단이 필요한 하루입니다.`,
  (name: string, score: number) => score >= 4 ? `${name}님, 모든 것이 순조로운 날! 큰 일도 해낼 수 있어요.` : score >= 3 ? `${name}님, 오전은 좋지만 오후에는 주의가 필요합니다.` : `${name}님, 감정에 휘둘리지 않으면 무사히 넘길 수 있습니다.`,
];

export function getHoroscopeSummary(name: string, overallScore: number, seed: number): string {
  const idx = seed % HOROSCOPE_SUMMARY_TEMPLATES.length;
  return HOROSCOPE_SUMMARY_TEMPLATES[idx](name, overallScore);
}

const SAJU_SUMMARY_TEMPLATES: Record<number, string> = {
  0: '나무의 기운이 당신을 감싸고 있습니다. 성장과 발전의 에너지를 품고 있어요.',
  1: '불의 기운이 타오릅니다. 열정과 추진력으로 가득 찬 사주입니다.',
  2: '대지의 기운이 안정을 줍니다. 신뢰와 인내의 힘을 가졌습니다.',
  3: '금속의 기운이 빛납니다. 결단력과 정의감이 강한 사주입니다.',
  4: '물의 기운이 흐릅니다. 지혜와 유연함으로 세상을 읽는 사주입니다.',
};

export function getSajuSummary(dominantElement: number): string {
  return SAJU_SUMMARY_TEMPLATES[dominantElement] ?? '';
}

export function getTarotSummary(cardNameKo: string, isReversed: boolean, uprightKeywords: string, reversedKeywords: string): string {
  const direction = isReversed ? '역방향' : '정방향';
  const keywords = isReversed ? reversedKeywords : uprightKeywords;
  const first = keywords.split(',')[0]?.trim() ?? '';
  return `오늘의 카드 '${cardNameKo}' (${direction}) — "${first}"의 에너지가 당신의 하루를 이끕니다.`;
}

/* ── 종합 점수 계산 ── */

export function getOverallScore(fortune: { overall: number; love: number; money: number; health: number }): number {
  return Math.round((fortune.overall * 3 + fortune.love + fortune.money + fortune.health) / 6 * 20);
}

/* ── 오행 궁합 조언 ── */

const ELEMENT_ADVICE: Record<number, { good: string; avoid: string; tip: string }> = {
  0: { good: '수(水)의 기운과 함께하면 더 크게 성장합니다', avoid: '금(金)의 기운이 강한 날은 조심하세요', tip: '녹색 계열 옷이나 소품이 행운을 불러옵니다' },
  1: { good: '목(木)의 기운이 열정에 연료를 더해줍니다', avoid: '수(水)의 기운이 강하면 에너지가 꺾일 수 있어요', tip: '붉은색 계열 아이템이 기운을 올려줍니다' },
  2: { good: '화(火)의 기운이 안정감에 활력을 더합니다', avoid: '목(木)의 기운이 과하면 흔들릴 수 있어요', tip: '노란색·갈색 계열이 안정감을 높여줍니다' },
  3: { good: '토(土)의 기운이 결단력에 바탕을 줍니다', avoid: '화(火)의 기운이 강하면 소모가 클 수 있어요', tip: '흰색·은색 계열이 집중력을 높여줍니다' },
  4: { good: '금(金)의 기운이 지혜에 깊이를 더합니다', avoid: '토(土)의 기운이 과하면 막히는 느낌이 들 수 있어요', tip: '파란색·검정 계열이 직관력을 강화합니다' },
};

export function getElementAdvice(dominantElement: number) {
  return ELEMENT_ADVICE[dominantElement] ?? ELEMENT_ADVICE[0];
}

/* ── 띠 계산 ── */

const CHINESE_ZODIAC = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
const CHINESE_ZODIAC_EMOJI = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐔', '🐶', '🐷'];

export function getChineseZodiac(year: number) {
  const idx = (year - 4) % 12;
  return { name: CHINESE_ZODIAC[idx], emoji: CHINESE_ZODIAC_EMOJI[idx] };
}

/* ── 별자리 성격 요약 ── */

const ZODIAC_PERSONALITY: Record<string, string> = {
  aries: '에너지 넘치는 도전자. 새로운 것을 시작하는 데 두려움이 없으며 리더십이 강합니다.',
  taurus: '끈기 있는 현실주의자. 안정적이고 신뢰할 수 있으며 감각적인 즐거움을 추구합니다.',
  gemini: '다재다능한 소통가. 호기심이 왕성하고 유머 감각이 뛰어나며 빠른 적응력을 가졌습니다.',
  cancer: '따뜻한 감성의 보호자. 가족과 가까운 사람들을 위해 헌신하며 직감이 뛰어납니다.',
  leo: '화려한 카리스마의 소유자. 자신감 넘치고 관대하며 주변을 밝게 만드는 에너지가 있습니다.',
  virgo: '완벽을 추구하는 분석가. 세심하고 체계적이며 실용적인 해결책을 찾는 데 탁월합니다.',
  libra: '조화를 추구하는 예술가. 공정함을 중시하고 아름다움에 대한 감각이 뛰어납니다.',
  scorpio: '깊이 있는 통찰력의 소유자. 강한 의지와 직관력으로 본질을 꿰뚫어봅니다.',
  sagittarius: '자유를 사랑하는 탐험가. 낙관적이고 철학적이며 새로운 경험을 갈망합니다.',
  capricorn: '야심 찬 전략가. 목표를 향해 꾸준히 나아가며 책임감이 강합니다.',
  aquarius: '독창적인 혁신가. 남다른 시각으로 세상을 바라보며 인류에 대한 관심이 깊습니다.',
  pisces: '꿈꾸는 감성가. 풍부한 상상력과 공감 능력으로 예술적 재능이 빛납니다.',
};

export function getZodiacPersonality(slug: string): string {
  return ZODIAC_PERSONALITY[slug] ?? '';
}

/* ── 3장 타로 (과거/현재/미래) ── */

export function getThreeCardTarot(seed: number) {
  const rng = seededRandom(seed * 53);
  const usedIndices = new Set<number>();
  const cards = [];
  const labels = ['과거', '현재', '미래'];
  for (let i = 0; i < 3; i++) {
    let idx: number;
    do { idx = Math.floor(rng() * MAJOR_ARCANA.length); } while (usedIndices.has(idx));
    usedIndices.add(idx);
    cards.push({ card: MAJOR_ARCANA[idx], isReversed: rng() > 0.5, label: labels[i] });
  }
  return cards;
}

/* ── 시간대별 운세 조언 ── */

const TIME_FORTUNE: Record<string, { morning: string; afternoon: string; evening: string }> = {
  high: {
    morning: '오전에 에너지가 가장 높습니다. 중요한 결정이나 미팅은 오전에 잡으세요. 10시~12시 사이가 최적입니다.',
    afternoon: '오후에는 창의적인 아이디어가 떠오르기 좋은 시간입니다. 새로운 프로젝트 기획이나 브레인스토밍을 해보세요.',
    evening: '저녁에는 사교 활동에서 좋은 기운이 있습니다. 오래 보지 못한 지인에게 연락해보세요.',
  },
  mid: {
    morning: '오전에는 차분하게 하루를 준비하세요. 명상이나 가벼운 스트레칭으로 시작하면 좋습니다.',
    afternoon: '오후 2시~4시 사이가 집중력이 가장 높은 시간입니다. 업무 처리에 적합합니다.',
    evening: '저녁에는 개인 시간을 충분히 가지세요. 자기 계발이나 취미 활동이 운을 높여줍니다.',
  },
  low: {
    morning: '오전에는 무리하지 마세요. 중요한 약속은 가급적 오후로 미루는 것이 좋습니다.',
    afternoon: '오후에는 기운이 서서히 올라옵니다. 가벼운 산책으로 에너지를 전환해보세요.',
    evening: '저녁에는 일찍 귀가하여 충분한 휴식을 취하세요. 내일을 위한 충전이 필요합니다.',
  },
};

export function getTimeFortune(overallScore: number): { morning: string; afternoon: string; evening: string } {
  if (overallScore >= 4) return TIME_FORTUNE.high;
  if (overallScore >= 3) return TIME_FORTUNE.mid;
  return TIME_FORTUNE.low;
}

/* ── 별자리 궁합 ── */

const ZODIAC_COMPAT: Record<string, { best: string[]; good: string[]; caution: string[] }> = {
  aries: { best: ['leo', 'sagittarius'], good: ['gemini', 'aquarius'], caution: ['cancer', 'capricorn'] },
  taurus: { best: ['virgo', 'capricorn'], good: ['cancer', 'pisces'], caution: ['leo', 'aquarius'] },
  gemini: { best: ['libra', 'aquarius'], good: ['aries', 'leo'], caution: ['virgo', 'pisces'] },
  cancer: { best: ['scorpio', 'pisces'], good: ['taurus', 'virgo'], caution: ['aries', 'libra'] },
  leo: { best: ['aries', 'sagittarius'], good: ['gemini', 'libra'], caution: ['taurus', 'scorpio'] },
  virgo: { best: ['taurus', 'capricorn'], good: ['cancer', 'scorpio'], caution: ['gemini', 'sagittarius'] },
  libra: { best: ['gemini', 'aquarius'], good: ['leo', 'sagittarius'], caution: ['cancer', 'capricorn'] },
  scorpio: { best: ['cancer', 'pisces'], good: ['virgo', 'capricorn'], caution: ['leo', 'aquarius'] },
  sagittarius: { best: ['aries', 'leo'], good: ['libra', 'aquarius'], caution: ['virgo', 'pisces'] },
  capricorn: { best: ['taurus', 'virgo'], good: ['scorpio', 'pisces'], caution: ['aries', 'libra'] },
  aquarius: { best: ['gemini', 'libra'], good: ['aries', 'sagittarius'], caution: ['taurus', 'scorpio'] },
  pisces: { best: ['cancer', 'scorpio'], good: ['taurus', 'capricorn'], caution: ['gemini', 'sagittarius'] },
};

export function getZodiacCompat(slug: string) {
  return ZODIAC_COMPAT[slug] ?? ZODIAC_COMPAT.aries;
}

/* ── 3카드 스프레드 종합 해석 ── */

const SPREAD_INTERPRETATIONS = [
  (past: string, present: string, future: string) =>
    `과거의 '${past}' 에너지가 현재의 '${present}'으로 이어지고 있습니다. 이 흐름이 미래의 '${future}'로 발전할 것입니다. 과거의 경험을 교훈 삼아 현재에 집중하면 밝은 미래를 만들 수 있습니다.`,
  (past: string, present: string, future: string) =>
    `'${past}'의 영향 아래 지나온 시간들이 현재 '${present}'의 기반이 되었습니다. 앞으로 '${future}'의 에너지가 펼쳐집니다. 변화를 두려워하지 말고 자연스러운 흐름에 맡겨보세요.`,
  (past: string, present: string, future: string) =>
    `과거에는 '${past}'의 시기를 거쳤고, 지금은 '${present}'의 한가운데에 있습니다. 미래에는 '${future}'이(가) 기다리고 있으니, 현재의 선택이 미래를 결정짓는 열쇠가 됩니다.`,
];

export function getSpreadInterpretation(cards: { card: { nameKo: string }; isReversed: boolean }[], seed: number): string {
  const idx = seed % SPREAD_INTERPRETATIONS.length;
  const names = cards.map(c => c.card.nameKo + (c.isReversed ? '(역)' : ''));
  return SPREAD_INTERPRETATIONS[idx](names[0], names[1], names[2]);
}

/* ── 오늘의 행동 가이드 (운세용) ── */

const ACTION_GUIDES: Record<string, string[]> = {
  love: [
    '커플: 사소한 선물이 큰 감동을 줄 수 있는 날입니다.',
    '솔로: 새로운 모임이나 소셜 활동에 참여하면 좋은 인연을 만날 수 있습니다.',
    '가족: 가족과의 대화 시간을 가지면 관계가 더욱 깊어집니다.',
  ],
  money: [
    '충동구매를 자제하고, 꼭 필요한 지출만 하세요.',
    '새로운 재테크 정보를 찾아보기 좋은 날입니다.',
    '지인과의 금전 거래는 피하는 것이 좋습니다.',
  ],
  health: [
    '물을 평소보다 2잔 더 마시세요. 수분 보충이 중요한 날입니다.',
    '30분 이상의 유산소 운동이 컨디션 회복에 도움됩니다.',
    '과로를 피하고 충분한 수면을 취하세요.',
  ],
};

export function getActionGuide(seed: number): { love: string; money: string; health: string } {
  const rng = seededRandom(seed * 41);
  return {
    love: ACTION_GUIDES.love[Math.floor(rng() * ACTION_GUIDES.love.length)],
    money: ACTION_GUIDES.money[Math.floor(rng() * ACTION_GUIDES.money.length)],
    health: ACTION_GUIDES.health[Math.floor(rng() * ACTION_GUIDES.health.length)],
  };
}

/* ── 생시 상수 ── */

export const BIRTH_TIMES = [
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
