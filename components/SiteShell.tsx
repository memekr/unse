import Link from 'next/link';
import type { ReactNode } from 'react';
import { siteConfig } from '@/lib/site-config';
import AuthButton from './AuthButton';

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
        <div className="top-banner">
          {topBanner}
        </div>
      )}

      {/* 헤더 */}
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="brand-lockup">
            <span className="brand-mark">{siteConfig.siteName}</span>
            <span className="brand-tagline">{siteConfig.tagline}</span>
          </Link>

          <nav className="header-nav" aria-label="전역 이동">
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
      <main className="site-main">{children}</main>

      {/* 푸터 */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand">
            <strong>{siteConfig.siteName}</strong>
            <p>{siteConfig.footerText}</p>
          </div>
          <div className="footer-links">
            {siteConfig.navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
