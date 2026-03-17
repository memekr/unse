import { NextResponse } from 'next/server';
import {
  ZODIAC_SIGNS, FORTUNE_MESSAGES, OVERALL_FORTUNES,
  LOVE_FORTUNES, MONEY_FORTUNES, HEALTH_FORTUNES,
  DAILY_ADVICE, LUCKY_COLORS, getDailySeed, seededRandom,
} from '@/lib/fortune-data';

/**
 * GET /api/horoscope?sign=aries
 * 날짜 기반 시드를 사용해 매일 다른 운세 반환
 */

type ZodiacFortune = {
  sign: string;
  nameKo: string;
  icon: string;
  overall: number;
  love: number;
  money: number;
  health: number;
  fortuneText: string;
  overallText: string;
  loveText: string;
  moneyText: string;
  healthText: string;
  advice: string;
  luckyColor: string;
  luckyNumber: number;
};

function generateFortune(signIndex: number, seed: number): ZodiacFortune {
  const sign = ZODIAC_SIGNS[signIndex];
  const signRng = seededRandom(seed + signIndex * 777 + signIndex * signIndex * 13);

  const overall = Math.floor(signRng() * 5) + 1;
  const love = Math.floor(signRng() * 5) + 1;
  const money = Math.floor(signRng() * 5) + 1;
  const health = Math.floor(signRng() * 5) + 1;

  const fortuneIdx = Math.floor(signRng() * FORTUNE_MESSAGES.length);
  const overallIdx = Math.floor(signRng() * OVERALL_FORTUNES.length);
  const loveIdx = Math.floor(signRng() * LOVE_FORTUNES.length);
  const moneyIdx = Math.floor(signRng() * MONEY_FORTUNES.length);
  const healthIdx = Math.floor(signRng() * HEALTH_FORTUNES.length);
  const adviceIdx = Math.floor(signRng() * DAILY_ADVICE.length);
  const colorIdx = Math.floor(signRng() * LUCKY_COLORS.length);
  const luckyNum = Math.floor(signRng() * 45) + 1;

  return {
    sign: sign.slug,
    nameKo: sign.name,
    icon: sign.icon,
    overall,
    love,
    money,
    health,
    fortuneText: FORTUNE_MESSAGES[fortuneIdx],
    overallText: OVERALL_FORTUNES[overallIdx],
    loveText: LOVE_FORTUNES[loveIdx],
    moneyText: MONEY_FORTUNES[moneyIdx],
    healthText: HEALTH_FORTUNES[healthIdx],
    advice: DAILY_ADVICE[adviceIdx],
    luckyColor: LUCKY_COLORS[colorIdx],
    luckyNumber: luckyNum,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get('sign');
  const seed = getDailySeed();

  if (sign) {
    const signIndex = ZODIAC_SIGNS.findIndex(s => s.slug === sign);
    if (signIndex === -1) {
      return NextResponse.json({ error: 'Invalid sign' }, { status: 400 });
    }
    return NextResponse.json(generateFortune(signIndex, seed));
  }

  // 모든 별자리 반환
  const today = new Date();
  const allFortunes = ZODIAC_SIGNS.map((_, i) => generateFortune(i, seed));

  return NextResponse.json({
    date: today.toISOString().split('T')[0],
    fortunes: allFortunes,
  });
}
