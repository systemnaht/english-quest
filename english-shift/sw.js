const CACHE = 'english-shift-shell-v7';
const OFFLINE_URL = '/offline.html';
const SHELL = ['/', '/index.html', '/offline.html', '/app.js', '/enhancements.js', '/manifest.webmanifest', '/app.webmanifest', '/app-icon-192.png', '/app-icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).catch(() => undefined));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => {
      const staleEnglishShift = key.startsWith('english-shift-shell-') && key !== CACHE;
      const staleStormSpeak = key.startsWith('stormspeak-shell-');
      return (staleEnglishShift || staleStormSpeak) ? caches.delete(key) : Promise.resolve();
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/stormspeak/')) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request, { cache: 'no-store' });
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => undefined);
        return response;
      }
      if (event.request.mode === 'navigate') {
        return (await caches.match(event.request)) || (await caches.match('/')) || (await caches.match(OFFLINE_URL)) || response;
      }
      return response;
    } catch (_) {
      if (event.request.mode === 'navigate') {
        return (await caches.match(event.request)) || (await caches.match('/')) || (await caches.match(OFFLINE_URL)) || Response.error();
      }
      return (await caches.match(event.request)) || Response.error();
    }
  })());
});
