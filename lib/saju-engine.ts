/**
 * saju-engine.ts - 만세력 기반 사주팔자 계산 엔진
 *
 * 천간(10) x 지지(12) = 60갑자 순환으로 연주/월주/일주/시주 계산
 * 음양오행(木火土金水) 분석
 */

import {
  HEAVENLY_STEMS, HEAVENLY_STEMS_KO,
  EARTHLY_BRANCHES, EARTHLY_BRANCHES_KO,
  FIVE_ELEMENTS, FIVE_ELEMENTS_KO, FIVE_ELEMENTS_NAME, FIVE_ELEMENTS_COLOR,
  STEM_TO_ELEMENT, BRANCH_TO_ELEMENT,
} from './fortune-data';

// ── 타입 ──
export type Pillar = {
  stem: number;        // 천간 인덱스 (0-9)
  branch: number;      // 지지 인덱스 (0-11)
  stemHanja: string;   // 천간 한자
  branchHanja: string; // 지지 한자
  stemKo: string;      // 천간 한글
  branchKo: string;    // 지지 한글
  element: number;     // 주요 오행 (천간 기준)
};

export type SajuResult = {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  timePillar: Pillar;
  fiveElementCounts: number[]; // [木, 火, 土, 金, 水] 각 개수
  fiveElementPercents: number[]; // 백분율
  dominantElement: number;
  weakElement: number;
  yinYang: 'yin' | 'yang'; // 일간 기준 음양
  personality: string;
  career: string;
  wealth: string;
  love: string;
  health: string;
  yearly: string;
};

// ── 기준 일진: 2000년 1월 1일 = 무오일(戊午日) - JDN 검증 완료 ──
const BASE_DATE = new Date(2000, 0, 1);
const BASE_DAY_STEM = 4;   // 戊 = 4
const BASE_DAY_BRANCH = 6; // 午 = 6

// ── Pillar 생성 ──
function makePillar(stem: number, branch: number): Pillar {
  const s = ((stem % 10) + 10) % 10;
  const b = ((branch % 12) + 12) % 12;
  return {
    stem: s,
    branch: b,
    stemHanja: HEAVENLY_STEMS[s],
    branchHanja: EARTHLY_BRANCHES[b],
    stemKo: HEAVENLY_STEMS_KO[s],
    branchKo: EARTHLY_BRANCHES_KO[b],
    element: STEM_TO_ELEMENT[s],
  };
}

// ── 두 날짜 사이의 일수 ──
function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcB - utcA) / msPerDay);
}

// ── 연주 계산 (입춘 기준: 2월 4일 전후) ──
function getYearPillar(year: number, month: number, day: number): Pillar {
  // 입춘 이전이면 전년 기준
  let effectiveYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    effectiveYear = year - 1;
  }
  // 갑자년 기준: (년도 - 4) % 60
  const idx60 = ((effectiveYear - 4) % 60 + 60) % 60;
  return makePillar(idx60 % 10, idx60 % 12);
}

// ── 월주 계산 (절기 기준 간소화) ──
// 절기 시작일 대략: 입춘(2/4), 경칩(3/6), 청명(4/5), 입하(5/6), 망종(6/6)
// 소서(7/7), 입추(8/7), 백로(9/8), 한로(10/8), 입동(11/7), 대설(12/7), 소한(1/6)
const MONTH_START_DAYS = [6, 4, 6, 5, 6, 6, 7, 7, 8, 8, 7, 7]; // 1월~12월

function getMonthPillar(year: number, month: number, day: number, yearStem: number): Pillar {
  const startDay = MONTH_START_DAYS[month - 1];

  // 절기 이전이면 전월 기준
  let solarMonth = day >= startDay ? month : month - 1;
  if (solarMonth === 0) solarMonth = 12;

  // 양력월 → 절기월: 2월=인월(1), 3월=묘월(2), ..., 1월=축월(12)
  const lunarMonth = ((solarMonth - 2 + 12) % 12) + 1;

  // 월주 지지: 인월(1)=寅(2), 묘월(2)=卯(3), ..., 축월(12)=丑(1)
  const monthBranch = (lunarMonth + 1) % 12;

  // 월주 천간: 연간 기준 오호장건법
  // 갑기년=병인, 을경년=무인, 병신년=경인, 정임년=임인, 무계년=갑인
  const yearStemGroup = yearStem % 5;
  const baseMonthStem = [2, 4, 6, 8, 0][yearStemGroup]; // 병, 무, 경, 임, 갑
  const monthStem = (baseMonthStem + (lunarMonth - 1)) % 10;

  return makePillar(monthStem, monthBranch);
}

// ── 일주 계산 ──
function getDayPillar(year: number, month: number, day: number): Pillar {
  const targetDate = new Date(year, month - 1, day);
  const diff = daysBetween(BASE_DATE, targetDate);
  const stem = ((BASE_DAY_STEM + diff) % 10 + 10) % 10;
  const branch = ((BASE_DAY_BRANCH + diff) % 12 + 12) % 12;
  return makePillar(stem, branch);
}

// ── 시주 계산 ──
// 시간 인덱스: 자시(23~01)=0, 축시(01~03)=1, ... 해시(21~23)=11
function getTimePillar(dayStem: number, timeIndex: number): Pillar {
  // 시주 지지 = 시간 인덱스 그대로
  const timeBranch = timeIndex;

  // 시주 천간: 오자장건법
  // 갑기일=갑자, 을경일=병자, 병신일=무자, 정임일=경자, 무계일=임자
  const dayStemGroup = dayStem % 5;
  const baseTimeStem = [0, 2, 4, 6, 8][dayStemGroup]; // 갑, 병, 무, 경, 임
  const timeStem = (baseTimeStem + timeIndex) % 10;

  return makePillar(timeStem, timeBranch);
}

// ── 오행 개수 계산 ──
function countFiveElements(pillars: Pillar[]): number[] {
  const counts = [0, 0, 0, 0, 0]; // 木, 火, 土, 金, 水

  for (const p of pillars) {
    counts[STEM_TO_ELEMENT[p.stem]]++;
    counts[BRANCH_TO_ELEMENT[p.branch]]++;
  }

  return counts;
}

// ── 성격 해석 (일간 기준) ──
const PERSONALITY_BY_STEM: Record<number, string> = {
  0: '갑목(甲木)의 기운을 가지고 있습니다. 큰 나무처럼 곧고 정직하며 리더십이 강합니다. 목표 의식이 뚜렷하고 추진력이 있으며, 어떤 어려움에도 굳건히 서 있는 강인한 성격입니다. 다만 유연성이 부족할 수 있으니 타인의 의견에도 귀 기울이세요.',
  1: '을목(乙木)의 기운을 가지고 있습니다. 풀과 꽃처럼 유연하고 적응력이 뛰어납니다. 부드러운 외모 속에 강한 생명력을 품고 있으며, 어려운 환경에서도 꿋꿋이 자라나는 끈질긴 성격입니다. 예술적 감각이 뛰어나며 사람들과의 조화를 중시합니다.',
  2: '병화(丙火)의 기운을 가지고 있습니다. 태양처럼 밝고 열정적이며 주변을 환하게 비춥니다. 활발하고 긍정적이며 사교성이 뛰어납니다. 리더로서의 자질이 있으며 카리스마가 강합니다. 때로는 과한 열정이 부담이 될 수 있으니 절제가 필요합니다.',
  3: '정화(丁火)의 기운을 가지고 있습니다. 촛불처럼 은은하면서도 따뜻한 빛을 발합니다. 섬세하고 감수성이 풍부하며 예술적 재능이 뛰어납니다. 내면이 풍요롭고 지적 호기심이 강합니다. 감정 기복에 주의하면 더욱 빛날 수 있습니다.',
  4: '무토(戊土)의 기운을 가지고 있습니다. 산과 같이 듬직하고 안정적입니다. 신뢰감을 주며 책임감이 강합니다. 포용력이 넓고 어려운 상황에서도 중심을 잃지 않습니다. 변화에 다소 느리게 반응할 수 있으나 한번 결정하면 꾸준히 밀고 나갑니다.',
  5: '기토(己土)의 기운을 가지고 있습니다. 비옥한 땅처럼 만물을 키우는 양육의 힘이 있습니다. 정이 많고 타인을 잘 돌보며 실용적인 성격입니다. 꼼꼼하고 세심하며 내면의 풍요로움을 가지고 있습니다.',
  6: '경금(庚金)의 기운을 가지고 있습니다. 강철처럼 강하고 결단력이 있습니다. 정의감이 강하고 불의를 참지 못합니다. 목표를 향해 거침없이 나아가며 원칙을 중시합니다. 때로는 강한 성격이 충돌을 일으킬 수 있으니 유연함도 필요합니다.',
  7: '신금(辛金)의 기운을 가지고 있습니다. 보석처럼 아름답고 세련된 감각을 지니고 있습니다. 완벽을 추구하며 심미적 감각이 뛰어납니다. 예민하고 섬세한 성격으로 디테일에 강합니다. 자기 관리에 철저하며 고집이 있을 수 있습니다.',
  8: '임수(壬水)의 기운을 가지고 있습니다. 바다와 같이 넓고 깊은 포용력을 가지고 있습니다. 지혜롭고 창의적이며 상상력이 풍부합니다. 자유로운 영혼으로 새로운 것에 대한 호기심이 강합니다. 때로는 방향 없이 흘러갈 수 있으니 목표를 명확히 하세요.',
  9: '계수(癸水)의 기운을 가지고 있습니다. 이슬비처럼 조용하지만 끊임없이 스며드는 힘이 있습니다. 인내심이 강하고 꾸준하며 내면이 깊습니다. 직관력이 뛰어나고 영감이 풍부합니다. 조용한 곳에서 사색하는 것을 좋아합니다.',
};

// ── 직업/적성 (오행 기준) ──
const CAREER_BY_ELEMENT: Record<number, string> = {
  0: '목(木)의 기운이 강하여 성장과 교육 분야에 적합합니다. 교사, 교수, 의사, 약사, 한의사, 출판, 교육 사업, 농업, 원예, 환경 관련 직종에서 두각을 나타낼 수 있습니다. 새로운 것을 시작하고 성장시키는 능력이 뛰어납니다.',
  1: '화(火)의 기운이 강하여 예술과 표현 분야에 적합합니다. 방송, 연예, 광고, 디자인, 요리, IT, 전자, 에너지 관련 직종에서 성공할 수 있습니다. 열정적이고 창의적인 성격이 빛을 발합니다.',
  2: '토(土)의 기운이 강하여 안정적이고 신뢰가 필요한 분야에 적합합니다. 부동산, 건축, 농업, 공무원, 관리직, 중개업, 컨설팅 등의 직종에서 능력을 발휘합니다. 사람들의 신뢰를 받는 것이 큰 자산입니다.',
  3: '금(金)의 기운이 강하여 정밀하고 체계적인 분야에 적합합니다. 금융, 법률, 회계, 군인, 경찰, 정치, 기계, 자동차, 보석 관련 직종에서 성과를 낼 수 있습니다. 정확하고 철저한 성격이 장점입니다.',
  4: '수(水)의 기운이 강하여 지적이고 유동적인 분야에 적합합니다. 무역, 유통, 물류, 해운, 관광, 미디어, 연구, 철학, 심리학 관련 직종에서 재능을 발휘합니다. 유연한 사고와 지혜가 무기입니다.',
};

// ── 재물운 ──
const WEALTH_BY_ELEMENT: Record<number, string> = {
  0: '꾸준한 성장형 재물운입니다. 나무가 천천히 자라듯 시간이 지날수록 재물이 불어납니다. 급하게 큰 돈을 벌기보다 장기적인 투자와 저축이 어울립니다. 부동산이나 장기 적금 등 안정적인 재테크가 좋습니다.',
  1: '활발한 소비형 재물운입니다. 돈이 빠르게 들어오지만 나가는 것도 빠릅니다. 재테크에 관심을 가지되 너무 공격적인 투자는 자제하세요. 자기 투자(교육, 건강)에 쓰는 돈은 결국 큰 수익으로 돌아옵니다.',
  2: '안정적인 축적형 재물운입니다. 차곡차곡 모으는 능력이 뛰어나며 재정 관리에 탁월합니다. 부동산이나 토지 관련 투자에 행운이 있습니다. 무리한 사업 확장보다 내실을 다지는 것이 좋습니다.',
  3: '결단력 있는 투자형 재물운입니다. 적절한 타이밍에 과감한 결정을 내려 큰 수익을 올릴 수 있습니다. 금, 주식, 금융 상품에 관심을 가져보세요. 다만 무리한 레버리지는 피하세요.',
  4: '유동적인 재물운입니다. 재물이 물처럼 들어왔다 나갈 수 있으니 관리가 중요합니다. 여러 곳에서 소득이 생길 수 있으며, 부업이나 프리랜서 활동에서 추가 수익을 올릴 수 있습니다.',
};

// ── 연애운 ──
const LOVE_BY_ELEMENT: Record<number, string> = {
  0: '성장하는 사랑을 추구합니다. 함께 발전하고 서로를 응원하는 관계가 어울립니다. 봄의 새싹처럼 시작은 느리지만 점점 깊고 아름다운 사랑으로 자라납니다. 상대를 존중하고 자유를 보장하는 것이 관계 유지의 핵심입니다.',
  1: '열정적인 사랑을 추구합니다. 불꽃처럼 뜨겁고 강렬한 감정을 표현하며, 연애에 있어서 적극적입니다. 단, 열정이 식지 않도록 관계에 새로움을 더하는 노력이 필요합니다. 감정 표현이 풍부한 상대가 잘 맞습니다.',
  2: '안정적인 사랑을 추구합니다. 대지처럼 한결같고 믿음직한 파트너입니다. 결혼 운이 좋으며 가정적인 사람에게 끌립니다. 급격한 변화보다 안정적인 관계를 선호하며, 오래 만나서 결혼에 이르는 연애 스타일입니다.',
  3: '이상적인 사랑을 추구합니다. 완벽한 상대를 찾으려는 경향이 있으며, 높은 기준을 가지고 있습니다. 외모나 조건을 중시할 수 있으나, 진정한 행복은 마음의 교류에서 옵니다. 사소한 것에서 사랑을 찾는 여유를 가지세요.',
  4: '자유로운 사랑을 추구합니다. 정해진 틀에 얽매이지 않는 연애를 좋아하며, 서로의 자유를 존중하는 관계가 어울립니다. 지적인 교류가 가능한 상대에게 끌리며, 소통이 연애의 핵심입니다.',
};

// ── 건강운 ──
const HEALTH_BY_ELEMENT: Record<number, string> = {
  0: '간과 담에 주의가 필요합니다. 눈의 피로나 근육통에도 신경 쓰세요. 푸른 채소를 많이 섭취하고, 산림욕이나 자연 속 걷기가 건강에 좋습니다. 스트레스를 받으면 간에 부담이 갈 수 있으니 명상이나 요가로 마음을 다스리세요.',
  1: '심장과 소장에 주의가 필요합니다. 혈압 관리와 순환계 건강에 신경 쓰세요. 과도한 열정과 스트레스가 심장에 부담을 줄 수 있습니다. 규칙적인 유산소 운동과 붉은색 과일 섭취가 도움이 됩니다.',
  2: '위장과 비장에 주의가 필요합니다. 소화기 건강이 전반적인 건강의 기초가 됩니다. 규칙적인 식사와 따뜻한 음식을 섭취하세요. 과식을 피하고, 적당한 걷기 운동이 소화를 돕습니다.',
  3: '폐와 대장에 주의가 필요합니다. 호흡기 건강과 피부 관리에 신경 쓰세요. 깊은 호흡 운동과 맑은 공기를 마시는 것이 좋습니다. 건조한 환경을 피하고 수분 섭취를 충분히 하세요.',
  4: '신장과 방광에 주의가 필요합니다. 수분 대사와 배뇨 기능에 관심을 가지세요. 충분한 수분 섭취와 하체 운동이 도움됩니다. 너무 차가운 음식은 피하고, 따뜻하게 몸을 관리하세요.',
};

// ── 올해 운세 (연도 기반) ──
function getYearlyFortune(gender: string, birthYear: number, dominantElement: number): string {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear + 1;
  const genderStr = gender === 'male' ? '남성' : '여성';

  const fortunes = [
    `${genderStr}으로서 올해는 큰 전환의 시기입니다. 상반기에는 기존의 기반을 다지는 데 집중하고, 하반기부터 새로운 도약이 가능합니다. 만 ${age - 1}세의 나이에 걸맞는 성숙한 결정을 내리면 좋은 결과가 있을 것입니다. 특히 인간관계에서 귀인이 나타날 수 있으니 주변 사람들을 소중히 하세요.`,
    `${genderStr}으로서 올해는 재물운이 상승하는 해입니다. 만 ${age - 1}세에 접어든 지금, 재정적 기초를 튼튼히 다질 수 있는 시기입니다. 투자보다는 저축에 힘을 쓰면 안정적인 기반을 만들 수 있습니다. 가족과의 관계도 돈독해지는 시기이니 소통에 힘쓰세요.`,
    `${genderStr}으로서 올해는 자기 발전에 최적의 해입니다. 만 ${age - 1}세의 에너지를 새로운 학습이나 기술 습득에 투자하세요. 하반기에는 그 노력의 결실을 볼 수 있습니다. 건강 관리에도 신경 쓰면서 꾸준히 나아가면 큰 성장을 이룰 수 있습니다.`,
    `${genderStr}으로서 올해는 인간관계가 빛나는 해입니다. 만 ${age - 1}세에 새로운 인연이 당신의 인생에 큰 영향을 줄 수 있습니다. 열린 마음으로 사람들을 만나보세요. 사업이나 프로젝트에서 협력의 기회가 많으니 네트워크를 넓히는 것이 좋습니다.`,
    `${genderStr}으로서 올해는 변화와 도전의 해입니다. 만 ${age - 1}세에 두려워했던 일에 도전하면 예상 밖의 좋은 결과를 얻을 수 있습니다. 올해의 결정이 향후 5년의 방향을 결정하니 신중하되 과감하게 행동하세요.`,
  ];

  return fortunes[dominantElement];
}

// ── 메인 사주 계산 함수 ──
export function calculateSaju(
  year: number,
  month: number,
  day: number,
  timeIndex: number, // 0-11 (자시~해시), -1이면 시주 제외
  gender: string,
): SajuResult {
  // 사주 계산
  const yearPillar = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(year, month, day, yearPillar.stem);
  const dayPillar = getDayPillar(year, month, day);
  const timePillar = timeIndex >= 0
    ? getTimePillar(dayPillar.stem, timeIndex)
    : makePillar(0, 0); // 시간 모를 때 기본값

  // 오행 분석
  const pillars = timeIndex >= 0
    ? [yearPillar, monthPillar, dayPillar, timePillar]
    : [yearPillar, monthPillar, dayPillar];

  const fiveElementCounts = countFiveElements(pillars);
  const total = fiveElementCounts.reduce((a, b) => a + b, 0);
  const fiveElementPercents = fiveElementCounts.map(c => Math.round((c / total) * 100));

  const dominantElement = fiveElementCounts.indexOf(Math.max(...fiveElementCounts));
  const weakElement = fiveElementCounts.indexOf(Math.min(...fiveElementCounts));

  // 음양 (일간 기준: 짝수=양, 홀수=음)
  const yinYang = dayPillar.stem % 2 === 0 ? 'yang' : 'yin';

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    timePillar,
    fiveElementCounts,
    fiveElementPercents,
    dominantElement,
    weakElement,
    yinYang,
    personality: PERSONALITY_BY_STEM[dayPillar.stem],
    career: CAREER_BY_ELEMENT[dominantElement],
    wealth: WEALTH_BY_ELEMENT[dominantElement],
    love: LOVE_BY_ELEMENT[dominantElement],
    health: HEALTH_BY_ELEMENT[weakElement],
    yearly: getYearlyFortune(gender, year, dominantElement),
  };
}

// 오행 관련 데이터 export
export {
  FIVE_ELEMENTS, FIVE_ELEMENTS_KO, FIVE_ELEMENTS_NAME, FIVE_ELEMENTS_COLOR,
  HEAVENLY_STEMS, HEAVENLY_STEMS_KO, EARTHLY_BRANCHES, EARTHLY_BRANCHES_KO,
};
