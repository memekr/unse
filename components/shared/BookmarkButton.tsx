'use client';

import { useState, useEffect, useCallback } from 'react';

type BookmarkItem = {
  url: string;
  title: string;
  date: string;
};

const STORAGE_KEY = 'bookmarks';
const MAX_ITEMS = 50;

function getBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(items: BookmarkItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

/* ── BookmarkButton (heart toggle) ── */
type BookmarkButtonProps = {
  url?: string;
  title?: string;
  className?: string;
};

export default function BookmarkButton({ url, title, className }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const resolvedUrl = url || (typeof window !== 'undefined' ? window.location.pathname : '');
  const resolvedTitle = title || (typeof document !== 'undefined' ? document.title : '');

  useEffect(() => {
    const list = getBookmarks();
    setBookmarked(list.some((b) => b.url === resolvedUrl));
  }, [resolvedUrl]);

  const toggle = useCallback(() => {
    let list = getBookmarks();
    const exists = list.some((b) => b.url === resolvedUrl);

    if (exists) {
      list = list.filter((b) => b.url !== resolvedUrl);
      setBookmarked(false);
    } else {
      list.unshift({ url: resolvedUrl, title: resolvedTitle, date: new Date().toISOString() });
      if (list.length > MAX_ITEMS) list = list.slice(0, MAX_ITEMS);
      setBookmarked(true);
    }
    saveBookmarks(list);
    window.dispatchEvent(new Event('bookmarks-updated'));
  }, [resolvedUrl, resolvedTitle]);

  return (
    <button
      onClick={toggle}
      className={className}
      aria-label={bookmarked ? '북마크 해제' : '북마크 추가'}
      title={bookmarked ? '북마크 해제' : '북마크 추가'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        fontSize: '1.25rem',
        lineHeight: 1,
        color: bookmarked ? '#ef4444' : 'var(--color-text-muted, #999)',
        transition: 'color 0.2s, transform 0.15s',
        transform: bookmarked ? 'scale(1.15)' : 'scale(1)',
      }}
    >
      {bookmarked ? '\u2764\uFE0F' : '\u2661'}
    </button>
  );
}

/* ── BookmarkList (for menu) ── */
export function BookmarkList() {
  const [items, setItems] = useState<BookmarkItem[]>([]);

  const refresh = useCallback(() => {
    setItems(getBookmarks());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('bookmarks-updated', refresh);
    return () => window.removeEventListener('bookmarks-updated', refresh);
  }, [refresh]);

  if (items.length === 0) {
    return (
      <div style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--color-text-dim, #777)' }}>
        저장된 북마크가 없습니다
      </div>
    );
  }

  return (
    <div className="bookmark-list">
      <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted, #aaa)', padding: '0.5rem 1rem 0.25rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        북마크 ({items.length})
      </h4>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
        {items.slice(0, 10).map((b) => (
          <li key={b.url}>
            <a
              href={b.url}
              style={{
                display: 'block',
                padding: '0.5rem 1rem',
                fontSize: '0.8125rem',
                color: 'var(--color-text, #eee)',
                textDecoration: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {b.title || b.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
