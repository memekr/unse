import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/* ─────────────────────────────────────────
 * 상품 검색 API — 쿠팡파트너스 & 네이버 쇼핑
 *
 * GET /api/products?keyword=행운+팔찌&source=coupang
 * GET /api/products?keyword=행운+팔찌&source=naver
 * GET /api/products?keyword=행운+팔찌  (둘 다 시도, fallback)
 * ───────────────────────────────────────── */

// ── 타입 ──

export type ProductItem = {
  id: string;
  title: string;
  price: string;
  image: string;
  link: string;       // 제휴 링크
  source: 'coupang' | 'naver';
  category?: string;
  rating?: number;
};

type ProductResponse = {
  products: ProductItem[];
  keyword: string;
  source: string;
  cached: boolean;
};

// ── 메모리 캐시 (5분) ──

const cache = new Map<string, { data: ProductItem[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key: string): ProductItem[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key: string, data: ProductItem[]) {
  cache.set(key, { data, ts: Date.now() });
  // 캐시 크기 제한 (최대 200개)
  if (cache.size > 200) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
}

// ── 쿠팡파트너스 API ──

function generateCoupangHmac(method: string, path: string, datetime: string): string {
  const accessKey = process.env.COUPANG_ACCESS_KEY ?? '';
  const secretKey = process.env.COUPANG_SECRET_KEY ?? '';

  const message = `${datetime}${method}${path}`;
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(message);
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${hmac.digest('hex')}`;
}

async function searchCoupang(keyword: string, limit = 5): Promise<ProductItem[]> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) return [];

  try {
    const datetime = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14) + 'Z';
    const subId = process.env.COUPANG_SUB_ID ?? 'unse';
    const path = `/v2/providers/affiliate_open_api/apis/openapi/products/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}&subId=${subId}`;
    const authorization = generateCoupangHmac('GET', path, datetime);

    const res = await fetch(`https://api-gateway.coupang.com${path}`, {
      headers: { 'Authorization': authorization },
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];
    const json = await res.json();

    const items: ProductItem[] = (json.data?.productData ?? []).map((p: Record<string, unknown>) => ({
      id: `cpg_${p.productId}`,
      title: String(p.productName ?? ''),
      price: Number(p.productPrice ?? 0).toLocaleString('ko-KR') + '원',
      image: String(p.productImage ?? ''),
      link: String(p.productUrl ?? ''),
      source: 'coupang' as const,
      category: String(p.categoryName ?? ''),
      rating: Number(p.productRating ?? 0),
    }));

    return items;
  } catch {
    return [];
  }
}

// ── 네이버 쇼핑 API ──

async function searchNaver(keyword: string, limit = 5): Promise<ProductItem[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return [];

  try {
    const res = await fetch(
      `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(keyword)}&display=${limit}&sort=sim`,
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) return [];
    const json = await res.json();

    const items: ProductItem[] = (json.items ?? []).map((p: Record<string, unknown>, i: number) => {
      // 네이버 쇼핑 결과에서 제휴 링크 생성
      const link = String(p.link ?? '');
      return {
        id: `nvr_${i}_${Date.now()}`,
        title: String(p.title ?? '').replace(/<\/?b>/g, ''),
        price: Number(p.lprice ?? 0).toLocaleString('ko-KR') + '원',
        image: String(p.image ?? ''),
        link,
        source: 'naver' as const,
        category: String(p.category1 ?? ''),
        rating: 0,
      };
    });

    return items;
  } catch {
    return [];
  }
}

// ── 핸들러 ──

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const keyword = searchParams.get('keyword')?.trim();
  const source = searchParams.get('source') ?? 'all';
  const limitParam = Math.min(Number(searchParams.get('limit') ?? 4), 10);

  if (!keyword) {
    return NextResponse.json({ error: 'keyword 파라미터가 필요합니다' }, { status: 400 });
  }

  const cacheKey = `${source}:${keyword}:${limitParam}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json({
      products: cached,
      keyword,
      source,
      cached: true,
    } satisfies ProductResponse);
  }

  let products: ProductItem[] = [];

  if (source === 'coupang' || source === 'all') {
    products = await searchCoupang(keyword, limitParam);
  }

  if ((source === 'naver' || source === 'all') && products.length < limitParam) {
    const naverProducts = await searchNaver(keyword, limitParam - products.length);
    products = [...products, ...naverProducts];
  }

  // 결과가 아예 없으면 빈 배열 반환 (프론트에서 기존 배너로 폴백)
  setCache(cacheKey, products);

  return NextResponse.json({
    products,
    keyword,
    source,
    cached: false,
  } satisfies ProductResponse);
}
