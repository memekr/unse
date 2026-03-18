import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '운세미 소개',
  description: '운세미는 AI 기반 무료 운세 서비스입니다. 사주풀이, 타로, 꿈해몽, 별자리 운세를 무료로 제공합니다.',
  alternates: {
    canonical: 'https://unse.me/about',
  },
};

export default function AboutPage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'memekr',
    url: 'https://unse.me',
    sameAs: [
      'https://github.com/memekr',
      'https://x.com/memekr',
    ],
    jobTitle: 'Developer',
    worksFor: {
      '@type': 'Organization',
      name: '운세미',
      url: 'https://unse.me',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#e5e5e5' }}>
          운세미 소개
        </h1>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>
            어떤 서비스인가요?
          </h2>
          <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
            운세미는 AI 기반의 무료 운세 서비스입니다. 사주풀이, 타로카드 리딩, 꿈해몽, 별자리 운세, 띠별 운세, 궁합 등
            다양한 운세 서비스를 회원가입 없이 무료로 이용할 수 있습니다.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>
            왜 만들었나요?
          </h2>
          <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
            기존 운세 서비스들은 유료 결제를 요구하거나 과도한 광고로 이용이 불편했습니다.
            운세미는 전통 역학 이론과 AI 분석을 결합하여 누구나 무료로 정확한 운세를 확인할 수 있도록 만들었습니다.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>
            운영자
          </h2>
          <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
            개인 개발자가 운영하며, 오픈소스 프로젝트를 통해 AI 기반 서비스를 공유하고 있습니다.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <a href="https://github.com/memekr" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', fontSize: '0.85rem' }}>
              GitHub
            </a>
            <a href="https://x.com/memekr" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', fontSize: '0.85rem' }}>
              X (Twitter)
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
