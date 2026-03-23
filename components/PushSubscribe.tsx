'use client';

import { useState, useEffect, useCallback } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type SubscribeState = 'idle' | 'subscribed' | 'denied' | 'unsupported' | 'loading';

export default function PushSubscribe() {
  const [state, setState] = useState<SubscribeState>('idle');
  const [error, setError] = useState('');

  // 초기 상태 확인
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setState('denied');
      return;
    }

    // 이미 구독 중인지 확인
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) setState('subscribed');
      });
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (!VAPID_PUBLIC_KEY) {
      setError('푸시 설정이 완료되지 않았습니다');
      return;
    }
    setState('loading');
    setError('');

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'denied') {
        setState('denied');
        return;
      }
      if (permission !== 'granted') {
        setState('idle');
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subJson = sub.toJSON();
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
        }),
      });

      if (!res.ok) throw new Error('구독 저장 실패');

      setState('subscribed');
      localStorage.setItem('unse_push_subscribed', '1');
    } catch (err) {
      console.error('Push subscribe error:', err);
      setError('구독 중 오류가 발생했습니다');
      setState('idle');
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setState('loading');
    setError('');

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();

        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        });
      }

      setState('idle');
      localStorage.removeItem('unse_push_subscribed');
    } catch (err) {
      console.error('Push unsubscribe error:', err);
      setError('구독 해제 중 오류가 발생했습니다');
      setState('subscribed');
    }
  }, []);

  // 지원하지 않는 환경이면 렌더링 안 함
  if (state === 'unsupported') return null;

  return (
    <div className="push-subscribe">
      {state === 'denied' ? (
        <div className="push-subscribe-inner push-subscribe-denied">
          <span className="push-icon" aria-hidden="true">🔕</span>
          <div className="push-text">
            <p className="push-title">알림이 차단되어 있습니다</p>
            <p className="push-desc">브라우저 설정에서 알림을 허용해 주세요</p>
          </div>
        </div>
      ) : state === 'subscribed' ? (
        <div className="push-subscribe-inner push-subscribe-active">
          <span className="push-icon" aria-hidden="true">🔔</span>
          <div className="push-text">
            <p className="push-title">매일 아침 운세 알림 받는 중</p>
            <p className="push-desc">매일 오전 7시에 오늘의 운세를 알려드려요</p>
          </div>
          <button
            className="push-btn push-btn-unsub"
            onClick={unsubscribe}
          >
            해제
          </button>
        </div>
      ) : (
        <div className="push-subscribe-inner">
          <span className="push-icon" aria-hidden="true">🔔</span>
          <div className="push-text">
            <p className="push-title">매일 아침 오늘의 운세를 받아보세요</p>
            <p className="push-desc">오전 7시에 오늘의 운세 요약을 알림으로 보내드려요</p>
          </div>
          <button
            className="push-btn push-btn-sub"
            onClick={subscribe}
            disabled={state === 'loading'}
          >
            {state === 'loading' ? '구독 중...' : '구독'}
          </button>
        </div>
      )}
      {error && <p className="push-error">{error}</p>}
    </div>
  );
}
