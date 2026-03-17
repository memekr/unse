/**
 * product-keywords.ts — 운세 결과를 상품 검색 키워드로 변환
 *
 * 행운 컬러, 오행, 타로 카드, 별자리 등의 운세 결과를
 * 쿠팡/네이버 검색에 적합한 키워드로 매핑합니다.
 */

/** 행운 컬러 → 상품 키워드 */
export const COLOR_KEYWORDS: Record<string, string[]> = {
  빨강: ['빨간색 액세서리', '레드 패션', '루비 팔찌'],
  주황: ['오렌지 소품', '주황 머그컵', '카넬리안 팔찌'],
  노랑: ['옐로우 액세서리', '골드 소품', '시트린 팔찌'],
  초록: ['그린 소품', '에메랄드 액세서리', '녹색 인테리어'],
  파랑: ['블루 액세서리', '사파이어 팔찌', '파란색 소품'],
  남색: ['네이비 패션', '남색 지갑', '라피스라줄리'],
  보라: ['퍼플 소품', '자수정 팔찌', '보라색 액세서리'],
  분홍: ['핑크 소품', '로즈쿼츠 팔찌', '분홍색 액세서리'],
  하양: ['화이트 소품', '문스톤 팔찌', '흰색 인테리어'],
  검정: ['블랙 패션', '흑요석 팔찌', '블랙 액세서리'],
  금색: ['골드 액세서리', '금색 소품', '황금 팔찌'],
  은색: ['실버 액세서리', '은색 소품', '실버 팔찌'],
};

/** 오행 → 상품 키워드 (인덱스: 0=목, 1=화, 2=토, 3=금, 4=수) */
export const ELEMENT_KEYWORDS: Record<string | number, string[]> = {
  목: ['나무 소품', '그린 인테리어', '식물 화분', '원목 소품'],
  화: ['캔들 세트', '레드 소품', '아로마 디퓨저', '붉은 팔찌'],
  토: ['도자기 소품', '크리스탈 장식', '황토 용품', '옐로우 소품'],
  금: ['실버 액세서리', '골드 팔찌', '메탈 소품', '금속 인테리어'],
  수: ['블루 소품', '미니 분수', '아쿠아마린', '물방울 인테리어'],
  // 숫자 인덱스 매핑
  0: ['나무 소품', '그린 인테리어', '식물 화분', '원목 소품'],
  1: ['캔들 세트', '레드 소품', '아로마 디퓨저', '붉은 팔찌'],
  2: ['도자기 소품', '크리스탈 장식', '황토 용품', '옐로우 소품'],
  3: ['실버 액세서리', '골드 팔찌', '메탈 소품', '금속 인테리어'],
  4: ['블루 소품', '미니 분수', '아쿠아마린', '물방울 인테리어'],
};

/** 타로 메이저 아르카나 → 상품 키워드 */
export const TAROT_KEYWORDS: Record<string, string[]> = {
  바보: ['여행용 배낭', '모험 소품', '자유 컨셉 액세서리'],
  마법사: ['크리스탈볼', '명상 용품', '타로카드 세트'],
  여사제: ['문스톤 액세서리', '보라색 소품', '명상 쿠션'],
  여황제: ['로즈 골드 액세서리', '플라워 소품', '핑크 인테리어'],
  황제: ['레드 소품', '리더십 서적', '파워스톤 팔찌'],
  교황: ['명상 서적', '인센스 스틱', '힐링 소품'],
  연인: ['커플 액세서리', '로즈쿼츠', '하트 소품'],
  전차: ['스포츠 용품', '액티브 액세서리', '레드 팔찌'],
  힘: ['파워스톤', '호랑이눈석', '골드 액세서리'],
  은둔자: ['명상 용품', '아로마 오일', '독서등'],
  운명의수레바퀴: ['행운의 팔찌', '포춘 소품', '럭키참'],
  정의: ['밸런스 소품', '블루 액세서리', '저울 인테리어'],
  매달린남자: ['요가 매트', '명상 쿠션', '힐링 서적'],
  죽음: ['블랙 소품', '변화 다이어리', '흑요석 팔찌'],
  절제: ['티 세트', '아로마 디퓨저', '힐링 소품'],
  악마: ['보호 부적', '흑요석', '블랙투르말린'],
  탑: ['크리스탈', '보호석 팔찌', '인테리어 소품'],
  별: ['별 모양 소품', '아쿠아마린', '네이비 액세서리'],
  달: ['문스톤', '달 모양 인테리어', '실버 액세서리'],
  태양: ['골드 액세서리', '시트린', '옐로우 소품'],
  심판: ['명상 종', '클렌징 세이지', '힐링 크리스탈'],
  세계: ['세계지도 소품', '여행 액세서리', '글로브 인테리어'],
};

/** 별자리 → 상품 키워드 */
export const ZODIAC_KEYWORDS: Record<string, string[]> = {
  양자리: ['레드 액세서리', '에너지 스톤', '스포츠 소품'],
  황소자리: ['그린 소품', '에메랄드', '가죽 소품'],
  쌍둥이자리: ['옐로우 액세서리', '시트린', '다이어리'],
  게자리: ['실버 소품', '문스톤', '홈 인테리어'],
  사자자리: ['골드 액세서리', '호박석', '럭셔리 소품'],
  처녀자리: ['네이비 소품', '사파이어', '정리 수납'],
  천칭자리: ['핑크 액세서리', '로즈쿼츠', '밸런스 소품'],
  전갈자리: ['블랙 소품', '가넷', '미스터리 소품'],
  사수자리: ['퍼플 액세서리', '터키석', '여행 소품'],
  염소자리: ['브라운 소품', '오닉스', '클래식 액세서리'],
  물병자리: ['블루 소품', '아쿠아마린', '유니크 소품'],
  물고기자리: ['라벤더 소품', '자수정', '힐링 아이템'],
};

export type FortuneContext = {
  type: 'horoscope' | 'saju' | 'tarot' | 'lucky';
  luckyColor?: string;
  zodiacName?: string;
  dominantElement?: string | number;
  weakElement?: string | number;
  tarotCardName?: string;
};

/**
 * 운세 결과로부터 상품 검색 키워드 리스트 생성
 * 여러 소스에서 키워드를 수집하고 랜덤 셔플 후 상위 N개 반환
 */
export function getProductKeywords(ctx: FortuneContext, count = 3): string[] {
  const pool: string[] = [];

  // 행운 컬러 기반
  if (ctx.luckyColor) {
    const colorKw = COLOR_KEYWORDS[ctx.luckyColor];
    if (colorKw) pool.push(...colorKw);
  }

  // 별자리 기반
  if (ctx.zodiacName) {
    const zodiacKw = ZODIAC_KEYWORDS[ctx.zodiacName];
    if (zodiacKw) pool.push(...zodiacKw);
  }

  // 오행 기반
  if (ctx.dominantElement) {
    const elemKw = ELEMENT_KEYWORDS[ctx.dominantElement];
    if (elemKw) pool.push(...elemKw);
  }
  if (ctx.weakElement) {
    const weakKw = ELEMENT_KEYWORDS[ctx.weakElement];
    if (weakKw) pool.push(...weakKw);
  }

  // 타로 카드 기반
  if (ctx.tarotCardName) {
    const tarotKw = TAROT_KEYWORDS[ctx.tarotCardName];
    if (tarotKw) pool.push(...tarotKw);
  }

  // 풀이 비어있으면 기본 키워드
  if (pool.length === 0) {
    pool.push('행운 팔찌', '힐링 소품', '럭키 아이템');
  }

  // 시드 기반 셔플 (하루 동안 같은 결과)
  const seed = new Date().toISOString().slice(0, 10);
  const shuffled = Array.from(new Set(pool)); // 중복 제거
  for (let i = shuffled.length - 1; i > 0; i--) {
    const hash = (seed + shuffled[i]).split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
    const j = Math.abs(hash) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}
