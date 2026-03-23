import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dreamsData from '@/data/dreams.json';
import Link from 'next/link';

type Dream = (typeof dreamsData)[number];

function getDream(slug: string): Dream | undefined {
  return dreamsData.find((d) => d.slug === slug);
}

export async function generateStaticParams() {
  return dreamsData.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dream = getDream(slug);
  if (!dream) return {};

  return {
    title: dream.title,
    description: dream.description,
    keywords: dream.keywords,
    alternates: {
      canonical: `https://unse.me/dream/${dream.slug}`,
    },
    openGraph: {
      title: dream.title,
      description: dream.description,
      url: `https://unse.me/dream/${dream.slug}`,
      type: 'article',
      locale: 'ko_KR',
      siteName: '운세미',
    },
    twitter: {
      card: 'summary_large_image',
      title: dream.title,
      description: dream.description,
    },
  };
}

function interpretationBadge(interp: string) {
  const colors: Record<string, string> = {
    '대길몽': '#fbbf24',
    '길몽': '#34d399',
    '길흉혼합': '#60a5fa',
    '경고몽': '#f87171',
  };
  const color = colors[interp] || '#9ca3af';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#000',
        backgroundColor: color,
      }}
    >
      {interp}
    </span>
  );
}

export default async function DreamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dream = getDream(slug);
  if (!dream) notFound();

  const relatedDreams = (dream.relatedDreams ?? [])
    .map((rs) => dreamsData.find((d) => d.slug === rs))
    .filter(Boolean) as Dream[];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: dream.title,
    description: dream.description,
    url: `https://unse.me/dream/${dream.slug}`,
    author: { '@type': 'Organization', name: '운세미' },
    publisher: {
      '@type': 'Organization',
      name: '운세미',
      logo: { '@type': 'ImageObject', url: 'https://unse.me/icon-512.png' },
    },
    datePublished: '2026-03-18',
    dateModified: '2026-03-18',
    mainEntityOfPage: `https://unse.me/dream/${dream.slug}`,
    keywords: dream.keywords.join(', '),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://unse.me' },
      { '@type': 'ListItem', position: 2, name: '꿈해몽', item: 'https://unse.me/dream' },
      { '@type': 'ListItem', position: 3, name: dream.title, item: `https://unse.me/dream/${dream.slug}` },
    ],
  };

  const sections = dream.content.split('\n\n');

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
          <Link href="/dream" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>꿈해몽</Link>
          {' > '}
          <span>{dream.title}</span>
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
              {dream.category}
            </span>
            {interpretationBadge(dream.interpretation)}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem' }}>
            {dream.title}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            {dream.description}
          </p>
        </header>

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
            if (section.startsWith('## ')) {
              return (
                <h2
                  key={i}
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginTop: i === 0 ? 0 : '2rem',
                    marginBottom: '1rem',
                    color: 'var(--color-accent)',
                  }}
                >
                  {section.replace('## ', '')}
                </h2>
              );
            }
            if (section.startsWith('### ')) {
              return (
                <h3
                  key={i}
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    marginTop: '1.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  {section.replace('### ', '')}
                </h3>
              );
            }
            return (
              <div key={i} style={{ marginBottom: '1rem' }}>
                {section.split('\n').map((line, j) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h3
                        key={j}
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          marginTop: '1.5rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {line.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (line.startsWith('## ')) {
                    return (
                      <h2
                        key={j}
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          marginTop: '2rem',
                          marginBottom: '1rem',
                          color: 'var(--color-accent)',
                        }}
                      >
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

        {/* Lucky Numbers */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
            border: '1px solid var(--color-gold-soft)',
            marginBottom: '2rem',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-gold)' }}>
            행운의 번호
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {dream.luckyNumbers.map((n) => (
              <span
                key={n}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: 'var(--gradient-gold)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Related Dreams */}
        {relatedDreams.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
              관련 꿈해몽
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {relatedDreams.map((rd) => (
                <Link
                  key={rd.slug}
                  href={`/dream/${rd.slug}`}
                  style={{
                    display: 'block',
                    padding: '1rem',
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{rd.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {rd.description.slice(0, 80)}...
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/dream"
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
            전체 꿈해몽 보기
          </Link>
        </div>
      </div>
    </>
  );
}
