import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/* ─────────────────────────────────────────
 * 상품 검색 API
 *
 * 쿠팡파트너스: API로 실시간 상품 검색 (시간당 10회 제한)
 * 네이버 쇼핑커넥트: 수동 등록 링크 (공개 API 없음)
 *
 * GET /api/products?keyword=행운+팔찌&limit=4
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
  cached: boolean;
};

// ── 메모리 캐시 (1시간 — 쿠팡 API 시간당 10회 제한 대응) ──

const cache = new Map<string, { data: ProductItem[]; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1시간

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

// ── 쿠팡파트너스 HMAC 인증 (공식 스펙) ──
// Authorization: CEA algorithm=HmacSHA256, access-key=..., signed-date=..., signature=...
// message = datetime + method + path(쿼리스트링 포함)

function generateCoupangHmac(method: string, urlPath: string): string {
  const accessKey = process.env.COUPANG_ACCESS_KEY ?? '';
  const secretKey = process.env.COUPANG_SECRET_KEY ?? '';

  // 쿠팡 공식 datetime 형식: yyMMddTHHmmssZ
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
    const authorization = generateCoupangHmac('GET', path);

    const res = await fetch(`https://api-gateway.coupang.com${path}`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    if (!res.ok) {
      console.error(`[쿠팡 API] ${res.status} ${res.statusText}`);
      return [];
    }

    const json = await res.json();

    // 쿠팡 응답: { rCode: "0", rMessage: "", data: { productData: [...] } }
    if (json.rCode !== '0' && json.rCode !== 0) {
      console.error(`[쿠팡 API] rCode=${json.rCode}, rMessage=${json.rMessage}`);
      return [];
    }

    const items: ProductItem[] = (json.data?.productData ?? []).map((p: Record<string, unknown>) => ({
      id: `cpg_${p.productId}`,
      title: String(p.productName ?? ''),
      price: Number(p.productPrice ?? 0).toLocaleString('ko-KR') + '원',
      image: String(p.productImage ?? ''),
      link: String(p.productUrl ?? ''),  // 이미 제휴 트래킹 URL
      source: 'coupang' as const,
      category: String(p.categoryName ?? ''),
      rating: Number(p.productRating ?? 0),
    }));

    return items;
  } catch (err) {
    console.error('[쿠팡 API] 에러:', err);
    return [];
  }
}

// ── 네이버 쇼핑커넥트 수동 링크 관리 ──
// 브랜드커넥트에서 발급받은 제휴 링크를 카테고리별로 등록
// 공개 API가 없어 수동 관리 필요

type NaverManualProduct = {
  id: string;
  title: string;
  price: string;
  image: string;
  link: string;
  category: string;
  keywords: string[];  // 매칭용 키워드
};

// 여기에 브랜드커넥트에서 발급받은 상품 링크를 등록하세요
// link는 브랜드커넥트 대시보드에서 복사한 제휴 URL
const NAVER_MANUAL_PRODUCTS: NaverManualProduct[] = [
  // 예시 (실제 링크로 교체 필요):
  // {
  //   id: 'nvr_1',
  //   title: '천연 자수정 팔찌 행운 액세서리',
  //   price: '15,900원',
  //   image: 'https://shop-phinf.pstatic.net/...jpg',
  //   link: 'https://smartstore.naver.com/...?n_media=...',
  //   category: '액세서리',
  //   keywords: ['자수정', '팔찌', '보라', '힐링', '행운'],
  // },
];

function searchNaverManual(keyword: string, limit = 4): ProductItem[] {
  if (NAVER_MANUAL_PRODUCTS.length === 0) return [];

  // 키워드 매칭 점수 계산
  const keywordParts = keyword.split(/\s+/).filter(Boolean);
  const scored = NAVER_MANUAL_PRODUCTS.map(p => {
    let score = 0;
    for (const part of keywordParts) {
      if (p.title.includes(part)) score += 2;
      if (p.keywords.some(k => k.includes(part) || part.includes(k))) score += 1;
      if (p.category.includes(part)) score += 1;
    }
    return { ...p, score };
  });

  return scored
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.image,
      link: p.link,
      source: 'naver' as const,
      category: p.category,
      rating: 0,
    }));
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
    return NextResponse.json({
      products: cached,
      keyword,
      cached: true,
    } satisfies ProductResponse);
  }

  // 1) 쿠팡에서 검색
  let products = await searchCoupang(keyword, limitParam);

  // 2) 부족하면 네이버 수동 링크에서 보충
  if (products.length < limitParam) {
    const naverProducts = searchNaverManual(keyword, limitParam - products.length);
    products = [...products, ...naverProducts];
  }

  setCache(cacheKey, products);

  return NextResponse.json({
    products,
    keyword,
    cached: false,
  } satisfies ProductResponse);
}
