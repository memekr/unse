/**
 * seo-config-extended.ts — 운세미 SEO 설정
 *
 * 운세, 사주, 타로 서비스를 위한
 * 구조화된 데이터 스키마와 설정
 */

export const SEO_CONFIG = {
  site: {
    url: "https://unse.me",
    name: "운세미",
    description: "오늘의 운세, 사주, 타로 - AI가 분석하는 나만의 운세 서비스",
    language: "ko",
    locale: "ko_KR",
    type: "Service" as const,
  },
  keywords: {
    primary: [
      "오늘의운세",
      "별자리운세",
      "사주풀이",
      "타로카드",
      "꿈해몽",
    ],
    zodiac: [
      "쥐띠",
      "소띠",
      "호랑이띠",
      "토끼띠",
      "뱀띠",
      "말띠",
      "양띠",
      "원숭이띠",
      "닭띠",
      "개띠",
      "돼지띠",
    ],
    services: [
      "무료운세",
      "오늘운세",
      "내일운세",
      "주간운세",
      "월간운세",
      "AI 운세",
    ],
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "https://unse.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "운세미 - AI가 분석하는 나만의 운세 서비스",
      },
    ],
  },
  robots: {
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    naverBot: {
      index: true,
      follow: true,
    },
  },
} as const;

/**
 * FAQPage JSON-LD 스키마 생성기
 */
export function generateFAQPageSchema(faqs: Array<{
  question: string;
  answer: string;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
    inLanguage: SEO_CONFIG.site.language,
  };
}

/**
 * HowTo JSON-LD 스키마 생성기
 */
export function generateHowToSchema(howTo: {
  name: string;
  description: string;
  image?: string;
  steps: Array<{
    name: string;
    description: string;
    image?: string;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    image: howTo.image || `${SEO_CONFIG.site.url}/how-to-image.png`,
    step: howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      itemListElement: [
        {
          "@type": "HowToDirection",
          text: step.description,
          image: step.image,
        },
      ],
    })),
    inLanguage: SEO_CONFIG.site.language,
  };
}

/**
 * Thing JSON-LD 스키마 (운세/사주 정보용)
 */
export function generateFortuneSchema(fortune: {
  name: string;
  description: string;
  datePublished?: string;
  author?: string;
  zodiacSign?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: fortune.name,
    description: fortune.description,
    ...(fortune.datePublished && { datePublished: fortune.datePublished }),
    ...(fortune.author && {
      author: {
        "@type": "Person",
        name: fortune.author,
      },
    }),
    inLanguage: SEO_CONFIG.site.language,
  };
}

/**
 * CreativeWork JSON-LD 스키마 (운세 콘텐츠용)
 */
export function generateCreativeWorkSchema(work: {
  headline: string;
  description: string;
  url?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    headline: work.headline,
    description: work.description,
    url: work.url || SEO_CONFIG.site.url,
    ...(work.datePublished && { datePublished: work.datePublished }),
    ...(work.dateModified && { dateModified: work.dateModified }),
    image: work.image || `${SEO_CONFIG.site.url}/content-image.png`,
    inLanguage: SEO_CONFIG.site.language,
  };
}

/**
 * Organization JSON-LD 스키마
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SEO_CONFIG.site.name,
  url: SEO_CONFIG.site.url,
  logo: `${SEO_CONFIG.site.url}/logo.png`,
  description: SEO_CONFIG.site.description,
  inLanguage: SEO_CONFIG.site.language,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
  },
};

/**
 * WebSite JSON-LD 스키마
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SEO_CONFIG.site.name,
  url: SEO_CONFIG.site.url,
  description: SEO_CONFIG.site.description,
  inLanguage: SEO_CONFIG.site.language,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SEO_CONFIG.site.url}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};
