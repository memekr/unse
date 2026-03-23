'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) { setIsInstalled(true); return; }
    const d = localStorage.getItem('pwa_install_dismissed');
    if (d && Date.now() - Number(d) < 7 * 24 * 60 * 60 * 1000) { setDismissed(true); return; }
    function handler(e: Event) { e.preventDefault(); setDeferredPrompt(e as BeforeInstallPromptEvent); }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isInstalled || dismissed || !deferredPrompt) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    localStorage.setItem('pwa_install_dismissed', String(Date.now()));
    setDismissed(true);
  }

  return (
    <div style={{ position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 50, maxWidth: 400, margin: '0 auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: '#1a1a1a', padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} role="dialog" aria-label="앱 설치 안내">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: 18 }} aria-hidden="true">+</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#e5e5e5' }}>앱처럼 사용하기</p>
          <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>홈 화면에 추가하면 더 빠르게 접근할 수 있어요</p>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button onClick={handleInstall} style={{ borderRadius: 8, background: '#ef4444', padding: '10px 16px', fontSize: 14, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', minHeight: 44, minWidth: 44 }}>설치</button>
            <button onClick={handleDismiss} style={{ borderRadius: 8, padding: '10px 16px', fontSize: 14, fontWeight: 500, color: '#666', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, minWidth: 44 }}>나중에</button>
          </div>
        </div>
        <button onClick={handleDismiss} style={{ flexShrink: 0, background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="닫기">x</button>
      </div>
    </div>
  );
}
