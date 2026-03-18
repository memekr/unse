'use client';

import { useState, useEffect } from 'react';

const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL;
const DISMISS_KEY = 'app-banner-dismissed';
const DISMISS_DAYS = 7;

export default function AppSmartBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!PLAY_STORE_URL) return;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) return;

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    }

    setVisible(true);
  }, []);

  if (!visible || !PLAY_STORE_URL) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
  };

  return (
    <div className="smart-app-banner">
      <button className="smart-app-banner-close" onClick={handleDismiss} aria-label="배너 닫기">
        &times;
      </button>
      <div className="smart-app-banner-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="var(--color-cta, #8b5cf6)" />
          <circle cx="12" cy="10" r="4" fill="#fff" opacity="0.9" />
          <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <div className="smart-app-banner-text">
        <strong>운세미</strong>
        <span>앱으로 더 빠르게 이용하세요</span>
      </div>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="smart-app-banner-btn"
      >
        설치
      </a>

      <style jsx>{`
        .smart-app-banner {
          position: sticky;
          top: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1rem;
          background: var(--color-bg-elevated, #110d22);
          border-bottom: 1px solid var(--color-border, rgba(167, 139, 250, 0.12));
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }

        .smart-app-banner-close {
          background: none;
          border: none;
          color: var(--color-text-dim, #7c6a9e);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .smart-app-banner-close:hover {
          color: var(--color-text, #ede9f6);
        }

        .smart-app-banner-icon {
          flex-shrink: 0;
        }

        .smart-app-banner-text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .smart-app-banner-text strong {
          font-size: 0.875rem;
          color: var(--color-text, #ede9f6);
        }

        .smart-app-banner-text span {
          font-size: 0.75rem;
          color: var(--color-text-muted, #b4a4d6);
        }

        .smart-app-banner-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          padding: 0.375rem 1rem;
          background: var(--color-cta, #8b5cf6);
          color: #fff;
          font-size: 0.8125rem;
          font-weight: 700;
          border-radius: 9999px;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .smart-app-banner-btn:hover {
          opacity: 0.85;
        }

        @media (min-width: 769px) {
          .smart-app-banner {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
