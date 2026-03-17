import { MetadataRoute } from 'next';

const SITE_URL = 'https://unse.me';

const zodiacSigns = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
];

const horoscopeSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

const categories = [
  { slug: 'saju', name: '사주' },
  { slug: 'tarot', name: '타로' },
  { slug: 'dream', name: '꿈해석' },
  { slug: 'horoscope', name: '별자리운세' },
  { slug: 'compatibility', name: '궁합' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/today`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/saju`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/tarot`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/dream`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const zodiacPages = zodiacSigns.flatMap((sign) =>
    years.map((year) => ({
      url: `${SITE_URL}/zodiac/${sign}/${year}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }))
  );

  const horoscopePages = horoscopeSigns.map((sign) => ({
    url: `${SITE_URL}/horoscope/${sign}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // 꿈 해석 샘플
  const dreamPages: MetadataRoute.Sitemap = [];
  const dreams = ['물', '뱀', '죽음', '돈', '비행기', '결혼', '혼자', '가족', '친구', '운전'];
  for (let i = 0; i < dreams.length * 50; i++) {
    dreamPages.push({
      url: `${SITE_URL}/dream/${i}`,
      lastModified: new Date(),
      changeFrequency: 'never' as const,
      priority: 0.6,
    });
  }

  return [...staticPages, ...categoryPages, ...zodiacPages, ...horoscopePages, ...dreamPages];
}
