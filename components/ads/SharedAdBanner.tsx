// @ts-nocheck
'use client';

import type { ResolvedAdCreative, SharedAdVariant } from '@/lib/ads/shared-feed';

type SharedAdBannerProps = {
  ad: ResolvedAdCreative | null;
  variant?: SharedAdVariant;
  className?: string;
};

let Impl: any = null;
try { Impl = require('../../_private/ads/SharedAdBanner').default; } catch {}

export default function SharedAdBanner(props: SharedAdBannerProps) {
  if (Impl) return <Impl {...props} />;
  return null;
}
