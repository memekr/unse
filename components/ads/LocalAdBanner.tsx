// @ts-nocheck
'use client';

import type { LocalAd } from '@/lib/ads/local-ads';

type LocalAdBannerProps = {
  ad: LocalAd | null;
  variant?: 'inline' | 'banner' | 'native';
};

let Impl: any = null;
try { Impl = require('../../_private/ads/LocalAdBanner').default; } catch {}

export default function LocalAdBanner(props: LocalAdBannerProps) {
  if (Impl) return <Impl {...props} />;
  return null;
}
