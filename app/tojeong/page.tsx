import type { Metadata } from 'next';
import TojeongClient from '@/components/TojeongClient';

export const metadata: Metadata = {
  title: '토정비결 - 2026년 무료 토정비결',
  description: '2026년 무료 토정비결. 출생연도와 성별을 입력하면 올해의 총운, 월별 운세, 행운의 달을 확인할 수 있습니다. 운세미에서 무료로 확인하세요.',
  keywords: ['토정비결', '2026 토정비결', '무료 토정비결', '토정비결 무료', '올해 운세', '월별 운세', '운세미'],
  alternates: {
    canonical: 'https://unse.me/tojeong',
    languages: { 'ko-KR': 'https://unse.me/tojeong' },
  },
};

const tojeongJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '운세미 토정비결',
  url: 'https://unse.me/tojeong',
  description: '2026년 무료 토정비결. 출생연도를 입력하면 올해의 총운과 월별 운세를 제공합니다.',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
};

export default function TojeongPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tojeongJsonLd) }}
      />
      <TojeongClient />
    </>
  );
}
