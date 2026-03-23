'use client';

import type { ComponentType } from 'react';
import type { LocalAd } from '@/lib/ads/local-ads';

type LocalAdBannerProps = {
  ad: LocalAd | null;
  variant?: 'inline' | 'banner' | 'native';
};

let Impl: ComponentType<LocalAdBannerProps> | null = null;
try { Impl = require('../../_private/ads/LocalAdBanner').default; } catch { /* private module not available */ }

export default function LocalAdBanner(props: LocalAdBannerProps) {
  if (Impl) return <Impl {...props} />;
  return null;
}
