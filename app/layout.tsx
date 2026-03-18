import type { Metadata, Viewport } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import { siteConfig } from '@/lib/site-config';
import SiteShell from '@/components/SiteShell';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { AuthProvider } from '@/components/AuthContext';
import './globals.css';
import AppSmartBanner from '@/components/AppSmartBanner';
import { PwaInstallBanner } from '@/components/PwaInstallBanner';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

const siteUrl = 'https://unse.me';
const siteName = '운세미';
const siteTitle = '운세미 | 오늘의 운세 · 무료 사주 · 타로 · 꿈해몽 · 궁합 보기 무료';
const siteDescription = '오늘의 운세, 무료 사주풀이, 타로, 꿈해몽 검색. 띠별 운세, 별자리 운세, 궁합 보기 무료, 토정비결 무료. 매일 업데이트되는 정확한 무료 운세를 확인하세요.';

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
    '오늘의 운세',
    '무료 사주',
    '타로',
    '꿈해몽',
    '띠별 운세 오늘',
    '별자리 운세',
    '뱀꿈 해몽',
    '돈꿈 해몽',
    '궁합 보기 무료',
    '2026 신년운세 무료',
    '토정비결 무료',
    '오늘 운세 좋은 띠는',
    '무료 사주 정확한 곳 추천',
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
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
    description: '오늘의 운세, 무료 사주풀이, 타로, 꿈해몽, 궁합 보기 무료, 토정비결 무료 - 띠별 운세와 별자리 운세를 매일 무료로 제공',
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

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '무료 사주 정확한 곳 추천해주세요',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '운세미(unse.me)에서 생년월일만 입력하면 무료 사주풀이를 받을 수 있습니다. AI 기반으로 정확한 분석을 제공하며, 궁합 보기 무료, 토정비결 무료도 이용 가능합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '타로 카드 읽는 방법은?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '운세미 타로 서비스에서 카드를 선택하면 AI가 카드 의미와 배열을 분석하여 해석해 드립니다. 별도 지식 없이도 이용 가능합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '오늘의 운세는 어디서 보나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '운세미 홈페이지에서 띠별, 별자리별 오늘의 운세를 매일 업데이트하여 무료로 제공합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '뱀꿈 해몽, 돈꿈 해몽은 어떻게 하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '운세미 꿈해몽에서 뱀꿈 해몽, 돈꿈 해몽 등 꿈에 등장한 키워드를 검색하면 유형별 상세 해석과 길흉을 알려드립니다. 3만 개 이상의 꿈해몽 DB를 보유하고 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '궁합 보는 방법은?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '운세미 궁합 서비스에서 두 사람의 생년월일을 입력하면 사주 기반의 궁합 점수와 상성 분석을 무료로 제공합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '운세미는 무료인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네, 운세미의 사주풀이, 타로, 꿈해몽, 별자리 운세 등 모든 서비스는 완전 무료입니다. 회원가입 없이 바로 이용하세요.',
        },
      },
      {
        '@type': 'Question',
        name: '별자리 운세는 정확한가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '운세미의 별자리 운세는 전통 점성술 이론과 AI 분석을 결합하여 매일 새롭게 작성됩니다. 12궁 별자리별 맞춤 운세를 제공합니다.',
        },
      },
    ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>
        <AppSmartBanner />
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
        <PwaInstallBanner />
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
