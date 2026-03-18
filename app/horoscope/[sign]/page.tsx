import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import signsData from '@/data/horoscope-signs.json';
import Link from 'next/link';

type Sign = (typeof signsData)[number];

function getSign(slug: string): Sign | undefined {
  return signsData.find((s) => s.slug === slug);
}

export async function generateStaticParams() {
  return signsData.map((s) => ({ sign: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}): Promise<Metadata> {
  const { sign } = await params;
  const s = getSign(sign);
  if (!s) return {};

  return {
    title: s.title,
    description: s.description,
    keywords: s.keywords,
    alternates: { canonical: `https://unse.me/horoscope/${s.slug}` },
    openGraph: {
      title: s.title,
      description: s.description,
      url: `https://unse.me/horoscope/${s.slug}`,
      type: 'article',
      locale: 'ko_KR',
      siteName: '운세미',
    },
  };
}

function renderContent(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) {
      return <h3 key={i} style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '1.25rem', marginBottom: '0.5rem' }}>{line.replace('### ', '')}</h3>;
    }
    if (line.startsWith('- ')) {
      return <li key={i} style={{ marginLeft: '1.25rem', marginBottom: '0.25rem', listStyleType: 'disc' }}>{line.replace('- ', '')}</li>;
    }
    if (!line.trim()) return <br key={i} />;
    return <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>;
  });
}

export default async function HoroscopeSignPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign } = await params;
  const s = getSign(sign);
  if (!s) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: s.title,
    description: s.description,
    url: `https://unse.me/horoscope/${s.slug}`,
    author: { '@type': 'Organization', name: '운세미' },
    publisher: {
      '@type': 'Organization',
      name: '운세미',
      logo: { '@type': 'ImageObject', url: 'https://unse.me/icon-512.png' },
    },
    datePublished: '2026-03-18',
    dateModified: '2026-03-18',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://unse.me' },
      { '@type': 'ListItem', position: 2, name: '별자리 운세', item: 'https://unse.me/horoscope' },
      { '@type': 'ListItem', position: 3, name: s.name, item: `https://unse.me/horoscope/${s.slug}` },
    ],
  };

  const signIdx = signsData.findIndex((x) => x.slug === s.slug);
  const prevSign = signIdx > 0 ? signsData[signIdx - 1] : signsData[signsData.length - 1];
  const nextSign = signIdx < signsData.length - 1 ? signsData[signIdx + 1] : signsData[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>홈</Link>
          {' > '}
          <Link href="/horoscope" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>별자리 운세</Link>
          {' > '}
          <span>{s.name}</span>
        </nav>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{s.icon}</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{s.dateRange}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', backgroundColor: 'var(--color-badge-bg)', color: 'var(--color-badge-text)' }}>
              {s.element} 원소
            </span>
            <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', backgroundColor: 'var(--color-badge-bg)', color: 'var(--color-badge-text)' }}>
              수호성: {s.ruler}
            </span>
          </div>
        </header>

        {/* Personality */}
        <section style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius)', padding: '1.5rem', border: '1px solid var(--color-border)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '1rem' }}>
            {s.name} 성격
          </h2>
          {renderContent(s.personality)}
        </section>

        {/* Love */}
        <section style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius)', padding: '1.5rem', border: '1px solid var(--color-border)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '1rem' }}>
            연애 & 궁합
          </h2>
          {renderContent(s.love)}
        </section>

        {/* Career */}
        <section style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius)', padding: '1.5rem', border: '1px solid var(--color-border)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '1rem' }}>
            직업 & 적성
          </h2>
          <p>{s.career}</p>
        </section>

        {/* Health */}
        <section style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius)', padding: '1.5rem', border: '1px solid var(--color-border)', marginBottom: '2rem', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '1rem' }}>
            건강 운세
          </h2>
          <p>{s.health}</p>
        </section>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
          <Link href={`/horoscope/${prevSign.slug}`} style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit', flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>이전</div>
            <div style={{ fontWeight: 600 }}>{prevSign.icon} {prevSign.name}</div>
          </Link>
          <Link href={`/horoscope/${nextSign.slug}`} style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit', flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>다음</div>
            <div style={{ fontWeight: 600 }}>{nextSign.icon} {nextSign.name}</div>
          </Link>
        </div>

        {/* All Signs Grid */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>전체 별자리</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
            {signsData.map((ss) => (
              <Link
                key={ss.slug}
                href={`/horoscope/${ss.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: ss.slug === s.slug ? 'var(--color-cta)' : 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  textDecoration: 'none',
                  color: 'inherit',
                  fontSize: '0.85rem',
                  fontWeight: ss.slug === s.slug ? 600 : 400,
                }}
              >
                <span>{ss.icon}</span>
                <span>{ss.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/horoscope" style={{ display: 'inline-block', padding: '0.75rem 2rem', background: 'var(--gradient-primary)', color: '#fff', borderRadius: 'var(--radius-full)', textDecoration: 'none', fontWeight: 600 }}>
            오늘의 별자리 운세 보기
          </Link>
        </div>
      </div>
    </>
  );
}
