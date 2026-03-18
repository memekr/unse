import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  webpack: (config) => {
    const alias = config.resolve.alias;

    // ── 광고 모듈 ──
    if (existsSync(resolve(__dirname, '_private/ads'))) {
      const ads = (f) => resolve(__dirname, '_private/ads', f);
      Object.assign(alias, {
        '@/components/ads/ProductAdBanner': ads('ProductAdBanner'),
        '@/components/ads/LocalAdBanner':   ads('LocalAdBanner'),
        '@/components/ads/SharedAdBanner':  ads('SharedAdBanner'),
        '@/lib/ads/local-ads':              ads('local-ads'),
        '@/lib/ads/shared-feed':            ads('shared-feed'),
        '@/lib/ads/products-handler':       ads('products-handler'),
        '@/lib/product-pool':               ads('product-pool'),
      });
    }

    // ── 인증 모듈 (Firebase / Google 로그인) ──
    if (existsSync(resolve(__dirname, '_private/auth'))) {
      const auth = (f) => resolve(__dirname, '_private/auth', f);
      Object.assign(alias, {
        '@/lib/firebase':           auth('firebase'),
        '@/components/AuthContext':  auth('AuthContext'),
        '@/components/AuthButton':  auth('AuthButton'),
      });
    }

    // ── 애널리틱스 모듈 (Google Analytics) ──
    if (existsSync(resolve(__dirname, '_private/analytics'))) {
      const analytics = (f) => resolve(__dirname, '_private/analytics', f);
      Object.assign(alias, {
        '@/components/GoogleAnalytics': analytics('GoogleAnalytics'),
      });
    }

    return config;
  },
};

export default nextConfig;
