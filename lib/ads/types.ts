/**
 * 광고 시스템 공유 타입 정의
 */

export type ProductItem = {
  id: string;
  title: string;
  emoji: string;
  keyword: string;
  link: string;
  isAffiliate: boolean;
  source: string;
};

export type FortuneContext = {
  type: 'horoscope' | 'saju' | 'tarot' | 'lucky';
  luckyColor?: string;
  zodiacName?: string;
  dominantElement?: string | number;
  weakElement?: string | number;
  tarotCardName?: string;
};
