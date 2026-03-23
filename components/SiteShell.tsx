'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { siteConfig } from '@/lib/site-config';
import AuthButton from './AuthButton';
import { CrossSiteFooter } from './CrossSiteFooter';

import RecentActivity, { RecentActivityTracker } from './shared/RecentActivity';
import { BookmarkList } from './shared/BookmarkButton';

type SiteShellProps = {
  children: ReactNode;
  /** 상단 배너 텍스트 (선택) */
  topBanner?: string;
};

/**
 * SiteShell — 공용 헤더/푸터/네비게이션
 */
export default function SiteShell({ children, topBanner }: SiteShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <div className="site-shell">
      {/* 상단 배너 제거됨 */}

      {/* Recent activity tracker (invisible) */}
      <RecentActivityTracker />

      {/* 헤더 */}
      <header className="site-header" role="banner">
        <div className="site-header-inner">
          <Link href="/" className="brand-lockup" aria-label="운세미 홈으로 이동">
            <span className="brand-mark">{siteConfig.siteName}</span>
          </Link>

          {/* Hamburger menu button — always visible */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <span className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <nav
            id="main-navigation"
            className={`header-nav ${menuOpen ? 'header-nav--open' : ''}`}
            aria-label="주요 메뉴"
          >
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="header-nav-link"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="header-nav-divider" role="separator" aria-hidden="true" />
            <Link
              href="/about"
              className="header-nav-link"
              onClick={closeMenu}
            >
              {'소개'}
            </Link>
            <AuthButton />
            <div className="header-nav-divider" role="separator" aria-hidden="true" />
            <RecentActivity />
            <BookmarkList />
          </nav>
        </div>
      </header>

      {/* Menu overlay — close on background click */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* 메인 콘텐츠 */}
      <div className="site-main">{children}</div>

      {/* Cross-site footer (unified) */}
      <CrossSiteFooter
        currentDomain="unse.me"
        companyName="운세미"
        siteNavigation={siteConfig.navigation}
        siteName={siteConfig.siteName}
        showPlayStoreBadge
      />
    </div>
  );
}
