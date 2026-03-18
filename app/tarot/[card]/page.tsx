import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import tarotCards from '@/data/tarot-cards.json';
import Link from 'next/link';

type TarotCard = (typeof tarotCards)[number];

function getCard(slug: string): TarotCard | undefined {
  return tarotCards.find((c) => c.slug === slug);
}

export async function generateStaticParams() {
  return tarotCards.map((c) => ({ card: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ card: string }>;
}): Promise<Metadata> {
  const { card } = await params;
  const tc = getCard(card);
  if (!tc) return {};

  return {
    title: tc.title,
    description: tc.description,
    keywords: tc.keywords,
    alternates: {
      canonical: `https://unse.me/tarot/${tc.slug}`,
    },
    openGraph: {
      title: tc.title,
      description: tc.description,
      url: `https://unse.me/tarot/${tc.slug}`,
      type: 'article',
      locale: 'ko_KR',
      siteName: '운세미',
    },
    twitter: {
      card: 'summary_large_image',
      title: tc.title,
      description: tc.description,
    },
  };
}

export default async function TarotCardPage({
  params,
}: {
  params: Promise<{ card: string }>;
}) {
  const { card } = await params;
  const tc = getCard(card);
  if (!tc) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tc.title,
    description: tc.description,
    url: `https://unse.me/tarot/${tc.slug}`,
    author: { '@type': 'Organization', name: '운세미' },
    publisher: {
      '@type': 'Organization',
      name: '운세미',
      logo: { '@type': 'ImageObject', url: 'https://unse.me/icon-512.png' },
    },
    datePublished: '2026-03-18',
    dateModified: '2026-03-18',
    mainEntityOfPage: `https://unse.me/tarot/${tc.slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://unse.me' },
      { '@type': 'ListItem', position: 2, name: '타로카드', item: 'https://unse.me/tarot' },
      { '@type': 'ListItem', position: 3, name: tc.name, item: `https://unse.me/tarot/${tc.slug}` },
    ],
  };

  const sections = tc.content.split('\n\n');

  const cardIndex = tarotCards.findIndex((c) => c.slug === tc.slug);
  const prevCard = cardIndex > 0 ? tarotCards[cardIndex - 1] : null;
  const nextCard = cardIndex < tarotCards.length - 1 ? tarotCards[cardIndex + 1] : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>홈</Link>
          {' > '}
          <Link href="/tarot" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>타로카드</Link>
          {' > '}
          <span>{tc.name}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                backgroundColor: 'var(--color-badge-bg)',
                color: 'var(--color-badge-text)',
              }}
            >
              {tc.type === 'major' ? '메이저 아르카나' : '마이너 아르카나'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
              #{tc.number}
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem' }}>
            {tc.title}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            {tc.description}
          </p>
        </header>

        {/* Card Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>원소</div>
            <div style={{ fontWeight: 600 }}>{tc.element}</div>
          </div>
          <div
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>행성</div>
            <div style={{ fontWeight: 600 }}>{tc.planet}</div>
          </div>
          <div
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>별자리</div>
            <div style={{ fontWeight: 600 }}>{tc.zodiac}</div>
          </div>
        </div>

        {/* Upright / Reversed */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div
            style={{
              backgroundColor: 'rgba(52, 211, 153, 0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              border: '1px solid rgba(52, 211, 153, 0.25)',
            }}
          >
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#34d399', marginBottom: '0.5rem' }}>
              정방향 키워드
            </h3>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{tc.upright}</p>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              border: '1px solid rgba(248, 113, 113, 0.25)',
            }}
          >
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f87171', marginBottom: '0.5rem' }}>
              역방향 키워드
            </h3>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{tc.reversed}</p>
          </div>
        </div>

        {/* Content */}
        <article
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            marginBottom: '2rem',
            lineHeight: 1.8,
          }}
        >
          {sections.map((section, i) => {
            return (
              <div key={i} style={{ marginBottom: '1rem' }}>
                {section.split('\n').map((line, j) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={j} style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        {line.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (line.startsWith('## ')) {
                    return (
                      <h2 key={j} style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>
                        {line.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (!line.trim()) return null;
                  return <p key={j} style={{ marginBottom: '0.5rem' }}>{line}</p>;
                })}
              </div>
            );
          })}
        </article>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {prevCard ? (
            <Link
              href={`/tarot/${prevCard.slug}`}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
                color: 'inherit',
                flex: '1',
                minWidth: '120px',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>이전 카드</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{prevCard.name}</div>
            </Link>
          ) : <div />}
          {nextCard ? (
            <Link
              href={`/tarot/${nextCard.slug}`}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
                color: 'inherit',
                textAlign: 'right',
                flex: '1',
                minWidth: '120px',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>다음 카드</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{nextCard.name}</div>
            </Link>
          ) : <div />}
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/tarot"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: 'var(--gradient-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            전체 타로카드 보기
          </Link>
        </div>
      </div>
    </>
  );
}
