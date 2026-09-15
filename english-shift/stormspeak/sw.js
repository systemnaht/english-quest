/* StormSpeak 2.0 development service worker.
   Preview caching is intentionally disabled while cloud + curriculum work is active.
   Keeping this worker minimal prevents stale JS/data from masking new deployments.
*/
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('stormspeak-shell-')).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
