import { MetadataRoute } from 'next';
import dreamsData from '@/data/dreams.json';
import tarotCards from '@/data/tarot-cards.json';
import horoscopeSigns from '@/data/horoscope-signs.json';
import sajuGuides from '@/data/saju-guides.json';

const SITE_URL = 'https://unse.me';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/saju`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tarot`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dream`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/horoscope`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const dreamPages: MetadataRoute.Sitemap = dreamsData.map((d) => ({
    url: `${SITE_URL}/dream/${d.slug}`,
    lastModified: new Date('2026-03-18'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const tarotPages: MetadataRoute.Sitemap = tarotCards.map((c) => ({
    url: `${SITE_URL}/tarot/${c.slug}`,
    lastModified: new Date('2026-03-18'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const horoscopePages: MetadataRoute.Sitemap = horoscopeSigns.map((s) => ({
    url: `${SITE_URL}/horoscope/${s.slug}`,
    lastModified: new Date('2026-03-18'),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const sajuPages: MetadataRoute.Sitemap = sajuGuides.map((g) => ({
    url: `${SITE_URL}/saju/guide/${g.slug}`,
    lastModified: new Date('2026-03-18'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...dreamPages, ...tarotPages, ...horoscopePages, ...sajuPages];
}
