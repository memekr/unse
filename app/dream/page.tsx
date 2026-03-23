import type { Metadata } from 'next';
import DreamClient from '@/components/DreamClient';

export const metadata: Metadata = {
  title: '꿈해몽 - 꿈 해석 사전',
  description: '무료 꿈해몽 사전. 간밤에 꾼 꿈의 의미를 검색해보세요. 동물, 자연, 사람, 사물, 상황별 꿈 해석과 행운의 숫자를 알려드립니다.',
  keywords: ['꿈해몽', '꿈 해석', '꿈 풀이', '꿈 사전', '태몽', '길몽', '흉몽'],
  alternates: {
    canonical: 'https://unse.me/dream',
    languages: { 'ko-KR': 'https://unse.me/dream' },
  },
};

const dreamFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '뱀 꿈은 무슨 뜻인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '뱀 꿈은 재물운을 상징합니다. 특히 큰 뱀이 나타나면 큰 재물이 들어올 징조이며, 뱀에게 물리는 꿈은 예상치 못한 행운을 의미합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '돼지 꿈은 무슨 뜻인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '돼지 꿈은 재물과 풍요를 상징합니다. 돼지를 안는 꿈은 큰 재물이 들어올 징조이며, 임신의 길몽일 수도 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '용 꿈은 무슨 뜻인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '용 꿈은 최고의 길몽 중 하나입니다. 큰 성공과 출세를 상징하며, 하늘로 오르는 용은 목표 달성을, 물속의 용은 잠재력이 곧 발현됨을 의미합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '물 꿈은 무슨 뜻인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '물이 맑으면 좋은 징조이고, 흐린 물은 감정적 혼란을 나타냅니다. 물이 차오르는 꿈은 재물운이 상승하는 의미이며, 깨끗한 물을 마시는 꿈은 건강운이 좋아짐을 뜻합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '호랑이 꿈은 무슨 뜻인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '호랑이 꿈은 권력과 용기를 상징합니다. 호랑이를 타면 큰 권력을 얻을 수 있고, 호랑이에게 쫓기면 강력한 경쟁자를 만날 수 있습니다.',
      },
    },
  ],
};

export default function DreamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dreamFaqJsonLd) }}
      />
      <DreamClient />
    </>
  );
}
