import { NextResponse } from 'next/server';
import { removeSubscription } from '@/lib/push';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
    }

    const result = removeSubscription(endpoint);

    return NextResponse.json({
      ok: true,
      removed: result.removed,
      total: result.total,
    });
  } catch (err) {
    console.error('Push unsubscribe error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
