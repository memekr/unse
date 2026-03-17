import { NextResponse } from 'next/server';

/**
 * POST /api/events
 * 클라이언트 텔레메트리 이벤트 수집 엔드포인트
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (process.env.NODE_ENV === 'development') {
      console.log('[event]', payload.name, payload.data);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
