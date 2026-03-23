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
  const gapjaIdx = ((6 * pillars[2].stem - 5 * pillars[2].branch) % 60 + 60) % 60;
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
const HYUNG: [number, number][] = [[2,5],[5,8],[8,2],[1,10],[10,7],[7,1],[0,3],[3,0],[4,4],[6,6],[9,9],[11,11]];
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
  birthMonth: number = 1,
  birthDay: number = 1,
): DaeunCycle[] {
  const yearStemYang = saju.yearPillar.stem % 2 === 0;
  const isMale = gender === 'male';
  const isForward = (isMale && yearStemYang) || (!isMale && !yearStemYang);

  const monthStem = saju.monthPillar.stem;
  const monthBranch = saju.monthPillar.branch;
  const dayMaster = saju.dayPillar.stem;

  // 대운 시작 나이: 생일 → 다음(순행)/이전(역행) 절기까지 일수 ÷ 3
  const JEOLGI_DATES = [
    [2, 4], [3, 6], [4, 5], [5, 6], [6, 6], [7, 7],
    [8, 7], [9, 8], [10, 8], [11, 7], [12, 7], [1, 6],
  ]; // 입춘~소한 절기 시작일 (양력 근사)

  let minDays = 365;
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
  for (const [jm, jd] of JEOLGI_DATES) {
    // 같은 해 + 다음 해 절기 모두 확인
    for (const yOffset of [0, 1, -1]) {
      const jeolgiDate = new Date(birthYear + yOffset, jm - 1, jd);
      const diff = Math.round((jeolgiDate.getTime() - birthDate.getTime()) / 86400000);
      if (isForward && diff > 0 && diff < minDays) minDays = diff;
      if (!isForward && diff < 0 && Math.abs(diff) < minDays) minDays = Math.abs(diff);
    }
  }
  const startAge = Math.max(1, Math.round(minDays / 3));

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

/* ══════════════════════════════════
   십신 기반 성격/적성/재물운 해석
   ══════════════════════════════════ */

export type TenGodAnalysis = {
  personality: string;
  aptitude: string;
  wealth: string;
};

/** 사주 전체의 십신 분포를 분석하여 성격/적성/재물운 해석 */
export function analyzeTenGodProfile(
  dayMasterStem: number,
  pillars: Pillar[],
  strength: 'strong' | 'weak' | 'balanced',
): TenGodAnalysis {
  // 각 주의 천간에서 십신 분포를 계산
  const tenGodCounts = new Array(10).fill(0);
  for (const p of pillars) {
    if (p.stem === dayMasterStem) {
      tenGodCounts[0]++; // 비견
    } else {
      const idx = getTenGod(dayMasterStem, p.stem);
      tenGodCounts[idx]++;
    }
  }
  // 지지의 본기(本氣)에서도 십신 카운트
  const BRANCH_MAIN_STEM = [9, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8]; // 자축인묘진사오미신유술해
  for (const p of pillars) {
    const branchStem = BRANCH_MAIN_STEM[p.branch];
    if (branchStem === dayMasterStem) {
      tenGodCounts[0]++;
    } else {
      const idx = getTenGod(dayMasterStem, branchStem);
      tenGodCounts[idx]++;
    }
  }

  // 그룹별 합산: 비겁(0,1), 식상(2,3), 재성(4,5), 관성(6,7), 인성(8,9)
  const bigyeop = tenGodCounts[0] + tenGodCounts[1];
  const siksang = tenGodCounts[2] + tenGodCounts[3];
  const jaesung = tenGodCounts[4] + tenGodCounts[5];
  const gwansung = tenGodCounts[6] + tenGodCounts[7];
  const insung = tenGodCounts[8] + tenGodCounts[9];

  // 가장 강한 십신 그룹 결정
  const groups = [
    { name: '비겁', count: bigyeop },
    { name: '식상', count: siksang },
    { name: '재성', count: jaesung },
    { name: '관성', count: gwansung },
    { name: '인성', count: insung },
  ];
  const sorted = [...groups].sort((a, b) => b.count - a.count);
  const dominant = sorted[0].name;
  const secondary = sorted[1].name;

  // ── 성격 해석 ──
  const personalityMap: Record<string, string> = {
    '비겁': '자아가 강하고 독립심이 뛰어납니다. 주도적으로 일을 이끌어가는 성격으로, 자기 확신이 강합니다. 경쟁 상황에서 빛을 발하며, 동료나 형제와의 관계에서 리더 역할을 자연스럽게 맡게 됩니다. 다만 고집이 세다는 평가를 받을 수 있으니 타인의 의견에도 귀 기울이는 노력이 필요합니다.',
    '식상': '창의력과 표현력이 뛰어나며, 예술적 감각이 남다릅니다. 새로운 아이디어를 끊임없이 내놓고, 자유로운 사고방식을 가지고 있습니다. 말재주가 좋고 사교적이며, 식복(食福)이 있어 먹는 것에 관심이 많습니다. 감정이 풍부하고 섬세한 성격입니다.',
    '재성': '현실적이고 실용적인 성격입니다. 재물에 대한 감각이 뛰어나고 경제관념이 확실합니다. 부지런하고 성실하며, 목표를 향해 꾸준히 노력하는 타입입니다. 인간관계에서도 실리를 중시하며, 가정을 소중히 여기는 성격입니다.',
    '관성': '책임감이 강하고 원칙을 중시합니다. 조직 내에서 질서를 유지하는 역할을 잘 수행하며, 규율과 예절을 중요하게 생각합니다. 명예와 사회적 평판에 민감하며, 자기 절제력이 뛰어납니다. 다만 지나친 완벽주의는 스트레스의 원인이 될 수 있습니다.',
    '인성': '학구적이고 지식에 대한 욕구가 강합니다. 깊이 있는 사고를 좋아하며, 연구나 학문 분야에서 두각을 나타냅니다. 어머니나 스승의 영향을 많이 받으며, 자비롭고 포용력이 넓습니다. 내성적인 면이 있으나 신뢰받는 성격입니다.',
  };

  // ── 적성 해석 ──
  const aptitudeMap: Record<string, Record<string, string>> = {
    '비겁': {
      strong: '리더십이 뛰어나 경영, 스포츠, 프리랜서, 자영업 분야에서 성공할 수 있습니다. 독립적으로 일할 수 있는 환경이 적합하며, 경쟁이 치열한 분야에서 두각을 나타냅니다. 군인, 운동선수, 벤처 창업 등이 어울립니다.',
      weak: '협력과 팀워크를 통해 성장하는 환경이 좋습니다. 파트너십 기반의 사업이나 공동 프로젝트에서 능력을 발휘합니다. 컨설팅, 중개, 협상 관련 직종이 적합합니다.',
      balanced: '조직 내에서도 개인 역량을 발휘할 수 있는 위치가 적합합니다. 팀 리더, 프로젝트 매니저, 코치 등 리더십과 협업이 모두 필요한 역할이 어울립니다.',
    },
    '식상': {
      strong: '예술, 엔터테인먼트, 교육, 요리, 작가, 유튜버 등 창작 분야에서 성공할 가능성이 높습니다. 자유롭게 표현할 수 있는 환경이 필요하며, 정형화된 조직보다 자유업이 적합합니다.',
      weak: '기술적 전문성을 갖춘 분야가 좋습니다. IT 개발, 디자인, 마케팅 등 창의성과 기술이 결합된 직종에서 안정적으로 능력을 발휘합니다.',
      balanced: '창의적이면서도 실용적인 분야가 적합합니다. 광고, UX디자인, 기획, 콘텐츠 제작 등 아이디어와 실행력이 모두 필요한 직종이 어울립니다.',
    },
    '재성': {
      strong: '금융, 부동산, 무역, 유통, 사업 분야에서 성공할 수 있습니다. 재물 감각이 뛰어나 투자나 자산 관리에 재능이 있습니다. 회계사, 세무사, 은행원, 무역상 등이 적합합니다.',
      weak: '안정적인 수입이 보장되는 공무원, 대기업, 연구직 등이 적합합니다. 재물보다 전문성을 키우는 데 집중하면 자연스럽게 경제적 안정도 따라옵니다.',
      balanced: '재무와 전문성을 동시에 활용하는 분야가 좋습니다. 경영 컨설턴트, 자산운용사, 스타트업 경영 등이 어울립니다.',
    },
    '관성': {
      strong: '공무원, 법조인, 군인, 경찰, 관리직 등 조직적이고 체계적인 분야에서 성공합니다. 명예와 직위를 추구하는 성향이 있어 정치나 행정 분야도 적합합니다.',
      weak: '자유로운 환경에서 일하는 것이 좋습니다. 창업, 프리랜서, 예술 분야 등 규제가 적은 직종이 적합하며, 자기만의 페이스로 일할 수 있는 환경을 찾으세요.',
      balanced: '조직 내에서 전문성을 갖춘 위치가 적합합니다. 전문직(의사, 변호사, 교수), 기업 내 전문가 등이 어울립니다.',
    },
    '인성': {
      strong: '교육, 연구, 학문, 종교, 철학 분야에서 성공할 수 있습니다. 지식을 전달하는 직업이 적합하며, 교사, 교수, 연구원, 작가, 상담사 등이 어울립니다.',
      weak: '실전 경험을 통해 성장하는 분야가 좋습니다. 영업, 마케팅, 서비스업 등 현장에서 직접 부딪히며 배울 수 있는 직종이 적합합니다.',
      balanced: '이론과 실전을 겸비한 분야가 적합합니다. 변리사, 감정평가사, 통역사 등 전문 지식과 실무 능력이 모두 필요한 직종이 어울립니다.',
    },
  };

  // ── 재물운 해석 ──
  const wealthMap: Record<string, Record<string, string>> = {
    '비겁': {
      strong: '재물에 대한 경쟁심이 강하여 적극적으로 돈을 벌지만, 지출도 과감합니다. 독립 사업이나 투자에서 큰 수익을 올릴 수 있으나, 동업은 재물 분쟁의 원인이 될 수 있으니 주의하세요. 개인 사업이 가장 적합합니다.',
      weak: '재물은 꾸준히 들어오나 크게 불어나기 어렵습니다. 저축과 절약을 통해 자산을 늘리는 전략이 좋으며, 안정적인 투자(예금, 채권)가 적합합니다.',
      balanced: '균형 잡힌 재물운입니다. 적절한 투자와 저축의 조화로 꾸준히 자산을 불릴 수 있습니다. 분산 투자 전략이 유효합니다.',
    },
    '식상': {
      strong: '창의적인 방법으로 돈을 버는 재능이 있습니다. 콘텐츠 제작, 특허, 저작권 등 지식재산을 통한 수익이 유리합니다. 재물이 들어왔다 나가는 패턴이 있으니 관리가 중요합니다.',
      weak: '기술이나 전문성을 통한 안정적 수입이 중요합니다. 부업보다는 본업에 집중하여 전문성을 높이면 자연스럽게 수입이 증가합니다.',
      balanced: '다양한 수입원을 만들 수 있는 재물운입니다. 본업 외에 부업이나 투자를 통해 복합적인 수익 구조를 만들어보세요.',
    },
    '재성': {
      strong: '타고난 재물운이 강합니다. 돈을 다루는 감각이 뛰어나고, 재테크에 소질이 있습니다. 부동산, 주식, 사업 등 다양한 방면에서 재물을 모을 수 있습니다. 다만 과욕은 금물이며, 분수에 맞는 투자가 중요합니다.',
      weak: '재물이 잘 모이지 않는 구조이지만, 인성(학문)이나 관성(직장)을 통해 간접적으로 재물을 얻을 수 있습니다. 전문 자격증 취득이나 직위 상승을 통한 수입 증가를 추구하세요.',
      balanced: '무리하지 않으면 안정적인 재물운입니다. 급격한 부의 증가보다 꾸준한 축적이 적합하며, 장기 투자가 좋은 결과를 가져옵니다.',
    },
    '관성': {
      strong: '직장이나 조직을 통한 안정적인 수입이 주된 재물 루트입니다. 승진과 함께 수입이 늘어나는 구조이며, 사업보다는 봉직이 더 유리합니다. 퇴직 후를 위한 연금이나 장기 저축을 추천합니다.',
      weak: '자유로운 방법으로 재물을 모을 수 있습니다. 프리랜서, 자영업, 온라인 비즈니스 등 자기 주도적 수입원이 유리합니다.',
      balanced: '안정적인 직장 수입과 부업 수입을 병행하면 좋습니다. 전문성을 활용한 컨설팅이나 강의 등 추가 수입원을 만들어보세요.',
    },
    '인성': {
      strong: '재물보다 명예와 학문에 집중하는 경향이 있어, 직접적 재물운은 약할 수 있습니다. 하지만 전문 지식이나 자격을 통한 안정적 수입이 가능합니다. 교육, 출판, 연구 분야에서의 수입이 주된 재물 루트입니다.',
      weak: '현실적 재물 감각을 키울 필요가 있습니다. 재테크 공부를 통해 재물 관리 능력을 향상시키면 운이 상승합니다.',
      balanced: '지식과 재물의 균형이 좋습니다. 전문 지식을 활용한 사업이나 컨설팅이 재물 증식에 효과적입니다.',
    },
  };

  const personality = (personalityMap[dominant] ?? personalityMap['비겁'])
    + ` 보조적으로 ${secondary === dominant ? '비겁' : secondary}의 성향도 가지고 있어, `
    + (secondary === '식상' ? '창의적 표현에도 능합니다.' :
       secondary === '재성' ? '현실적 감각도 갖추고 있습니다.' :
       secondary === '관성' ? '사회적 책임감도 강합니다.' :
       secondary === '인성' ? '학구적인 면모도 있습니다.' :
       '자기 주도적인 면모도 있습니다.');

  const aptitude = aptitudeMap[dominant]?.[strength] ?? aptitudeMap['비겁']['balanced'];
  const wealth = wealthMap[dominant]?.[strength] ?? wealthMap['비겁']['balanced'];

  return { personality, aptitude, wealth };
}

export type AdvancedSajuResult = {
  // 각 주의 십신
  tenGods: {
    year: TenGodInfo;
    month: TenGodInfo;
    day: TenGodInfo; // 비견 (자기자신)
    time: TenGodInfo | null;
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
  // 십신 기반 심층 해석
  tenGodAnalysis: TenGodAnalysis;
};

export function analyzeAdvancedSaju(
  saju: SajuResult,
  gender: string,
  birthYear: number,
  birthTime: number,
): AdvancedSajuResult {
  const dayMaster = saju.dayPillar.stem;
  const hasTime = birthTime >= 0;
  const pillars = hasTime
    ? [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.timePillar]
    : [saju.yearPillar, saju.monthPillar, saju.dayPillar];

  // 십신
  const tenGods = {
    year: getTenGodInfo(dayMaster, saju.yearPillar.stem),
    month: getTenGodInfo(dayMaster, saju.monthPillar.stem),
    day: { index: 0, hanja: '比肩', ko: '비견 (본인)', meaning: '자기 자신, 일간의 기준점' },
    time: hasTime ? getTenGodInfo(dayMaster, saju.timePillar.stem) : null,
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

  // 십신 기반 성격/적성/재물운 심층 분석
  const tenGodAnalysis = analyzeTenGodProfile(dayMaster, pillars, dayMasterStrength);

  return {
    tenGods, twelveStages, sinsal, interactions,
    daeun, seun, yongshin,
    dayMasterStrength, dayMasterDesc,
    tenGodAnalysis,
  };
}
