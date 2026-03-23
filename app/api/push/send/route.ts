import { NextResponse } from 'next/server';
import { sendToAll, getSubscriptionCount } from '@/lib/push';

/**
 * POST /api/push/send
 * 모든 구독자에게 푸시 알림 전송
 *
 * Body (선택):
 *   title: 알림 제목
 *   body: 알림 본문
 *   url: 클릭 시 이동할 URL
 *
 * 인증: CRON_SECRET 헤더 또는 Authorization Bearer
 */
export async function POST(request: Request) {
  try {
    // 인증 필수 (크론 시크릿 또는 VAPID key)
    const authHeader = request.headers.get('authorization') || request.headers.get('x-cron-secret');
    const secret = process.env.CRON_SECRET || process.env.VAPID_PRIVATE_KEY;
    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));

    const count = getSubscriptionCount();
    if (count === 0) {
      return NextResponse.json({ ok: true, message: 'No subscribers', sent: 0 });
    }

    const payload = {
      title: body.title || '운세미',
      body: body.body || '오늘의 운세가 도착했습니다! 확인해보세요.',
      icon: body.icon || '/icon-192.png',
      badge: body.badge || '/icon-192.png',
      url: body.url || '/horoscope',
    };

    const result = await sendToAll(payload);

    return NextResponse.json({
      ok: true,
      ...result,
      total: count,
    });
  } catch (err) {
    console.error('Push send error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
