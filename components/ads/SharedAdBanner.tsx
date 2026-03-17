'use client';

import type { ResolvedAdCreative, SharedAdVariant } from '@/lib/ads/shared-feed';
import TrackedExternalLink from '@/components/telemetry/TrackedExternalLink';

type SharedAdBannerProps = {
  ad: ResolvedAdCreative | null;
  variant?: SharedAdVariant;
  className?: string;
};

export default function SharedAdBanner({
  ad,
  variant = 'inline-card',
  className,
}: SharedAdBannerProps) {
  if (!ad) return null;

  const eventData = {
    site: ad.site,
    placement: ad.placement,
    creative_id: ad.id,
    sponsor: ad.sponsor,
    destination: ad.href,
  };

  const variantClasses: Record<SharedAdVariant, string> = {
    'inline-card': 'shared-ad shared-ad--inline',
    sidebar: 'shared-ad shared-ad--sidebar',
    'footer-strip': 'shared-ad shared-ad--footer',
  };

  return (
    <aside className={[variantClasses[variant], className].filter(Boolean).join(' ')}>
      <div className="shared-ad__topline">
        <span className="shared-ad__badge">{ad.badge}</span>
        <span className="shared-ad__sponsor">{ad.sponsor}</span>
      </div>
      <div className="shared-ad__body">
        <div>
          <h3 className="shared-ad__title">{ad.title}</h3>
          <p className="shared-ad__desc">{ad.description}</p>
        </div>
        <TrackedExternalLink
          href={ad.href}
          rel="sponsored nofollow noopener noreferrer"
          className="shared-ad__cta"
          clickEvent="ad_click"
          clickData={eventData}
          impressionEvent="ad_impression"
          impressionData={{ ...eventData, entity_type: 'ad' }}
        >
          {ad.cta}
        </TrackedExternalLink>
      </div>
    </aside>
  );
}
