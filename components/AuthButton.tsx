'use client';

import type { ComponentType } from 'react';

let Impl: ComponentType<Record<string, never>> | null = null;
try { Impl = require('../_private/auth/AuthButton').default; } catch { /* private module not available */ }

export default function AuthButton() {
  if (Impl) return <Impl />;
  return null;
}
