/**
 * 상품 추천 API 핸들러 (스텁)
 * 실제 구현은 빌드 시 _private/ 모듈로 대체됩니다.
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  return NextResponse.json({ products: [] });
}

export async function GET(_req: NextRequest) {
  return NextResponse.json({ products: [] });
}
