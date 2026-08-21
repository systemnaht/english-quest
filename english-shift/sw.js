const CACHE = 'english-shift-shell-v8';
const OFFLINE_URL = '/offline.html';
const SHELL = ['/', '/index.html', '/offline.html', '/app.js', '/enhancements.js', '/adaptive-engine.js', '/manifest.webmanifest', '/app.webmanifest', '/app-icon-192.png', '/app-icon-512.png'];

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

async function withAdaptiveEngine(response){
  const type=response?.headers?.get('content-type')||'';
  if(!response||!response.ok||!type.includes('text/html')) return response;
  const html=await response.text();
  if(html.includes('/adaptive-engine.js')) return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
  const patched=html.replace('</body>','<script src="/adaptive-engine.js"></script></body>');
  return new Response(patched,{status:response.status,statusText:response.statusText,headers:response.headers});
}

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
        return event.request.mode==='navigate' ? withAdaptiveEngine(response) : response;
      }
      if (event.request.mode === 'navigate') {
        const fallback=(await caches.match(event.request)) || (await caches.match('/')) || (await caches.match(OFFLINE_URL)) || response;
        return withAdaptiveEngine(fallback);
      }
      return response;
    } catch (_) {
      if (event.request.mode === 'navigate') {
        const fallback=(await caches.match(event.request)) || (await caches.match('/')) || (await caches.match(OFFLINE_URL));
        return fallback ? withAdaptiveEngine(fallback) : Response.error();
      }
      return (await caches.match(event.request)) || Response.error();
    }
  })());
});
