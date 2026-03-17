/**
 * product-pool.ts — 운세 카테고리별 쿠팡 추천 상품 풀
 *
 * 검색 API 대신 미리 정의된 상품 풀에서 선택 →
 * 딥링크 API로 제휴 추적 링크만 발급받는 구조
 *
 * link: 쿠팡 검색 URL (딥링크 변환 대상)
 */

export type PoolItem = {
  id: string;
  title: string;
  keyword: string;          // 쿠팡 검색 키워드
  emoji: string;
  /** 이 아이템이 연결되는 카테고리 태그 */
  tags: string[];
};

// ── 행운 컬러 기반 ──

const COLOR_ITEMS: PoolItem[] = [
  { id: 'c01', title: '레드 행운 팔찌', keyword: '빨간색 팔찌', emoji: '🔴', tags: ['빨강'] },
  { id: 'c02', title: '오렌지 머그컵', keyword: '오렌지 머그컵', emoji: '🟠', tags: ['주황'] },
  { id: 'c03', title: '골드 행운 소품', keyword: '골드 액세서리', emoji: '🟡', tags: ['노랑', '금색'] },
  { id: 'c04', title: '그린 힐링 소품', keyword: '그린 인테리어 소품', emoji: '🟢', tags: ['초록'] },
  { id: 'c05', title: '블루 액세서리', keyword: '파란색 액세서리', emoji: '🔵', tags: ['파랑'] },
  { id: 'c06', title: '네이비 지갑', keyword: '네이비 지갑', emoji: '🌀', tags: ['남색'] },
  { id: 'c07', title: '퍼플 크리스탈', keyword: '자수정 팔찌', emoji: '🟣', tags: ['보라'] },
  { id: 'c08', title: '핑크 로즈쿼츠', keyword: '로즈쿼츠 팔찌', emoji: '🩷', tags: ['분홍'] },
  { id: 'c09', title: '화이트 문스톤', keyword: '문스톤 팔찌', emoji: '⚪', tags: ['하양'] },
  { id: 'c10', title: '블랙 흑요석', keyword: '흑요석 팔찌', emoji: '⚫', tags: ['검정'] },
  { id: 'c11', title: '실버 액세서리', keyword: '실버 팔찌', emoji: '🪩', tags: ['은색'] },
];

// ── 오행 기반 ──

const ELEMENT_ITEMS: PoolItem[] = [
  { id: 'e01', title: '원목 인테리어', keyword: '원목 소품 인테리어', emoji: '🌳', tags: ['목', '0'] },
  { id: 'e02', title: '미니 식물 화분', keyword: '미니 화분 세트', emoji: '🌿', tags: ['목', '0'] },
  { id: 'e03', title: '아로마 캔들', keyword: '아로마 캔들 세트', emoji: '🕯️', tags: ['화', '1'] },
  { id: 'e04', title: '레드 디퓨저', keyword: '레드 아로마 디퓨저', emoji: '🔥', tags: ['화', '1'] },
  { id: 'e05', title: '도자기 소품', keyword: '도자기 인테리어 소품', emoji: '🏺', tags: ['토', '2'] },
  { id: 'e06', title: '크리스탈 장식', keyword: '크리스탈 장식', emoji: '💎', tags: ['토', '2'] },
  { id: 'e07', title: '골드 팔찌', keyword: '골드 팔찌', emoji: '✨', tags: ['금', '3'] },
  { id: 'e08', title: '메탈 인테리어', keyword: '메탈 인테리어 소품', emoji: '🪙', tags: ['금', '3'] },
  { id: 'e09', title: '아쿠아마린', keyword: '아쿠아마린 팔찌', emoji: '💧', tags: ['수', '4'] },
  { id: 'e10', title: '미니 분수', keyword: '미니 분수 인테리어', emoji: '⛲', tags: ['수', '4'] },
];

// ── 별자리 기반 ──

const ZODIAC_ITEMS: PoolItem[] = [
  { id: 'z01', title: '에너지 팔찌', keyword: '에너지 스톤 팔찌', emoji: '♈', tags: ['양자리'] },
  { id: 'z02', title: '가죽 소품', keyword: '가죽 키링 소품', emoji: '♉', tags: ['황소자리'] },
  { id: 'z03', title: '감성 다이어리', keyword: '감성 다이어리', emoji: '♊', tags: ['쌍둥이자리'] },
  { id: 'z04', title: '홈 인테리어', keyword: '감성 홈 인테리어', emoji: '♋', tags: ['게자리'] },
  { id: 'z05', title: '럭셔리 소품', keyword: '골드 럭셔리 소품', emoji: '♌', tags: ['사자자리'] },
  { id: 'z06', title: '정리 수납함', keyword: '깔끔 정리 수납', emoji: '♍', tags: ['처녀자리'] },
  { id: 'z07', title: '로즈쿼츠 팔찌', keyword: '로즈쿼츠 팔찌', emoji: '♎', tags: ['천칭자리'] },
  { id: 'z08', title: '가넷 액세서리', keyword: '가넷 팔찌', emoji: '♏', tags: ['전갈자리'] },
  { id: 'z09', title: '여행 소품', keyword: '여행 소품 세트', emoji: '♐', tags: ['사수자리'] },
  { id: 'z10', title: '클래식 액세서리', keyword: '오닉스 팔찌', emoji: '♑', tags: ['염소자리'] },
  { id: 'z11', title: '유니크 소품', keyword: '유니크 인테리어 소품', emoji: '♒', tags: ['물병자리'] },
  { id: 'z12', title: '힐링 아이템', keyword: '자수정 힐링 팔찌', emoji: '♓', tags: ['물고기자리'] },
];

// ── 타로 기반 ──

const TAROT_ITEMS: PoolItem[] = [
  { id: 't01', title: '여행 배낭', keyword: '감성 미니 배낭', emoji: '🎒', tags: ['바보'] },
  { id: 't02', title: '타로카드 세트', keyword: '타로카드 세트', emoji: '🔮', tags: ['마법사'] },
  { id: 't03', title: '명상 쿠션', keyword: '명상 쿠션', emoji: '🧘', tags: ['여사제', '매달린남자'] },
  { id: 't04', title: '플라워 인테리어', keyword: '플라워 인테리어 소품', emoji: '🌸', tags: ['여황제'] },
  { id: 't05', title: '파워스톤 팔찌', keyword: '파워스톤 팔찌', emoji: '💪', tags: ['황제', '힘'] },
  { id: 't06', title: '인센스 스틱', keyword: '인센스 스틱 세트', emoji: '🪔', tags: ['교황', '은둔자'] },
  { id: 't07', title: '커플 액세서리', keyword: '커플 팔찌', emoji: '💕', tags: ['연인'] },
  { id: 't08', title: '스포츠 팔찌', keyword: '스포츠 팔찌', emoji: '🏃', tags: ['전차'] },
  { id: 't09', title: '행운의 팔찌', keyword: '행운 팔찌', emoji: '🍀', tags: ['운명의수레바퀴'] },
  { id: 't10', title: '밸런스 소품', keyword: '밸런스 인테리어', emoji: '⚖️', tags: ['정의', '절제'] },
  { id: 't11', title: '변화 다이어리', keyword: '버킷리스트 다이어리', emoji: '📓', tags: ['죽음'] },
  { id: 't12', title: '보호석 팔찌', keyword: '블랙투르말린 팔찌', emoji: '🛡️', tags: ['악마', '탑'] },
  { id: 't13', title: '별 모양 소품', keyword: '별 모양 소품', emoji: '⭐', tags: ['별'] },
  { id: 't14', title: '달 인테리어', keyword: '달 모양 조명', emoji: '🌙', tags: ['달'] },
  { id: 't15', title: '시트린 팔찌', keyword: '시트린 팔찌', emoji: '☀️', tags: ['태양'] },
  { id: 't16', title: '클렌징 세이지', keyword: '화이트 세이지', emoji: '🔔', tags: ['심판'] },
  { id: 't17', title: '세계지도 소품', keyword: '세계지도 인테리어', emoji: '🌍', tags: ['세계'] },
];

// ── 기본 / 공통 아이템 ──

const DEFAULT_ITEMS: PoolItem[] = [
  { id: 'd01', title: '행운 팔찌', keyword: '행운 팔찌', emoji: '🍀', tags: ['default'] },
  { id: 'd02', title: '힐링 소품', keyword: '힐링 소품 선물', emoji: '🎁', tags: ['default'] },
  { id: 'd03', title: '럭키 아이템', keyword: '럭키 아이템', emoji: '🌈', tags: ['default'] },
  { id: 'd04', title: '감성 인테리어', keyword: '감성 인테리어 소품', emoji: '🏠', tags: ['default'] },
];

/** 전체 상품 풀 */
export const ALL_ITEMS: PoolItem[] = [
  ...COLOR_ITEMS,
  ...ELEMENT_ITEMS,
  ...ZODIAC_ITEMS,
  ...TAROT_ITEMS,
  ...DEFAULT_ITEMS,
];

export type FortuneContext = {
  type: 'horoscope' | 'saju' | 'tarot' | 'lucky';
  luckyColor?: string;
  zodiacName?: string;
  dominantElement?: string | number;
  weakElement?: string | number;
  tarotCardName?: string;
};

/**
 * 운세 결과에 맞는 상품 풀 아이템을 선택
 * 매칭되는 태그가 있으면 해당 아이템 우선, 없으면 기본 아이템
 */
export function pickItems(ctx: FortuneContext, count = 4): PoolItem[] {
  const tags: string[] = [];

  if (ctx.luckyColor) tags.push(ctx.luckyColor);
  if (ctx.zodiacName) tags.push(ctx.zodiacName);
  if (ctx.dominantElement !== undefined) tags.push(String(ctx.dominantElement));
  if (ctx.weakElement !== undefined) tags.push(String(ctx.weakElement));
  if (ctx.tarotCardName) tags.push(ctx.tarotCardName);

  // 태그 매칭 아이템 수집
  const matched = ALL_ITEMS.filter(
    (item) => item.tags.some((t) => tags.includes(t))
  );

  // 시드 기반 셔플 (하루 동안 같은 결과)
  const seed = new Date().toISOString().slice(0, 10);
  const pool = matched.length > 0 ? matched : DEFAULT_ITEMS;
  const shuffled = [...pool];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const hash = (seed + shuffled[i].id).split('').reduce(
      (a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0
    );
    const j = Math.abs(hash) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

/** 쿠팡 검색 URL 생성 */
export function coupangSearchUrl(keyword: string): string {
  return `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(keyword)}`;
}
