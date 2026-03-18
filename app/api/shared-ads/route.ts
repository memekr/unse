import { NextResponse } from 'next/server';

const SHARED_ADS_API = 'https://yuchul.com/api/shared-ads';
const SITE_ID = 'unse';

/**
 * GET /api/shared-ads
 * 중앙 shared-ads API를 프록시합니다.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placement = searchParams.get('placement') ?? 'inline-card';
  const limit = searchParams.get('limit') ?? '3';

  try {
    const url = `${SHARED_ADS_API}?site=${SITE_ID}&placement=${placement}&limit=${limit}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ site: SITE_ID, version: 2, items: [] });
  }
}
