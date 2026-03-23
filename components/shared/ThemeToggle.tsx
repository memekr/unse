'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'theme_preference';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
        applyTheme(stored);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const detected = prefersDark ? 'dark' : 'light';
        setTheme(detected);
        applyTheme(detected);
      }
    } catch {
      // fallback dark
    }
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, [theme]);

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="theme-toggle-btn"
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
    >
      <span className="theme-toggle-icon">{theme === 'dark' ? '\u2600\uFE0F' : '\u{1F319}'}</span>
      <span className="theme-toggle-label">{theme === 'dark' ? '라이트 모드' : '다크 모드'}</span>

      <style jsx>{`
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-surface, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          color: var(--color-text, #eee);
          font-size: 0.8125rem;
          transition: background 0.2s;
          width: 100%;
          text-align: left;
        }
        .theme-toggle-btn:hover {
          background: var(--color-glass, rgba(255, 255, 255, 0.1));
        }
        .theme-toggle-icon {
          font-size: 1rem;
          line-height: 1;
        }
        .theme-toggle-label {
          font-weight: 500;
        }
      `}</style>
    </button>
  );
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  if (theme === 'light') {
    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
  } else {
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
  }
}
