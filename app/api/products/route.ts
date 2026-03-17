import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/* ─────────────────────────────────────────
 * 쿠팡파트너스 상품 검색 API
 *
 * GET /api/products?keyword=행운+팔찌&limit=4
 *
 * - 시간당 10회 제한 → 1시간 메모리 캐시
 * - API 키 미설정 시 빈 배열 반환 (프론트에서 기존 배너 폴백)
 * ───────────────────────────────────────── */

export type ProductItem = {
  id: string;
  title: string;
  price: string;
  image: string;
  link: string;
  source: 'coupang';
  category?: string;
};

type ProductResponse = {
  products: ProductItem[];
  keyword: string;
  cached: boolean;
};

// ── 메모리 캐시 (1시간) ──

const cache = new Map<string, { data: ProductItem[]; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000;

function getCached(key: string): ProductItem[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key: string, data: ProductItem[]) {
  cache.set(key, { data, ts: Date.now() });
  if (cache.size > 200) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
}

// ── 쿠팡파트너스 HMAC 인증 ──

function generateHmac(method: string, urlPath: string): string {
  const accessKey = process.env.COUPANG_ACCESS_KEY ?? '';
  const secretKey = process.env.COUPANG_SECRET_KEY ?? '';

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const datetime = `${String(now.getUTCFullYear()).slice(2)}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  const message = `${datetime}${method}${urlPath}`;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

async function searchCoupang(keyword: string, limit = 4): Promise<ProductItem[]> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) return [];

  try {
    const subId = process.env.COUPANG_SUB_ID ?? 'unse';
    const path = `/v2/providers/affiliate_open_api/apis/openapi/products/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}&subId=${subId}`;
    const authorization = generateHmac('GET', path);

    const res = await fetch(`https://api-gateway.coupang.com${path}`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    if (!res.ok) {
      console.error(`[쿠팡] ${res.status} ${res.statusText}`);
      return [];
    }

    const json = await res.json();

    if (json.rCode !== '0' && json.rCode !== 0) {
      console.error(`[쿠팡] rCode=${json.rCode}, rMessage=${json.rMessage}`);
      return [];
    }

    return (json.data?.productData ?? []).map((p: Record<string, unknown>) => ({
      id: `cpg_${p.productId}`,
      title: String(p.productName ?? ''),
      price: Number(p.productPrice ?? 0).toLocaleString('ko-KR') + '원',
      image: String(p.productImage ?? ''),
      link: String(p.productUrl ?? ''),
      source: 'coupang' as const,
      category: String(p.categoryName ?? ''),
    }));
  } catch (err) {
    console.error('[쿠팡] 에러:', err);
    return [];
  }
}

// ── 핸들러 ──

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const keyword = searchParams.get('keyword')?.trim();
  const limitParam = Math.min(Number(searchParams.get('limit') ?? 4), 10);

  if (!keyword) {
    return NextResponse.json({ error: 'keyword 파라미터가 필요합니다' }, { status: 400 });
  }

  const cacheKey = `${keyword}:${limitParam}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json({ products: cached, keyword, cached: true } satisfies ProductResponse);
  }

  const products = await searchCoupang(keyword, limitParam);
  setCache(cacheKey, products);

  return NextResponse.json({ products, keyword, cached: false } satisfies ProductResponse);
}
