// @ts-nocheck
'use client';

let Impl: any = null;
try { Impl = require('../_private/analytics/GoogleAnalytics').default; } catch {}

export default function GoogleAnalytics(props: any) {
  if (Impl) return <Impl {...props} />;
  return null;
}
