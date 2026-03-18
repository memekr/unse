import type { Metadata, Viewport } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import { siteConfig } from '@/lib/site-config';
import SiteShell from '@/components/SiteShell';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { AuthProvider } from '@/components/AuthContext';
import './globals.css';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

const siteUrl = 'https://unse.me';
const siteName = '운세미';
const siteTitle = '운세미 | 오늘의 운세 · 사주 · 타로 · 꿈해몽 · 별자리';
const siteDescription = 'AI 기반 무료 운세 서비스. 띠별·별자리별 오늘의 운세, 사주풀이, 타로카드 해석, 꿈해몽을 정확하게 풀어드립니다.';

export const viewport: Viewport = {
  themeColor: '#0D0A1A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | 운세미',
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    '운세',
    '오늘의운세',
    '사주',
    '타로',
    '꿈해몽',
    '별자리운세',
    '띠별운세',
    '무료운세',
    'AI운세',
    '궁합',
    '운세미',
  ],
  authors: [{ name: '운세미', url: siteUrl }],
  creator: '운세미',
  publisher: '운세미',
  manifest: '/manifest.json',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: { 'ko-KR': siteUrl },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteName,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: siteTitle,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/og-image.png'],
    creator: '@unse_me',
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
      : {}),
    other: {
      ...(siteConfig.naverVerification
        ? { 'naver-site-verification': siteConfig.naverVerification }
        : {}),
    },
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    inLanguage: 'ko',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/dream?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/icon-512.png`,
      width: 512,
      height: 512,
    },
    sameAs: [],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: siteUrl,
      },
    ],
  };

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      ratingCount: '120',
    },
  };

  return (
    <html lang="ko" className={notoSansKr.className}>
      <head>
        <meta name="theme-color" content="#0D0A1A" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content" aria-label="본문으로 바로 이동">본문으로 이동</a>
        <GoogleAnalytics />
        <AuthProvider>
        <SiteShell topBanner={`${siteName} - 무료 운세 서비스`}>
          <div id="main-content">
            {children}
          </div>
        </SiteShell>
        <p style={{ fontSize: '10px', color: '#9ca3af', opacity: 0.6, textAlign: 'center', padding: '8px 16px' }}>
          본 사이트의 일부 링크는 제휴 마케팅 링크로, 이를 통한 구매 시 사이트 운영에 도움이 되는 소정의 수수료를 받을 수 있습니다.
        </p>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registered:', reg.scope); })
                    .catch(function(err) { console.log('SW registration failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
