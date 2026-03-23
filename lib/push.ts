/**
 * Web Push 유틸리티 — VAPID 기반
 * 구독 정보는 data/push-subscriptions.json에 저장 (로컬 크론 전용)
 */
import webpush from 'web-push';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ── VAPID 설정 ──
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@unse.me';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// ── 구독 저장소 (JSON 파일) ──
const SUBSCRIPTIONS_FILE = resolve(process.cwd(), 'data', 'push-subscriptions.json');

export type PushSubscriptionData = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: string;
};

function loadSubscriptions(): PushSubscriptionData[] {
  try {
    if (!existsSync(SUBSCRIPTIONS_FILE)) return [];
    const raw = readFileSync(SUBSCRIPTIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveSubscriptions(subs: PushSubscriptionData[]): void {
  writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2), 'utf-8');
}

export function addSubscription(sub: PushSubscriptionData): { added: boolean; total: number } {
  const subs = loadSubscriptions();
  const exists = subs.some((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subs.push({ ...sub, createdAt: new Date().toISOString() });
    saveSubscriptions(subs);
    return { added: true, total: subs.length };
  }
  return { added: false, total: subs.length };
}

export function removeSubscription(endpoint: string): { removed: boolean; total: number } {
  const subs = loadSubscriptions();
  const filtered = subs.filter((s) => s.endpoint !== endpoint);
  const removed = filtered.length < subs.length;
  if (removed) {
    saveSubscriptions(filtered);
  }
  return { removed, total: filtered.length };
}

export function getSubscriptionCount(): number {
  return loadSubscriptions().length;
}

export async function sendToAll(payload: {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
}): Promise<{ sent: number; failed: number; removed: number }> {
  const subs = loadSubscriptions();
  const payloadStr = JSON.stringify(payload);

  let sent = 0;
  let failed = 0;
  const expiredEndpoints: string[] = [];

  const results = await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          payloadStr,
        );
        sent++;
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        // 410 Gone 또는 404: 구독 만료/삭제됨
        if (statusCode === 410 || statusCode === 404) {
          expiredEndpoints.push(sub.endpoint);
        }
        failed++;
      }
    }),
  );

  // 만료된 구독 제거
  if (expiredEndpoints.length > 0) {
    const cleaned = subs.filter((s) => !expiredEndpoints.includes(s.endpoint));
    saveSubscriptions(cleaned);
  }

  void results; // allSettled result consumed above

  return { sent, failed, removed: expiredEndpoints.length };
}
