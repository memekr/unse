'use client';

import type { ComponentType } from 'react';
import type { ResolvedAdCreative, SharedAdVariant } from '@/lib/ads/shared-feed';

type SharedAdBannerProps = {
  ad: ResolvedAdCreative | null;
  variant?: SharedAdVariant;
  className?: string;
};

let Impl: ComponentType<SharedAdBannerProps> | null = null;
try { Impl = require('../../_private/ads/SharedAdBanner').default; } catch { /* private module not available */ }

export default function SharedAdBanner(props: SharedAdBannerProps) {
  if (Impl) return <Impl {...props} />;
  return null;
}
