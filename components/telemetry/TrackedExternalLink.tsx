'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import type { AppEventName, AppEventData } from '@/lib/telemetry/client';
import { emitAppEvent } from '@/lib/telemetry/client';

type TrackedExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  clickEvent?: AppEventName;
  clickData?: AppEventData;
  impressionEvent?: AppEventName;
  impressionData?: AppEventData;
};

export default function TrackedExternalLink({
  href,
  children,
  className,
  target = '_blank',
  rel = 'noopener noreferrer',
  clickEvent,
  clickData,
  impressionEvent,
  impressionData,
}: TrackedExternalLinkProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const hasSentImpression = useRef(false);

  useEffect(() => {
    if (!impressionEvent || hasSentImpression.current || !linkRef.current) return;

    const element = linkRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasSentImpression.current) return;

        hasSentImpression.current = true;
        emitAppEvent(impressionEvent, impressionData ?? {});
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [impressionData, impressionEvent]);

  return (
    <a
      ref={linkRef}
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={() => {
        if (clickEvent) emitAppEvent(clickEvent, clickData ?? {});
      }}
    >
      {children}
    </a>
  );
}
