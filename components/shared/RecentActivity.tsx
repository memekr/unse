'use client';

import { useState, useEffect, useCallback } from 'react';

type RecentItem = {
  url: string;
  title: string;
  date: string;
};

const STORAGE_KEY = 'recent_activity';
const MAX_ITEMS = 10;

function getRecent(): RecentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(items: RecentItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

/* ── Auto-tracker: mount on page to record visit ── */
export function RecentActivityTracker() {
  useEffect(() => {
    const url = window.location.pathname;
    const title = document.title;
    const list = getRecent().filter((r) => r.url !== url);
    list.unshift({ url, title, date: new Date().toISOString() });
    saveRecent(list.slice(0, MAX_ITEMS));
    window.dispatchEvent(new Event('recent-updated'));
  }, []);

  return null;
}

/* ── RecentActivity list (for hamburger menu) ── */
export default function RecentActivity() {
  const [items, setItems] = useState<RecentItem[]>([]);

  const refresh = useCallback(() => {
    setItems(getRecent());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('recent-updated', refresh);
    return () => window.removeEventListener('recent-updated', refresh);
  }, [refresh]);

  if (items.length === 0) return null;

  return (
    <div className="recent-activity">
      <h4 style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'var(--color-text-muted, #aaa)',
        padding: '0.5rem 1rem 0.25rem',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        최근 본 페이지
      </h4>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              style={{
                display: 'block',
                padding: '0.4rem 1rem',
                fontSize: '0.8125rem',
                color: 'var(--color-text, #eee)',
                textDecoration: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
            >
              {r.title || r.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
