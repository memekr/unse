'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  url?: string;
  title?: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : '';
  const shareTitle = title || '운세미 - 무료 운세 사주풀이';

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function shareTwitter() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', padding: '1rem 0' }} role="group" aria-label="공유 버튼">
      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#666', marginRight: '0.25rem' }}>공유</span>
      <button
        onClick={shareTwitter}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', borderRadius: '9999px', border: '1px solid rgba(56, 189, 248, 0.2)', background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#38bdf8', cursor: 'pointer', minHeight: '44px', minWidth: '44px', justifyContent: 'center' }}
        aria-label="X(트위터)로 공유"
      >
        X
      </button>
      <button
        onClick={copyUrl}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', borderRadius: '9999px', border: `1px solid ${copied ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.1)'}`, background: copied ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: copied ? '#4ade80' : '#999', cursor: 'pointer', minHeight: '44px', minWidth: '44px', justifyContent: 'center' }}
        aria-label="URL 복사"
      >
        {copied ? '복사됨!' : 'URL 복사'}
      </button>
    </div>
  );
}
