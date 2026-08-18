const CACHE = 'english-shift-shell-v5';
const SHELL = ['/', '/index.html', '/app.js', '/enhancements.js', '/manifest.webmanifest?v=3', '/icon-192.png?v=3', '/icon-512.png?v=3'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => {
      const staleEnglishShift = key.startsWith('english-shift-shell-') && key !== CACHE;
      // Remove the old StormSpeak cache too: an earlier root-scoped worker could
      // otherwise keep serving StormSpeak for the English Shift root URL.
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

  // StormSpeak owns this subtree and has its own service worker.
  // The root worker must never intercept it.
  if (url.pathname.startsWith('/stormspeak/')) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request, { cache: 'no-store' });
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => undefined);
      }
      return response;
    } catch (_) {
      return (await caches.match(event.request)) || (await caches.match('/'));
    }
  })());
});
