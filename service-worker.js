// Service worker: installability plus a safe offline fallback.
// HTML is network first, so a case study is never served stale while online.
// Static assets are cache first. Bump VERSION on every release: old caches are deleted on activate.
const VERSION = '2026-10-27-v8';
const CACHE_NAME = 'obioma-portfolio-' + VERSION;
const CORE_ASSETS = ['./', './index.html', './work.html', './404.html', './css/style.css?v=8', './js/main.js?v=8', './js/motion.js?v=8', './css/studio.css?v=8', './js/studio.js?v=8', './css/header.css?v=8', './js/header.js?v=8', './assets/icons.svg', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (/\.(mp4|webm)$/i.test(req.url)) return; // never cache video
  const isPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (isPage) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req).then((c) => c || caches.match('./404.html') || caches.match('./index.html')))
    );
    return;
  }
  if (/\.(css|js)(\?|$)/i.test(req.url)) {
    // code is network first so a deploy always wins; cache is only the offline fallback
    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      if (res && res.status === 200 && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
