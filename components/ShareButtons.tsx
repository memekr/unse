'use client';

import { useState, useEffect } from 'react';

interface ShareButtonsProps {
  url?: string;
  title?: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : '';
  const shareTitle = title || '운세미 - 무료 운세 사주풀이';

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

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

  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
      } catch { /* user cancelled */ }
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', padding: '1rem 0' }} role="group" aria-label="공유 버튼">
      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#666', marginRight: '0.25rem' }}>공유</span>
      {canShare && (
        <button
          onClick={shareNative}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', borderRadius: '9999px', border: '1px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.1)', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#a855f7', cursor: 'pointer', minHeight: '44px', minWidth: '44px', justifyContent: 'center' }}
          aria-label="공유하기"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
          공유
        </button>
      )}
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
