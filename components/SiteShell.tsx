import Link from 'next/link';
import type { ReactNode } from 'react';
import { siteConfig } from '@/lib/site-config';
import AuthButton from './AuthButton';
import PlayStoreBadge from './PlayStoreBadge';
import { CrossSiteFooter } from './CrossSiteFooter';

type SiteShellProps = {
  children: ReactNode;
  /** 상단 배너 텍스트 (선택) */
  topBanner?: string;
};

/**
 * SiteShell — 공용 헤더/푸터/네비게이션
 */
export default function SiteShell({ children, topBanner }: SiteShellProps) {
  return (
    <div className="site-shell">
      {/* 상단 배너 */}
      {topBanner && (
        <div className="top-banner" role="banner">
          {topBanner}
        </div>
      )}

      {/* 헤더 */}
      <header className="site-header" role="banner">
        <div className="site-header-inner">
          <Link href="/" className="brand-lockup" aria-label="운세미 홈으로 이동">
            <span className="brand-mark">{siteConfig.siteName}</span>
            <span className="brand-tagline">{siteConfig.tagline}</span>
          </Link>

          <nav className="header-nav" aria-label="주요 메뉴">
            {siteConfig.navigation.map((item) => (
              <Link key={item.href} href={item.href} className="header-nav-link">
                {item.label}
              </Link>
            ))}
            <AuthButton />
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="site-main" role="main">{children}</main>

      {/* 푸터 */}
      <footer className="site-footer" role="contentinfo">
        <div className="site-footer-inner">
          <div className="footer-brand">
            <strong>{siteConfig.siteName}</strong>
            <p>{siteConfig.footerText}</p>
          </div>
          <nav className="footer-links" aria-label="서비스 메뉴">
            {siteConfig.navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: '1rem' }}>
            <PlayStoreBadge />
          </div>
        </div>
      </footer>

      {/* Cross-site footer */}
      <CrossSiteFooter currentDomain="unse.me" companyName="운세미" />
    </div>
  );
}
