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
