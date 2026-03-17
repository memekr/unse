/**
 * 클라이언트 텔레메트리 — 광고 클릭, 노출 등 이벤트 수집
 * sendBeacon 우선, fallback fetch
 */

export type AppEventName = 'ad_click' | 'ad_impression' | 'page_view' | 'cta_click';

type EventDataValue = string | number | boolean | null | undefined;
export type AppEventData = Record<string, EventDataValue>;

type AppEventPayload = {
  name: AppEventName;
  data: AppEventData;
  ts: string;
  path?: string;
  href?: string;
};

const EVENT_ENDPOINT = '/api/events';

function buildPayload(name: AppEventName, data: AppEventData): AppEventPayload {
  if (typeof window === 'undefined') {
    return { name, data, ts: new Date().toISOString() };
  }
  return {
    name,
    data,
    ts: new Date().toISOString(),
    path: window.location.pathname,
    href: window.location.href,
  };
}

export function emitAppEvent(name: AppEventName, data: AppEventData = {}) {
  if (typeof window === 'undefined') return;

  const payload = buildPayload(name, data);
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(EVENT_ENDPOINT, blob);
      return;
    }
  } catch {
    // fall through to fetch
  }

  void fetch(EVENT_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    credentials: 'same-origin',
    keepalive: true,
  }).catch(() => undefined);
}
