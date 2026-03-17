import type { Metadata } from 'next';
import { buildMetadata } from '@/components/SEOHead';
import { siteConfig } from '@/lib/site-config';
import { resolveSharedAd } from '@/lib/ads/shared-feed';
import SharedAdBanner from '@/components/ads/SharedAdBanner';
import ProductAdBanner from '@/components/ads/ProductAdBanner';
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
  },
});

type ZodiacFortune = {
  name: string;
  icon: string;
  dateRange: string;
  slug: string;
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

function getTodayFortunes(): ZodiacFortune[] {
  const seed = getDailySeed();
  const rng = seededRandom(seed);

  return ZODIAC_SIGNS.map((sign, i) => {
    // 각 별자리마다 다른 시드
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

function renderStars(count: number): string {
  return '\u2B50'.repeat(count) + '\u2606'.repeat(5 - count);
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
        <p>{dateStr} {'별자리별 운세를 확인하세요'}</p>
      </div>

      <div className="horoscope-grid">
        {fortunes.map((zodiac, idx) => (
          <article key={zodiac.slug} className="horoscope-card" id={zodiac.slug}>
            <div className="horoscope-card-header">
              <span className="icon">{zodiac.icon}</span>
              <div className="info">
                <h3>{zodiac.name}</h3>
                <span className="date-range">{zodiac.dateRange}</span>
              </div>
            </div>

            {/* 종합운 점수 */}
            <div className="luck-meters" style={{ borderTop: 'none', paddingTop: 0 }}>
              <div className="luck-meter">
                <span className="label">{'종합'}</span>
                <span className="stars">{renderStars(zodiac.overall)}</span>
              </div>
              <div className="luck-meter">
                <span className="label">{'연애'}</span>
                <span className="stars">{renderStars(zodiac.love)}</span>
              </div>
              <div className="luck-meter">
                <span className="label">{'금전'}</span>
                <span className="stars">{renderStars(zodiac.money)}</span>
              </div>
              <div className="luck-meter">
                <span className="label">{'건강'}</span>
                <span className="stars">{renderStars(zodiac.health)}</span>
              </div>
            </div>

            {/* 운세 텍스트 */}
            <p className="fortune-text">{zodiac.fortuneText}</p>

            {/* 행운 정보 */}
            <div className="lucky-info">
              {'\uD83C\uDF08'}{' 행운의 색: '}{zodiac.luckyColor}{' | '}{'\uD83C\uDFB2'}{' 행운의 숫자: '}{zodiac.luckyNumber}
            </div>

            {/* 오늘의 조언 */}
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginTop: '0.625rem', fontStyle: 'italic', textAlign: 'center' }}>
              {'\uD83D\uDCAB "'}
              {zodiac.advice}
              {'"'}
            </p>
          </article>
        ))}
      </div>

      {/* 행운의 쇼핑 섹션 */}
      <ProductAdBanner
        context={{ type: 'horoscope' }}
        icon="✨"
        title="별자리에 맞는 행운 아이템"
        desc="오늘의 별자리 운세가 추천하는 행운 아이템을 만나보세요"
      />

      <div style={{ marginTop: '2rem' }}>
        <SharedAdBanner ad={inlineAd} variant="inline-card" />
      </div>
    </div>
  );
}
