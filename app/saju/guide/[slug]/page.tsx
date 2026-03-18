import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import sajuGuides from '@/data/saju-guides.json';
import Link from 'next/link';

type Guide = (typeof sajuGuides)[number];

function getGuide(slug: string): Guide | undefined {
  return sajuGuides.find((g) => g.slug === slug);
}

export async function generateStaticParams() {
  return sajuGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `https://unse.me/saju/guide/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://unse.me/saju/guide/${guide.slug}`,
      type: 'article',
      locale: 'ko_KR',
      siteName: '운세미',
    },
  };
}

export default async function SajuGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    url: `https://unse.me/saju/guide/${guide.slug}`,
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
      { '@type': 'ListItem', position: 2, name: '사주풀이', item: 'https://unse.me/saju' },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `https://unse.me/saju/guide/${guide.slug}` },
    ],
  };

  const sections = guide.content.split('\n\n');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <nav style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>홈</Link>
          {' > '}
          <Link href="/saju" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>사주풀이</Link>
          {' > '}
          <span>{guide.category}</span>
        </nav>

        <header style={{ marginBottom: '2rem' }}>
          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', backgroundColor: 'var(--color-badge-bg)', color: 'var(--color-badge-text)', display: 'inline-block', marginBottom: '0.75rem' }}>
            {guide.category}
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem' }}>
            {guide.title}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{guide.description}</p>
        </header>

        <article style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius)', padding: '1.5rem', border: '1px solid var(--color-border)', marginBottom: '2rem', lineHeight: 1.8 }}>
          {sections.map((section, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              {section.split('\n').map((line, j) => {
                if (line.startsWith('### ')) return <h3 key={j} style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem' }}>{line.replace('### ', '')}</h3>;
                if (line.startsWith('## ')) return <h2 key={j} style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>{line.replace('## ', '')}</h2>;
                if (line.startsWith('- ')) return <li key={j} style={{ marginLeft: '1.25rem', marginBottom: '0.25rem', listStyleType: 'disc' }}>{line.replace('- ', '')}</li>;
                if (!line.trim()) return null;
                return <p key={j} style={{ marginBottom: '0.5rem' }}>{line}</p>;
              })}
            </div>
          ))}
        </article>

        {/* Other Guides */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>다른 사주 가이드</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {sajuGuides.filter((g) => g.slug !== guide.slug).map((g) => (
              <Link key={g.slug} href={`/saju/guide/${g.slug}`} style={{ display: 'block', padding: '1rem', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>{g.category}</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{g.title}</div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/saju" style={{ display: 'inline-block', padding: '0.75rem 2rem', background: 'var(--gradient-primary)', color: '#fff', borderRadius: 'var(--radius-full)', textDecoration: 'none', fontWeight: 600 }}>
            내 사주 풀어보기
          </Link>
        </div>
      </div>
    </>
  );
}
