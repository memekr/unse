import { Metadata } from 'next';
import { ReactNode } from 'react';
import { seoConfig } from '@/lib/seo-config';

export function buildMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    keywords: seoConfig.keywords,
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: seoConfig.siteUrl,
      siteName: seoConfig.siteName,
      title: seoConfig.openGraph.title,
      description: seoConfig.openGraph.description,
      images: [
        {
          url: seoConfig.openGraph.image.url,
          width: seoConfig.openGraph.image.width,
          height: seoConfig.openGraph.image.height,
          alt: seoConfig.openGraph.image.alt,
          type: seoConfig.openGraph.image.type,
        },
      ],
    },
    twitter: {
      card: seoConfig.twitter.cardType as any,
      creator: seoConfig.twitter.handle,
      site: seoConfig.twitter.site,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    ...overrides,
  };
}

export default function SEOHeadComponent() {
  return null;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  children?: ReactNode;
  keywords?: string[];
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  articleSection?: string;
}

export function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  children,
  keywords,
  author,
  publishedDate,
  modifiedDate,
  articleSection,
}: SEOHeadProps) {
  const pageTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle;
  const pageDescription = description || seoConfig.defaultDescription;
  const pageKeywords = keywords ? [...keywords, ...seoConfig.keywords].slice(0, 15) : seoConfig.keywords;
  const pageUrl = canonical || seoConfig.siteUrl;
  const image = ogImage || seoConfig.openGraph.image.url;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ogType === 'article' ? 'NewsArticle' : 'Organization',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: seoConfig.openGraph.image.url,
    image: image,
    ...(ogType === 'article' && {
      headline: pageTitle,
      description: pageDescription,
      datePublished: publishedDate,
      dateModified: modifiedDate || publishedDate,
      author: {
        '@type': 'Person',
        name: author || seoConfig.siteName,
      },
      articleSection: articleSection || '뉴스',
    }),
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords.join(', ')} />
      <meta name="author" content={author || seoConfig.siteName} />
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      <title>{pageTitle}</title>
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={seoConfig.locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={seoConfig.twitter.cardType} />
      <meta name="twitter:site" content={seoConfig.twitter.site} />
      <meta name="twitter:creator" content={seoConfig.twitter.handle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Verification */}
      {seoConfig.verification.google && (
        <meta name="google-site-verification" content={seoConfig.verification.google} />
      )}
      {seoConfig.verification.naver && (
        <meta name="naver-site-verification" content={seoConfig.verification.naver} />
      )}
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {children}
    </>
  );
}
