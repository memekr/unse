// Service Worker - unse.me (운세미)
const CACHE_NAME = 'unse-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

// 오프라인에서 이전 운세 결과를 볼 수 있도록 캐싱
const FORTUNE_CACHE = 'unse-fortune-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== FORTUNE_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 운세 API 결과는 캐싱하여 오프라인 접근 가능하게
  if (url.pathname.startsWith('/api/') && url.pathname.includes('fortune')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(FORTUNE_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return (
              cached ||
              new Response(JSON.stringify({ error: 'offline' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
              })
            );
          });
        })
    );
    return;
  }

  // 기타 API 요청은 네트워크 우선
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // 네비게이션 요청
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 운세 결과 페이지는 캐시에 저장하여 오프라인에서 이전 결과 확인 가능
          if (
            url.pathname.startsWith('/horoscope') ||
            url.pathname.startsWith('/saju') ||
            url.pathname.startsWith('/tarot') ||
            url.pathname.startsWith('/dream')
          ) {
            const clone = response.clone();
            caches.open(FORTUNE_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // 정적 리소스: 캐시 우선
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (
          response.ok &&
          (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff2?)$/) ||
            url.pathname.startsWith('/_next/static/'))
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// 푸시 알림 처리 (매일 아침 운세 알림)
self.addEventListener('push', (event) => {
  const defaultData = {
    title: '운세미',
    body: '오늘의 운세가 도착했습니다! 확인해보세요.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    url: '/horoscope',
  };

  let data = defaultData;
  try {
    if (event.data) {
      data = { ...defaultData, ...event.data.json() };
    }
  } catch (e) {
    // JSON 파싱 실패 시 기본 데이터 사용
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: { url: data.url },
      vibrate: [200, 100, 200],
      tag: 'unse-daily-fortune',
      renotify: true,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
