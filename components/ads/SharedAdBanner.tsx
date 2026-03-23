'use client';

import type { ResolvedAdCreative, SharedAdVariant } from '@/lib/ads/shared-feed';
import { emitAppEvent } from '@/lib/telemetry/client';

type SharedAdBannerProps = {
  ad: ResolvedAdCreative | null;
  variant?: SharedAdVariant;
  className?: string;
};

export default function SharedAdBanner({ ad, variant = 'inline-card', className }: SharedAdBannerProps) {
  if (!ad) return null;

  const handleAdClick = () => {
    emitAppEvent('ad_click', { site: 'unse', sponsor: ad.sponsor, title: ad.title, href: ad.href });
  };

  if (variant === 'footer-strip') {
    return (
      <aside
        className={['rounded-xl border border-purple-900/30 bg-purple-950/20 p-3 flex flex-wrap items-center justify-between gap-3', className].filter(Boolean).join(' ')}
      >
        <div className="flex items-center gap-3">
          <span className="rounded bg-purple-900/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-400">
            {ad.badge}
          </span>
          <div>
            <span className="text-sm font-bold text-white">{ad.title}</span>
            <span className="ml-2 text-xs text-purple-300/60">{ad.sponsor}</span>
          </div>
        </div>
        <a
          href={ad.href}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="rounded-lg bg-purple-600 px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-purple-500"
          onClick={handleAdClick}
        >
          {ad.cta}
        </a>
      </aside>
    );
  }

  if (variant === 'sidebar') {
    return (
      <aside
        className={['rounded-xl border border-purple-900/30 bg-purple-950/20 p-3', className].filter(Boolean).join(' ')}
      >
        <p className="text-[9px] font-bold uppercase tracking-wider text-purple-400">{ad.badge}</p>
        <h3 className="mt-2 text-sm font-bold text-white">{ad.title}</h3>
        <p className="mt-1 text-xs leading-5 text-purple-200/60">{ad.description}</p>
        <a
          href={ad.href}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="mt-2 inline-block text-[10px] font-semibold text-purple-400 transition-colors hover:text-purple-300"
          onClick={handleAdClick}
        >
          {ad.cta} &rarr;
        </a>
      </aside>
    );
  }

  // inline-card (default)
  return (
    <aside
      className={['rounded-xl border border-purple-900/30 bg-purple-950/20 p-4', className].filter(Boolean).join(' ')}
    >
      <div className="flex items-center gap-2">
        <span className="rounded bg-purple-900/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-400">
          {ad.badge}
        </span>
        <span className="text-[10px] text-purple-300/60">{ad.sponsor}</span>
      </div>
      <h3 className="mt-2 text-sm font-bold text-white">{ad.title}</h3>
      <p className="mt-1 text-xs leading-5 text-purple-200/60">{ad.description}</p>
      <a
        href={ad.href}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="mt-3 inline-block rounded-lg bg-purple-600 px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-purple-500"
        onClick={handleAdClick}
      >
        {ad.cta}
      </a>
    </aside>
  );
}
