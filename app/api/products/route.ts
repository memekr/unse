import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  pickItems,
  coupangSearchUrl,
  type FortuneContext,
  type PoolItem,
} from '@/lib/product-pool';

/* ─────────────────────────────────────────
 * 쿠팡파트너스 추천 상품 API (딥링크 방식)
 *
 * POST /api/products  body: FortuneContext
 *
 * 1. 운세 결과 → 상품 풀에서 아이템 선택
 * 2. 쿠팡 검색 URL 생성
 * 3. 딥링크 API로 제휴 추적 링크 변환
 * 4. 실패 시 원본 쿠팡 검색 URL 반환 (항상 상품 표시)
 * ───────────────────────────────────────── */

export type ProductItem = {
  id: string;
  title: string;
  emoji: string;
  keyword: string;
  link: string;
  isAffiliate: boolean;
  source: 'coupang';
};

// ── 딥링크 캐시 (1시간) ──

const deeplinkCache = new Map<string, { url: string; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000;

// ── HMAC 인증 ──

function generateHmac(method: string, path: string, query: string): string {
  const accessKey = process.env.COUPANG_ACCESS_KEY ?? '';
  const secretKey = process.env.COUPANG_SECRET_KEY ?? '';

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const datetime = `${String(now.getUTCFullYear()).slice(2)}${pad(
    now.getUTCMonth() + 1
  )}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(
    now.getUTCMinutes()
  )}${pad(now.getUTCSeconds())}Z`;

  // 메시지: datetime + method + path + query  (path와 query 사이에 '?' 없음)
  const message = `${datetime}${method}${path}${query}`;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

/**
 * 쿠팡 URL 배열 → 딥링크(제휴 추적 URL) 변환
 * POST /v2/providers/affiliate_open_api/apis/openapi/v1/deeplink
 */
async function convertToDeeplinks(
  urls: string[]
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) return result;

  // 캐시된 것 먼저 채우고, 변환 필요한 것만 추림
  const toConvert: string[] = [];
  const now = Date.now();

  for (const url of urls) {
    const cached = deeplinkCache.get(url);
    if (cached && now - cached.ts < CACHE_TTL) {
      result.set(url, cached.url);
    } else {
      toConvert.push(url);
    }
  }

  if (toConvert.length === 0) return result;

  try {
    const subId = process.env.COUPANG_SUB_ID ?? 'unse';
    const apiPath = '/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink';
    const authorization = generateHmac('POST', apiPath, '');

    const body = JSON.stringify({
      coupangUrls: toConvert,
      subId,
    });

    const res = await fetch(`https://api-gateway.coupang.com${apiPath}`, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body,
    });

    if (!res.ok) {
      console.error(`[쿠팡 딥링크] ${res.status} ${res.statusText}`);
      return result;
    }

    const json = await res.json();

    if (json.rCode !== '0' && json.rCode !== 0) {
      console.error(
        `[쿠팡 딥링크] rCode=${json.rCode}, rMessage=${json.rMessage}`
      );
      return result;
    }

    const data: { originalUrl: string; shortenUrl: string }[] =
      json.data ?? [];

    for (const item of data) {
      if (item.shortenUrl) {
        result.set(item.originalUrl, item.shortenUrl);
        deeplinkCache.set(item.originalUrl, {
          url: item.shortenUrl,
          ts: Date.now(),
        });
      }
    }
  } catch (err) {
    console.error('[쿠팡 딥링크] 에러:', err);
  }

  return result;
}

function poolItemToProduct(
  item: PoolItem,
  affiliateLink: string | undefined
): ProductItem {
  return {
    id: item.id,
    title: item.title,
    emoji: item.emoji,
    keyword: item.keyword,
    link: affiliateLink ?? coupangSearchUrl(item.keyword),
    isAffiliate: !!affiliateLink,
    source: 'coupang',
  };
}

// ── 핸들러 ──

export async function POST(req: NextRequest) {
  try {
    const ctx: FortuneContext = await req.json();

    // 1. 상품 풀에서 선택
    const items = pickItems(ctx, 4);

    // 2. 쿠팡 검색 URL 생성
    const searchUrls = items.map((it) => coupangSearchUrl(it.keyword));

    // 3. 딥링크 변환 시도
    const deeplinks = await convertToDeeplinks(searchUrls);

    // 4. 결과 조합
    const products: ProductItem[] = items.map((item, i) => {
      const originalUrl = searchUrls[i];
      const affiliateUrl = deeplinks.get(originalUrl);
      return poolItemToProduct(item, affiliateUrl);
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error('[products] 에러:', err);
    return NextResponse.json({ products: [], error: 'internal' }, { status: 500 });
  }
}

// GET도 지원 (하위 호환)
export async function GET(req: NextRequest) {
  const ctx: FortuneContext = { type: 'lucky' };
  const items = pickItems(ctx, 4);
  const searchUrls = items.map((it) => coupangSearchUrl(it.keyword));
  const deeplinks = await convertToDeeplinks(searchUrls);

  const products: ProductItem[] = items.map((item, i) => {
    const originalUrl = searchUrls[i];
    return poolItemToProduct(item, deeplinks.get(originalUrl));
  });

  return NextResponse.json({ products });
}
