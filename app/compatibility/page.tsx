import type { Metadata } from 'next';
import CompatibilityClient from '@/components/CompatibilityClient';

export const metadata: Metadata = {
  title: '궁합 보기 - 생년월일 궁합 무료',
  description: '무료 궁합 보기. 두 사람의 생년월일을 입력하면 오행 궁합, 별자리 궁합, 띠 궁합까지 정확한 궁합 분석을 제공합니다. 운세미에서 무료로 확인하세요.',
  keywords: ['궁합', '생년월일 궁합', '무료 궁합', '띠 궁합', '별자리 궁합', '오행 궁합', '궁합 보기 무료', '운세미'],
  alternates: {
    canonical: 'https://unse.me/compatibility',
    languages: { 'ko-KR': 'https://unse.me/compatibility' },
  },
};

const compatJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '운세미 궁합 보기',
  url: 'https://unse.me/compatibility',
  description: '두 사람의 생년월일을 입력하면 오행 궁합, 별자리 궁합, 띠 궁합까지 정확한 궁합 분석을 무료로 제공합니다.',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
};

export default function CompatibilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compatJsonLd) }}
      />
      <CompatibilityClient />
    </>
  );
}
