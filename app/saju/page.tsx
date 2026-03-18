import type { Metadata } from 'next';
import SajuClient from '@/components/SajuClient';

export const metadata: Metadata = {
  title: '사주풀이 - 생년월일로 보는 나의 사주팔자 | 운세미',
  description: '무료 사주풀이. 생년월일시를 입력하면 AI가 분석하는 정확한 사주팔자, 오행 분석, 운세를 확인하세요.',
  keywords: ['사주풀이', '사주팔자', '무료사주', '생년월일 운세', '오행'],
  alternates: {
    canonical: 'https://unse.me/saju',
  },
};

const sajuJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '운세미 사주풀이',
  url: 'https://unse.me/saju',
  description: '생년월일시를 입력하면 AI가 분석하는 정확한 사주팔자, 오행 분석, 운세를 제공합니다.',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
};

export default function SajuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sajuJsonLd) }}
      />
      <SajuClient />
    </>
  );
}
