import type { Metadata } from 'next';
import TarotClient from '@/components/TarotClient';

export const metadata: Metadata = {
  title: '타로카드 운세 - AI 타로 리딩',
  description: '무료 타로카드 운세. 3장의 카드로 과거, 현재, 미래를 읽어보세요. AI가 분석하는 정확한 타로 리딩.',
  keywords: ['타로카드', '타로 운세', '무료 타로', 'AI 타로', '타로 리딩'],
  alternates: {
    canonical: 'https://unse.me/tarot',
    languages: { 'ko-KR': 'https://unse.me/tarot' },
  },
};

const tarotJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '운세미 타로카드 운세',
  url: 'https://unse.me/tarot',
  description: '3장의 카드로 과거, 현재, 미래를 읽어보세요. AI가 분석하는 정확한 타로 리딩을 제공합니다.',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
};

export default function TarotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tarotJsonLd) }}
      />
      <TarotClient />
    </>
  );
}
