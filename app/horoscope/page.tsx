import type { Metadata } from 'next';
import { buildMetadata } from '@/components/SEOHead';
import { siteConfig } from '@/lib/site-config';
import { resolveSharedAd } from '@/lib/ads/shared-feed';
import SharedAdBanner from '@/components/ads/SharedAdBanner';
import HoroscopeClient from '@/components/horoscope/HoroscopeClient';
import type { ZodiacFortune } from '@/components/horoscope/HoroscopeClient';
import {
  ZODIAC_SIGNS, FORTUNE_MESSAGES, OVERALL_FORTUNES,
  LOVE_FORTUNES, MONEY_FORTUNES, HEALTH_FORTUNES,
  DAILY_ADVICE, LUCKY_COLORS, getDailySeed, seededRandom,
} from '@/lib/fortune-data';

export const metadata: Metadata = buildMetadata({
  title: '오늘의 별자리 운세',
  description: '12별자리 오늘의 운세를 확인하세요. 양자리부터 물고기자리까지 매일 업데이트되는 별자리 운세.',
  openGraph: {
    url: 'https://unse.me/horoscope',
  },
  alternates: {
    canonical: 'https://unse.me/horoscope',
    languages: { 'ko-KR': 'https://unse.me/horoscope' },
  },
});

function getTodayFortunes(): ZodiacFortune[] {
  const seed = getDailySeed();

  return ZODIAC_SIGNS.map((sign, i) => {
    const signRng = seededRandom(seed + i * 777 + i * i * 13);

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
      name: sign.name,
      icon: sign.icon,
      dateRange: sign.dateRange,
      slug: sign.slug,
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
  });
}

export default async function HoroscopePage() {
  const fortunes = getTodayFortunes();
  const inlineAd = await resolveSharedAd(siteConfig.siteId, 'inline-card', Date.now());

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div>
      <div className="page-header">
        <div className="page-icon">{'\u2728'}</div>
        <h1>{'오늘의 별자리 운세'}</h1>
        <p>{dateStr} {'별자리를 클릭하면 상세 운세를 볼 수 있어요'}</p>
      </div>

      <HoroscopeClient fortunes={fortunes} dateStr={dateStr} />

      <div style={{ marginTop: '2rem' }}>
        <SharedAdBanner ad={inlineAd} variant="inline-card" />
      </div>
    </div>
  );
}
