import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: '무료 운세 - 사주풀이 · 타로 · 꿈해몽 · 별자리 운세 | 운세미',
  description: 'AI 기반 무료 운세 서비스. 사주풀이, 타로카드 리딩, 꿈해몽, 별자리 운세를 정확하게 풀어드립니다. 생년월일을 입력하면 맞춤 운세를 확인하세요.',
  keywords: ['무료 운세', '사주풀이', '타로', '꿈해몽', '별자리 운세', '오늘의 운세', 'AI 운세', '운세미'],
  alternates: {
    canonical: 'https://unse.me',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
