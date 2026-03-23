import { NextResponse } from 'next/server';
import { addSubscription } from '@/lib/push';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 });
    }

    const result = addSubscription({ endpoint, keys, createdAt: new Date().toISOString() });

    return NextResponse.json({
      ok: true,
      added: result.added,
      total: result.total,
    });
  } catch (err) {
    console.error('Push subscribe error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
