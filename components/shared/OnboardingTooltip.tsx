'use client';

import { useState, useEffect } from 'react';

type OnboardingTooltipProps = {
  siteName: string;
  features: [string, string, string];
};

const STORAGE_KEY = 'onboarding_done';

export default function OnboardingTooltip({ siteName, features }: OnboardingTooltipProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setShow(true);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  }

  if (!show) return null;

  return (
    <div className="onboarding-overlay" onClick={dismiss}>
      <div
        className="onboarding-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="환영 안내"
      >
        <h2 className="onboarding-title">
          {siteName}에 오신 것을 환영합니다!
        </h2>
        <p className="onboarding-subtitle">이런 것들을 할 수 있어요:</p>
        <ul className="onboarding-features">
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        <button className="onboarding-btn" onClick={dismiss}>
          시작하기
        </button>
      </div>

      <style jsx>{`
        .onboarding-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          padding: 1rem;
        }
        .onboarding-modal {
          background: var(--color-bg-elevated, #1a1a2e);
          border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
          border-radius: 1rem;
          padding: 2rem;
          max-width: 400px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .onboarding-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text, #fff);
          margin: 0 0 0.5rem;
        }
        .onboarding-subtitle {
          font-size: 0.875rem;
          color: var(--color-text-muted, #aaa);
          margin: 0 0 1rem;
        }
        .onboarding-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .onboarding-features li {
          background: var(--color-surface, rgba(255, 255, 255, 0.05));
          border-radius: 0.5rem;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: var(--color-text, #fff);
          text-align: left;
        }
        .onboarding-features li::before {
          content: '✦ ';
          color: var(--color-accent, #8b5cf6);
        }
        .onboarding-btn {
          background: var(--color-cta, #8b5cf6);
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          width: 100%;
        }
        .onboarding-btn:hover {
          background: var(--color-cta-hover, #7c3aed);
        }
      `}</style>
    </div>
  );
}
