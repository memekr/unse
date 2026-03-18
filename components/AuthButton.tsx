// @ts-nocheck
'use client';

let Impl: any = null;
try { Impl = require('../_private/auth/AuthButton').default; } catch {}

export default function AuthButton(props: any) {
  if (Impl) return <Impl {...props} />;
  return null;
}
