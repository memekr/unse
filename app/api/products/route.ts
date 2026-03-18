// @ts-nocheck
/**
 * 상품 추천 API
 * _private/ 모듈이 있으면 실제 구현, 없으면 빈 배열
 */
import { NextRequest, NextResponse } from 'next/server';

let handler: any;
try {
  handler = require('../../../_private/ads/products-handler');
} catch {
  handler = null;
}

export async function POST(req: NextRequest) {
  if (handler?.POST) return handler.POST(req);
  return NextResponse.json({ products: [] });
}

export async function GET(req: NextRequest) {
  if (handler?.GET) return handler.GET(req);
  return NextResponse.json({ products: [] });
}
