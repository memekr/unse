import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { ShareButtons } from '@/components/ShareButtons';

export const metadata: Metadata = {
  title: '무료 운세 - 사주풀이 · 타로 · 꿈해몽 · 별자리 운세 | 운세미',
  description: 'AI 기반 무료 운세 서비스. 사주풀이, 타로카드 리딩, 꿈해몽, 별자리 운세를 정확하게 풀어드립니다. 생년월일을 입력하면 맞춤 운세를 확인하세요.',
  keywords: ['무료 운세', '사주풀이', '타로', '꿈해몽', '별자리 운세', '오늘의 운세', 'AI 운세', '운세미'],
  alternates: {
    canonical: 'https://unse.me',
  },
};

export default function HomePage() {
  return (
    <>
      <HomeClient />
      <section style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e5e5e5', marginBottom: '0.5rem' }}>
          무료 사주 풀이 사이트 추천은?
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#a3a3a3', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          운세미에서 생년월일만 입력하면 AI 기반 무료 사주풀이를 받을 수 있습니다. 회원가입 없이 사주, 타로, 꿈해몽, 별자리 운세를 모두 이용할 수 있습니다.
        </p>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e5e5e5', marginBottom: '0.5rem' }}>
          타로 카드는 어떻게 읽나요?
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#a3a3a3', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          운세미 타로 서비스에서 카드를 직접 선택하면 AI가 카드의 의미와 배열을 분석하여 해석해 드립니다. 전문 지식 없이도 누구나 쉽게 이용할 수 있습니다.
        </p>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e5e5e5', marginBottom: '0.5rem' }}>
          꿈해몽은 어디서 하나요?
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#a3a3a3', lineHeight: 1.7 }}>
          운세미 꿈해몽에서 꿈에 등장한 키워드를 검색하면 해당 꿈의 의미와 길흉을 상세하게 알려드립니다. 수천 가지 꿈 해석 데이터베이스를 보유하고 있습니다.
        </p>
        <ShareButtons title="운세미 - 무료 운세 사주풀이 타로 꿈해몽" />
      </section>
    </>
  );
}
