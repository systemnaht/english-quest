const CACHE = 'stormspeak-shell-v1';
const SHELL = ['/stormspeak/', '/stormspeak/index.html', '/stormspeak/app.js', '/stormspeak/data.js', '/stormspeak/manifest.webmanifest', '/stormspeak/icon-192.png', '/stormspeak/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).catch(() => undefined));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => undefined);
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || caches.match('/stormspeak/'))));
});
