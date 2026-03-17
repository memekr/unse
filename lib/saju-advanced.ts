/**
 * saju-advanced.ts — 고급 사주 분석 엔진
 *
 * 십신(十神), 12운성(十二運星), 신살(神煞), 대운(大運),
 * 세운(歲運), 월운(月運), 용신(用神), 형충파합해(刑沖破合害) 분석
 */

import {
  HEAVENLY_STEMS, HEAVENLY_STEMS_KO,
  EARTHLY_BRANCHES, EARTHLY_BRANCHES_KO,
  FIVE_ELEMENTS_NAME, FIVE_ELEMENTS_COLOR,
  STEM_TO_ELEMENT, BRANCH_TO_ELEMENT,
} from './fortune-data';
import type { Pillar, SajuResult } from './saju-engine';

/* ══════════════════════════════════
   1. 십신 (Ten Gods / 十神)
   ══════════════════════════════════ */

export const TEN_GODS_HANJA = ['比肩','劫財','食神','傷官','偏財','正財','偏官','正官','偏印','正印'] as const;
export const TEN_GODS_KO = ['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인'] as const;
export const TEN_GODS_MEANING = [
  '자아, 독립심, 경쟁심, 형제자매',
  '도전, 쟁취, 추진력, 승부욕',
  '표현력, 창의성, 자녀운, 식복',
  '재능, 반항, 예술성, 변화',
  '유동재산, 투자, 아버지, 부업',
  '고정재산, 근면, 배우자(남), 저축',
  '권력, 도전, 스트레스, 직장변동',
  '명예, 직위, 배우자(여), 안정',
  '편학, 특수재능, 영감, 종교',
  '학문, 자격, 어머니, 후원자',
] as const;

/**
 * 일간(dayMaster) 기준으로 다른 천간의 십신을 계산
 * 오행 관계: 비겁(같은오행), 식상(내가생), 재성(내가극), 관성(나를극), 인성(나를생)
 * 음양 같으면 편, 다르면 정
 */
export function getTenGod(dayMasterStem: number, targetStem: number): number {
  const dmEl = STEM_TO_ELEMENT[dayMasterStem];
  const tEl = STEM_TO_ELEMENT[targetStem];
  const dmYin = dayMasterStem % 2; // 0=양, 1=음
  const tYin = targetStem % 2;
  const samePolarity = dmYin === tYin;

  // 오행 관계 판단 (생극 순환: 木→火→土→金→水→木)
  const diff = ((tEl - dmEl) % 5 + 5) % 5;
  // diff: 0=같은오행(비겁), 1=내가생(식상), 2=내가극(재성), 3=나를극(관성), 4=나를생(인성)

  let base: number;
  switch (diff) {
    case 0: base = 0; break; // 비겁
    case 1: base = 2; break; // 식상
    case 2: base = 4; break; // 재성
    case 3: base = 6; break; // 관성
    case 4: base = 8; break; // 인성
    default: base = 0;
  }

  return samePolarity ? base : base + 1;
}

export type TenGodInfo = {
  index: number;
  hanja: string;
  ko: string;
  meaning: string;
};

export function getTenGodInfo(dayMasterStem: number, targetStem: number): TenGodInfo {
  const idx = getTenGod(dayMasterStem, targetStem);
  return {
    index: idx,
    hanja: TEN_GODS_HANJA[idx],
    ko: TEN_GODS_KO[idx],
    meaning: TEN_GODS_MEANING[idx],
  };
}

/* ══════════════════════════════════
   2. 12운성 (Twelve Life Stages)
   ══════════════════════════════════ */

export const TWELVE_STAGES_HANJA = ['長生','沐浴','冠帶','臨官','帝旺','衰','病','死','墓','絶','胎','養'] as const;
export const TWELVE_STAGES_KO = ['장생','목욕','관대','임관','제왕','쇠','병','사','묘','절','태','양'] as const;
export const TWELVE_STAGES_MEANING = [
  '새로운 시작, 성장의 기운, 잠재력 발현',
  '변화와 불안정, 새로운 경험, 시행착오',
  '성장과 준비, 사회 진출, 자립의 시기',
  '사회적 성취, 능력 발휘, 인정받는 시기',
  '최고의 전성기, 왕성한 활동, 정점의 에너지',
  '하강의 시작, 체력 관리 필요, 내면의 성숙',
  '시련과 극복, 건강 주의, 인내가 필요한 시기',
  '전환점, 기존 방식의 마무리, 새 출발 준비',
  '내면의 축적, 잠재적 에너지 저장, 재충전',
  '단절과 재생, 과거와의 이별, 새로운 가능성',
  '새 생명의 잉태, 희망의 씨앗, 미래의 시작',
  '보호와 양육, 기반 다지기, 성장을 위한 준비',
] as const;

// 양간 장생 지지 위치 (甲=亥, 丙=寅, 戊=寅, 庚=巳, 壬=申)
const YANG_CHANGSHENG = [11, 11, 2, 2, 2, 2, 5, 5, 8, 8]; // 각 천간의 장생 지지

export function getTwelveStage(stem: number, branch: number): number {
  const isYin = stem % 2 === 1;
  const startBranch = YANG_CHANGSHENG[stem];

  if (isYin) {
    // 음간은 역행
    return ((startBranch - branch) % 12 + 12) % 12;
  } else {
    // 양간은 순행
    return ((branch - startBranch) % 12 + 12) % 12;
  }
}

export type TwelveStageInfo = {
  index: number;
  hanja: string;
  ko: string;
  meaning: string;
};

export function getTwelveStageInfo(stem: number, branch: number): TwelveStageInfo {
  const idx = getTwelveStage(stem, branch);
  return {
    index: idx,
    hanja: TWELVE_STAGES_HANJA[idx],
    ko: TWELVE_STAGES_KO[idx],
    meaning: TWELVE_STAGES_MEANING[idx],
  };
}

/* ══════════════════════════════════
   3. 신살 (Special Spirits / 神煞)
   ══════════════════════════════════ */

export type SinsalInfo = {
  name: string;
  hanja: string;
  type: 'good' | 'bad' | 'neutral';
  description: string;
};

// 천을귀인 (天乙貴人) - 일간 기준 지지
const CHEONUL_TABLE: Record<number, number[]> = {
  0: [1, 7],  // 甲 → 丑, 未
  1: [0, 8],  // 乙 → 子, 申
  2: [11, 9], // 丙 → 亥, 酉
  3: [11, 9], // 丁 → 亥, 酉
  4: [1, 7],  // 戊 → 丑, 未
  5: [0, 8],  // 己 → 子, 申
  6: [1, 7],  // 庚 → 丑, 未
  7: [2, 6],  // 辛 → 寅, 午
  8: [5, 3],  // 壬 → 巳, 卯
  9: [5, 3],  // 癸 → 巳, 卯
};

// 문창귀인 (文昌貴人) - 일간 기준
const MUNCHANG_TABLE: Record<number, number> = {
  0: 5, 1: 6, 2: 8, 3: 9, 4: 8, 5: 9, 6: 11, 7: 0, 8: 2, 9: 3,
};

// 역마살 (驛馬殺) - 일지 기준 (寅午戌→申, 巳酉丑→亥, 申子辰→寅, 亥卯未→巳)
function getYeokma(dayBranch: number): number {
  const group = [8, 11, 2, 5]; // 申亥寅巳
  if ([2, 6, 10].includes(dayBranch)) return 8;  // 寅午戌 → 申
  if ([5, 9, 1].includes(dayBranch)) return 11;  // 巳酉丑 → 亥
  if ([8, 0, 4].includes(dayBranch)) return 2;   // 申子辰 → 寅
  if ([11, 3, 7].includes(dayBranch)) return 5;  // 亥卯未 → 巳
  return group[0];
}

// 도화살 (桃花殺/咸池殺) - 일지 기준
function getDohwa(dayBranch: number): number {
  if ([2, 6, 10].includes(dayBranch)) return 3;  // 寅午戌 → 卯
  if ([5, 9, 1].includes(dayBranch)) return 6;   // 巳酉丑 → 午
  if ([8, 0, 4].includes(dayBranch)) return 9;   // 申子辰 → 酉
  if ([11, 3, 7].includes(dayBranch)) return 0;  // 亥卯未 → 子
  return 3;
}

// 화개살 (華蓋殺) - 일지 기준
function getHwagae(dayBranch: number): number {
  if ([2, 6, 10].includes(dayBranch)) return 10; // 寅午戌 → 戌
  if ([5, 9, 1].includes(dayBranch)) return 1;   // 巳酉丑 → 丑
  if ([8, 0, 4].includes(dayBranch)) return 4;   // 申子辰 → 辰
  if ([11, 3, 7].includes(dayBranch)) return 7;  // 亥卯未 → 未
  return 10;
}

export function analyzeSinsal(pillars: Pillar[]): SinsalInfo[] {
  const results: SinsalInfo[] = [];
  const dayMaster = pillars[2].stem; // 일간
  const dayBranch = pillars[2].branch; // 일지
  const allBranches = pillars.map(p => p.branch);

  // 천을귀인
  const cheonul = CHEONUL_TABLE[dayMaster] ?? [];
  for (const b of allBranches) {
    if (cheonul.includes(b)) {
      results.push({
        name: '천을귀인', hanja: '天乙貴人', type: 'good',
        description: '하늘이 내린 귀한 인연. 어려울 때 도움을 주는 귀인이 나타나며, 모든 흉살을 물리치는 가장 강력한 길신입니다.',
      });
      break;
    }
  }

  // 문창귀인
  const munchang = MUNCHANG_TABLE[dayMaster];
  if (munchang !== undefined && allBranches.includes(munchang)) {
    results.push({
      name: '문창귀인', hanja: '文昌貴人', type: 'good',
      description: '학문과 문서에 뛰어난 재능을 발휘합니다. 시험, 자격증, 글쓰기, 연구 분야에서 좋은 성과를 얻을 수 있습니다.',
    });
  }

  // 역마살
  const yeokma = getYeokma(dayBranch);
  if (allBranches.includes(yeokma)) {
    results.push({
      name: '역마살', hanja: '驛馬殺', type: 'neutral',
      description: '이동과 변화의 기운이 강합니다. 해외 출장, 이사, 여행이 잦을 수 있으며, 한곳에 머무르기보다 활동적인 삶을 살게 됩니다.',
    });
  }

  // 도화살
  const dohwa = getDohwa(dayBranch);
  if (allBranches.includes(dohwa)) {
    results.push({
      name: '도화살', hanja: '桃花殺', type: 'neutral',
      description: '매력과 이성 인연이 강합니다. 사교성이 뛰어나고 예술적 감각이 있으나, 이성 관계에서 복잡한 상황이 생길 수 있습니다.',
    });
  }

  // 화개살
  const hwagae = getHwagae(dayBranch);
  if (allBranches.includes(hwagae)) {
    results.push({
      name: '화개살', hanja: '華蓋殺', type: 'neutral',
      description: '학문, 예술, 종교, 철학에 깊은 관심과 재능이 있습니다. 고독을 즐기며 내면의 세계가 풍요롭습니다.',
    });
  }

  // 양인살 (羊刃殺) - 일간 기준, 록(祿)의 다음 지지
  const rokBranch = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]; // 각 천간의 록 지지
  const yanginBranch = (rokBranch[dayMaster] + 1) % 12;
  if (dayMaster % 2 === 0 && allBranches.includes(yanginBranch)) { // 양간만
    results.push({
      name: '양인살', hanja: '羊刃殺', type: 'bad',
      description: '강한 추진력과 승부욕이 있으나, 성급함과 충동적 행동에 주의가 필요합니다. 잘 다스리면 큰 성취를 이룰 수 있습니다.',
    });
  }

  // 록신 (祿神)
  if (allBranches.includes(rokBranch[dayMaster])) {
    results.push({
      name: '록신', hanja: '祿神', type: 'good',
      description: '안정적인 수입과 직위를 얻을 수 있는 기운입니다. 꾸준한 노력이 보상받으며 의식주에 부족함이 없습니다.',
    });
  }

  // 공망 (空亡) - 갑자순 기준
  const gapjaIdx = (pillars[2].stem + pillars[2].branch * 5) % 60; // 간략 계산
  const cycleStart = Math.floor(gapjaIdx / 10) * 10;
  const gongmang1 = (cycleStart + 10) % 12;
  const gongmang2 = (cycleStart + 11) % 12;
  const hasGongmang = allBranches.some(b => b === gongmang1 || b === gongmang2);
  if (hasGongmang) {
    results.push({
      name: '공망', hanja: '空亡', type: 'bad',
      description: '일부 영역에서 빈 곳이 존재합니다. 노력해도 결과가 허무할 수 있으나, 흉살을 무력화시키는 순기능도 있습니다.',
    });
  }

  // 결과가 없으면 기본 정보
  if (results.length === 0) {
    results.push({
      name: '평길', hanja: '平吉', type: 'good',
      description: '특별한 흉살 없이 평탄한 기운입니다. 큰 파란 없이 안정적인 삶을 살아갈 수 있습니다.',
    });
  }

  return results;
}

/* ══════════════════════════════════
   4. 형충파합해 (刑沖破合害)
   ══════════════════════════════════ */

export type InteractionInfo = {
  type: '합' | '충' | '형' | '파' | '해';
  hanja: string;
  pillar1: string;
  pillar2: string;
  branch1Ko: string;
  branch2Ko: string;
  description: string;
  isGood: boolean;
};

// 육합 (六合)
const YUKAP: [number, number][] = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
// 충 (沖)
const CHUNG: [number, number][] = [[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]];
// 형 (刑)
const HYUNG: [number, number][] = [[2,5],[5,8],[8,2],[1,10],[10,7],[7,1],[4,4],[6,6],[9,9],[11,11]];
// 해 (害)
const HAE: [number, number][] = [[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];

export function analyzeInteractions(pillars: Pillar[]): InteractionInfo[] {
  const results: InteractionInfo[] = [];
  const labels = ['연주', '월주', '일주', '시주'];

  for (let i = 0; i < pillars.length; i++) {
    for (let j = i + 1; j < pillars.length; j++) {
      const b1 = pillars[i].branch;
      const b2 = pillars[j].branch;

      // 합
      for (const [a, b] of YUKAP) {
        if ((b1 === a && b2 === b) || (b1 === b && b2 === a)) {
          results.push({
            type: '합', hanja: '合', pillar1: labels[i], pillar2: labels[j],
            branch1Ko: EARTHLY_BRANCHES_KO[b1], branch2Ko: EARTHLY_BRANCHES_KO[b2],
            description: `${labels[i]}와 ${labels[j]}가 합(合)을 이루어 조화로운 에너지가 흐릅니다.`,
            isGood: true,
          });
        }
      }

      // 충
      for (const [a, b] of CHUNG) {
        if ((b1 === a && b2 === b) || (b1 === b && b2 === a)) {
          results.push({
            type: '충', hanja: '沖', pillar1: labels[i], pillar2: labels[j],
            branch1Ko: EARTHLY_BRANCHES_KO[b1], branch2Ko: EARTHLY_BRANCHES_KO[b2],
            description: `${labels[i]}와 ${labels[j]}가 충(沖)하여 변화와 갈등의 에너지가 있습니다.`,
            isGood: false,
          });
        }
      }

      // 형
      for (const [a, b] of HYUNG) {
        if (b1 === a && b2 === b) {
          results.push({
            type: '형', hanja: '刑', pillar1: labels[i], pillar2: labels[j],
            branch1Ko: EARTHLY_BRANCHES_KO[b1], branch2Ko: EARTHLY_BRANCHES_KO[b2],
            description: `${labels[i]}와 ${labels[j]} 사이에 형(刑)이 있어 시련과 극복의 에너지가 있습니다.`,
            isGood: false,
          });
        }
      }

      // 해
      for (const [a, b] of HAE) {
        if ((b1 === a && b2 === b) || (b1 === b && b2 === a)) {
          results.push({
            type: '해', hanja: '害', pillar1: labels[i], pillar2: labels[j],
            branch1Ko: EARTHLY_BRANCHES_KO[b1], branch2Ko: EARTHLY_BRANCHES_KO[b2],
            description: `${labels[i]}와 ${labels[j]}가 해(害)하여 은근한 방해와 갈등이 있을 수 있습니다.`,
            isGood: false,
          });
        }
      }
    }
  }

  return results;
}

/* ══════════════════════════════════
   5. 대운 (Grand Luck Cycles / 大運)
   ══════════════════════════════════ */

export type DaeunCycle = {
  startAge: number;
  stem: number;
  branch: number;
  stemHanja: string;
  branchHanja: string;
  stemKo: string;
  branchKo: string;
  tenGod: TenGodInfo;
  twelveStage: TwelveStageInfo;
  element: number;
  interpretation: string;
};

/**
 * 대운 계산
 * 남자 양년생/여자 음년생 = 순행, 남자 음년생/여자 양년생 = 역행
 */
export function calculateDaeun(
  saju: SajuResult,
  gender: string,
  birthYear: number,
): DaeunCycle[] {
  const yearStemYang = saju.yearPillar.stem % 2 === 0;
  const isMale = gender === 'male';
  const isForward = (isMale && yearStemYang) || (!isMale && !yearStemYang);

  const monthStem = saju.monthPillar.stem;
  const monthBranch = saju.monthPillar.branch;
  const dayMaster = saju.dayPillar.stem;

  // 대운 시작 나이 (간략: 통상 3~8세 사이, 여기서는 간략하게 계산)
  const startAge = (birthYear % 3) + 3; // 간략 근사

  const cycles: DaeunCycle[] = [];
  for (let i = 0; i < 8; i++) {
    const offset = (i + 1) * (isForward ? 1 : -1);
    const stem = ((monthStem + offset) % 10 + 10) % 10;
    const branch = ((monthBranch + offset) % 12 + 12) % 12;
    const age = startAge + i * 10;

    const tenGod = getTenGodInfo(dayMaster, stem);
    const twelveStage = getTwelveStageInfo(dayMaster, branch);
    const element = STEM_TO_ELEMENT[stem];

    const interpretation = getDaeunInterpretation(tenGod, twelveStage, age);

    cycles.push({
      startAge: age,
      stem, branch,
      stemHanja: HEAVENLY_STEMS[stem],
      branchHanja: EARTHLY_BRANCHES[branch],
      stemKo: HEAVENLY_STEMS_KO[stem],
      branchKo: EARTHLY_BRANCHES_KO[branch],
      tenGod, twelveStage, element,
      interpretation,
    });
  }

  return cycles;
}

function getDaeunInterpretation(tenGod: TenGodInfo, stage: TwelveStageInfo, age: number): string {
  const godTexts: Record<string, string> = {
    '비견': '자립심과 독립 의지가 강해지는 시기입니다. 동업이나 경쟁 환경에서 자신의 능력을 증명할 기회가 찾아옵니다.',
    '겁재': '추진력은 강하지만 재물 관리에 주의가 필요한 시기입니다. 투자보다 실력 축적에 집중하세요.',
    '식신': '창의력과 표현력이 빛나는 시기입니다. 식복이 좋아지며 자녀운에도 긍정적입니다. 문화, 예술 활동에 좋습니다.',
    '상관': '재능이 폭발하지만 기존 질서와 충돌할 수 있습니다. 자유업이나 프리랜서 활동에 유리하나 직장인은 상사와의 갈등 주의.',
    '편재': '재물운이 활발해지고 투자 기회가 늘어납니다. 부업이나 사업 기회가 보이나 과욕은 금물입니다.',
    '정재': '안정적인 재물 축적의 시기입니다. 꾸준한 저축과 내실 다지기에 좋으며, 남성은 좋은 배우자 인연이 있을 수 있습니다.',
    '편관': '도전과 변화가 많은 시기입니다. 직장 변동이나 새로운 환경에 놓일 수 있으며, 건강 관리에 신경 써야 합니다.',
    '정관': '명예와 직위가 상승하는 시기입니다. 승진, 합격, 사회적 인정을 받을 수 있으며, 여성은 좋은 배우자 인연이 있습니다.',
    '편인': '학문과 특수 기술에 몰두하기 좋은 시기입니다. 자격증 취득, 전문성 강화에 유리하나 현실적 수입은 불안정할 수 있습니다.',
    '정인': '후원자의 도움과 학문적 성취가 기대되는 시기입니다. 안정적인 환경에서 내실을 다지며 어머니 또는 스승의 도움이 있습니다.',
  };

  const stageBonus = stage.index <= 4
    ? ' 에너지가 상승하는 시기로 적극적인 활동이 좋습니다.'
    : stage.index <= 8
    ? ' 에너지를 절약하고 내실을 다지는 지혜가 필요합니다.'
    : ' 새로운 준비와 재충전의 시기입니다.';

  return (godTexts[tenGod.ko] ?? '') + stageBonus;
}

/* ══════════════════════════════════
   6. 세운 (Yearly Luck / 歲運)
   ══════════════════════════════════ */

export type SeunInfo = {
  year: number;
  stem: number;
  branch: number;
  stemHanja: string;
  branchHanja: string;
  tenGod: TenGodInfo;
  quality: 'excellent' | 'good' | 'neutral' | 'caution' | 'difficult';
  summary: string;
};

export function calculateSeun(dayMasterStem: number, startYear: number, count: number): SeunInfo[] {
  const results: SeunInfo[] = [];

  for (let i = 0; i < count; i++) {
    const year = startYear + i;
    const idx60 = ((year - 4) % 60 + 60) % 60;
    const stem = idx60 % 10;
    const branch = idx60 % 12;
    const tenGod = getTenGodInfo(dayMasterStem, stem);

    // 길흉 판단 (십신 기반 간략 판단)
    let quality: SeunInfo['quality'];
    let summary: string;

    switch (tenGod.ko) {
      case '정재': case '정관': case '정인':
        quality = 'excellent';
        summary = `${tenGod.ko}의 해로 안정과 성취가 기대됩니다. 중요한 결정에 좋은 시기입니다.`;
        break;
      case '식신': case '편재':
        quality = 'good';
        summary = `${tenGod.ko}의 해로 활발한 활동과 기회가 많습니다. 적극적으로 움직이세요.`;
        break;
      case '비견': case '편인':
        quality = 'neutral';
        summary = `${tenGod.ko}의 해로 자기 성장에 집중하기 좋습니다. 내실을 다지는 시간입니다.`;
        break;
      case '겁재': case '상관':
        quality = 'caution';
        summary = `${tenGod.ko}의 해로 변화가 많을 수 있습니다. 신중하게 판단하고 충동적 행동을 자제하세요.`;
        break;
      case '편관':
        quality = 'difficult';
        summary = `${tenGod.ko}의 해로 도전과 시련이 있을 수 있습니다. 건강관리와 안전에 각별히 주의하세요.`;
        break;
      default:
        quality = 'neutral';
        summary = '평탄한 한 해가 예상됩니다.';
    }

    results.push({
      year, stem, branch,
      stemHanja: HEAVENLY_STEMS[stem],
      branchHanja: EARTHLY_BRANCHES[branch],
      tenGod, quality, summary,
    });
  }

  return results;
}

/* ══════════════════════════════════
   7. 용신 (Beneficial Element / 用神)
   ══════════════════════════════════ */

export type YongshinInfo = {
  element: number;
  elementName: string;
  elementHanja: string;
  color: string;
  direction: string;
  description: string;
  supplement: string;
};

const ELEMENT_DIRECTIONS = ['동쪽', '남쪽', '중앙', '서쪽', '북쪽'];
const ELEMENT_HANJA_ARR = ['木', '火', '土', '金', '水'];

export function determineYongshin(saju: SajuResult): YongshinInfo {
  const counts = saju.fiveElementCounts;
  const dominant = saju.dominantElement;

  // 용신 = 일간의 균형을 맞추는 오행
  // 간략 로직: 가장 약한 오행 or 일간을 생(生)해주는 오행
  const dayElement = STEM_TO_ELEMENT[saju.dayPillar.stem];

  // 나를 생해주는 오행 (인성 오행)
  const myInElement = ((dayElement - 1) % 5 + 5) % 5;
  // 내가 극하는 오행 (재성 오행)
  const myWealthElement = ((dayElement + 2) % 5 + 5) % 5;

  // 일간이 약하면(주변에 비겁/인성이 적으면) → 인성 오행이 용신
  // 일간이 강하면(비겁이 많으면) → 식상이나 재성 오행이 용신
  const selfStrength = counts[dayElement] + counts[myInElement];
  const totalOthers = counts.reduce((a, b) => a + b, 0) - selfStrength;

  let yongshinElement: number;
  if (selfStrength > totalOthers) {
    // 신강(身强) → 설기(泄氣)가 필요 → 식상 or 재성
    yongshinElement = myWealthElement;
  } else {
    // 신약(身弱) → 생조(生助)가 필요 → 인성
    yongshinElement = myInElement;
  }

  const elementName = FIVE_ELEMENTS_NAME[yongshinElement];
  const descriptions: Record<number, string> = {
    0: '목(木)의 기운이 당신에게 필요합니다. 성장, 확장, 새로운 시작의 에너지를 보충하면 삶의 균형이 잡힙니다.',
    1: '화(火)의 기운이 당신에게 필요합니다. 열정, 표현력, 밝은 에너지를 보충하면 운이 트입니다.',
    2: '토(土)의 기운이 당신에게 필요합니다. 안정, 신뢰, 중심을 잡는 에너지가 당신의 균형을 맞춰줍니다.',
    3: '금(金)의 기운이 당신에게 필요합니다. 결단력, 정리, 명확함의 에너지가 당신을 더 강하게 만듭니다.',
    4: '수(水)의 기운이 당신에게 필요합니다. 지혜, 유연함, 적응력의 에너지가 당신의 삶을 풍요롭게 합니다.',
  };

  const supplements: Record<number, string> = {
    0: '녹색 옷이나 소품 활용, 동쪽 방향 선호, 나무 소재 인테리어, 산림욕이나 등산 추천',
    1: '붉은색·보라색 활용, 남쪽 방향 선호, 따뜻한 조명, 활동적인 운동 추천',
    2: '노란색·갈색 활용, 안정적인 환경 조성, 도자기나 돌 소재 인테리어, 규칙적인 생활 추천',
    3: '흰색·은색 활용, 서쪽 방향 선호, 금속 액세서리, 체계적인 정리정돈 추천',
    4: '검정·파란색 활용, 북쪽 방향 선호, 수족관이나 분수, 명상이나 수영 추천',
  };

  return {
    element: yongshinElement,
    elementName,
    elementHanja: ELEMENT_HANJA_ARR[yongshinElement],
    color: FIVE_ELEMENTS_COLOR[yongshinElement],
    direction: ELEMENT_DIRECTIONS[yongshinElement],
    description: descriptions[yongshinElement] ?? '',
    supplement: supplements[yongshinElement] ?? '',
  };
}

/* ══════════════════════════════════
   8. 통합 고급 분석 결과
   ══════════════════════════════════ */

export type AdvancedSajuResult = {
  // 각 주의 십신
  tenGods: {
    year: TenGodInfo;
    month: TenGodInfo;
    day: TenGodInfo; // 비견 (자기자신)
    time: TenGodInfo;
  };
  // 각 주의 12운성
  twelveStages: {
    year: TwelveStageInfo;
    month: TwelveStageInfo;
    day: TwelveStageInfo;
    time: TwelveStageInfo;
  };
  // 신살
  sinsal: SinsalInfo[];
  // 형충파합해
  interactions: InteractionInfo[];
  // 대운
  daeun: DaeunCycle[];
  // 세운 (올해부터 5년)
  seun: SeunInfo[];
  // 용신
  yongshin: YongshinInfo;
  // 일간 강약
  dayMasterStrength: 'strong' | 'weak' | 'balanced';
  dayMasterDesc: string;
};

export function analyzeAdvancedSaju(
  saju: SajuResult,
  gender: string,
  birthYear: number,
  birthTime: number,
): AdvancedSajuResult {
  const dayMaster = saju.dayPillar.stem;
  const pillars = birthTime >= 0
    ? [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.timePillar]
    : [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.timePillar];

  // 십신
  const tenGods = {
    year: getTenGodInfo(dayMaster, saju.yearPillar.stem),
    month: getTenGodInfo(dayMaster, saju.monthPillar.stem),
    day: { index: 0, hanja: '比肩', ko: '비견 (본인)', meaning: '자기 자신, 일간의 기준점' },
    time: getTenGodInfo(dayMaster, saju.timePillar.stem),
  };

  // 12운성
  const twelveStages = {
    year: getTwelveStageInfo(dayMaster, saju.yearPillar.branch),
    month: getTwelveStageInfo(dayMaster, saju.monthPillar.branch),
    day: getTwelveStageInfo(dayMaster, saju.dayPillar.branch),
    time: getTwelveStageInfo(dayMaster, saju.timePillar.branch),
  };

  // 신살
  const sinsal = analyzeSinsal(pillars);

  // 형충파합해
  const interactions = analyzeInteractions(pillars);

  // 대운
  const daeun = calculateDaeun(saju, gender, birthYear);

  // 세운
  const currentYear = new Date().getFullYear();
  const seun = calculateSeun(dayMaster, currentYear, 5);

  // 용신
  const yongshin = determineYongshin(saju);

  // 일간 강약
  const dayElement = STEM_TO_ELEMENT[dayMaster];
  const myInElement = ((dayElement - 1) % 5 + 5) % 5;
  const selfStr = saju.fiveElementCounts[dayElement] + saju.fiveElementCounts[myInElement];
  const total = saju.fiveElementCounts.reduce((a, b) => a + b, 0);
  const ratio = selfStr / total;

  let dayMasterStrength: 'strong' | 'weak' | 'balanced';
  let dayMasterDesc: string;
  if (ratio > 0.55) {
    dayMasterStrength = 'strong';
    dayMasterDesc = `신강(身强)한 사주입니다. 자아가 강하고 독립심이 뛰어나며, 자기 주장이 분명합니다. ${yongshin.elementName}(${yongshin.elementHanja})의 기운으로 에너지를 적절히 분산시키면 더욱 좋은 운을 만들 수 있습니다.`;
  } else if (ratio < 0.35) {
    dayMasterStrength = 'weak';
    dayMasterDesc = `신약(身弱)한 사주입니다. 섬세하고 배려심이 깊으며, 주변 환경의 영향을 많이 받습니다. ${yongshin.elementName}(${yongshin.elementHanja})의 기운으로 자신의 에너지를 보충하면 운이 크게 상승합니다.`;
  } else {
    dayMasterStrength = 'balanced';
    dayMasterDesc = `중화(中和)에 가까운 균형 잡힌 사주입니다. 유연하게 상황에 대처하는 능력이 뛰어나며, 다양한 분야에서 성과를 낼 수 있습니다.`;
  }

  return {
    tenGods, twelveStages, sinsal, interactions,
    daeun, seun, yongshin,
    dayMasterStrength, dayMasterDesc,
  };
}
