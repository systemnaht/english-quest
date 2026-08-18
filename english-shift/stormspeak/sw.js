const CACHE = 'stormspeak-shell-v6';
const SHELL = ['/stormspeak/', '/stormspeak/index.html', '/stormspeak/app.js', '/stormspeak/data.js', '/stormspeak/manifest.webmanifest', '/stormspeak/app.webmanifest', '/stormspeak/app-icon-192.png', '/stormspeak/app-icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).catch(() => undefined));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => (
      key.startsWith('stormspeak-shell-') && key !== CACHE ? caches.delete(key) : Promise.resolve()
    )));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith('/stormspeak/')) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request, { cache: 'no-store' });
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => undefined);
        return response;
      }
      if (event.request.mode === 'navigate') {
        return (await caches.match('/stormspeak/')) || response;
      }
      return response;
    } catch (_) {
      return (await caches.match(event.request)) || (event.request.mode === 'navigate' ? await caches.match('/stormspeak/') : Response.error());
    }
  })());
});
