'use client';

import type { ComponentType } from 'react';

let Impl: ComponentType<Record<string, never>> | null = null;
try { Impl = require('../_private/analytics/GoogleAnalytics').default; } catch { /* private module not available */ }

export default function GoogleAnalytics() {
  if (Impl) return <Impl />;
  return null;
}
