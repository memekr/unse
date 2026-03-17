'use client';

import Link from 'next/link';
import type { LocalAd } from '@/lib/ads/local-ads';

type LocalAdBannerProps = {
  ad: LocalAd | null;
  variant?: 'inline' | 'banner' | 'native';
};

export default function LocalAdBanner({ ad, variant = 'inline' }: LocalAdBannerProps) {
  if (!ad) return null;

  const isExternal = ad.href.startsWith('http');
  const rel = isExternal ? 'sponsored nofollow noopener noreferrer' : undefined;

  if (variant === 'native') {
    return (
      <div style={{
        padding: '1rem 1.25rem',
        borderRadius: '1rem',
        background: ad.bgGradient ?? 'var(--color-bg-card)',
        border: '1px solid var(--color-glass-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{
            padding: '0.125rem 0.5rem', borderRadius: '9999px',
            background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-accent)',
            fontSize: '0.625rem', fontWeight: 700,
          }}>
            {ad.badge}
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>
            {ad.sponsor}
          </span>
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.375rem' }}>
          {ad.title}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
          {ad.description}
        </p>
        {isExternal ? (
          <a
            href={ad.href}
            target="_blank"
            rel={rel}
            className="button primary"
            style={{ fontSize: '0.875rem' }}
          >
            {ad.cta}
          </a>
        ) : (
          <Link href={ad.href} className="button primary" style={{ fontSize: '0.875rem' }}>
            {ad.cta}
          </Link>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div style={{
        padding: '0.75rem 1rem',
        borderRadius: '0.75rem',
        background: ad.bgGradient ?? 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(251,191,36,0.08))',
        border: '1px solid var(--color-glass-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '12rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
            <span style={{
              padding: '0.0625rem 0.375rem', borderRadius: '9999px',
              background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-accent)',
              fontSize: '0.5625rem', fontWeight: 700,
            }}>
              {ad.badge}
            </span>
            <span style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)' }}>
              {ad.sponsor}
            </span>
          </div>
          <strong style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>
            {ad.title}
          </strong>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0' }}>
            {ad.description}
          </p>
        </div>
        {isExternal ? (
          <a
            href={ad.href}
            target="_blank"
            rel={rel}
            className="button primary"
            style={{ fontSize: '0.8125rem', flexShrink: 0 }}
          >
            {ad.cta}
          </a>
        ) : (
          <Link href={ad.href} className="button primary" style={{ fontSize: '0.8125rem', flexShrink: 0 }}>
            {ad.cta}
          </Link>
        )}
      </div>
    );
  }

  // inline (기본)
  return (
    <div style={{
      padding: '1.25rem',
      borderRadius: '1rem',
      background: ad.bgGradient ?? 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(251,191,36,0.08))',
      border: '1px solid var(--color-border)',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{
          padding: '0.125rem 0.5rem', borderRadius: '9999px',
          background: 'rgba(139, 92, 246, 0.15)', color: 'var(--color-accent)',
          fontSize: '0.625rem', fontWeight: 700,
        }}>
          {ad.badge}
        </span>
        <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>
          {ad.sponsor}
        </span>
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem' }}>
        {ad.title}
      </h3>
      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', marginBottom: '0.75rem' }}>
        {ad.description}
      </p>
      {isExternal ? (
        <a
          href={ad.href}
          target="_blank"
          rel={rel}
          className="button primary"
          style={{ fontSize: '0.875rem' }}
        >
          {ad.cta}
        </a>
      ) : (
        <Link href={ad.href} className="button primary" style={{ fontSize: '0.875rem' }}>
          {ad.cta}
        </Link>
      )}
      <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
        {'제휴 링크를 통해 구매 시 운세미 운영에 도움이 됩니다'}
      </p>
    </div>
  );
}
