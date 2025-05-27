const CACHE_NAME = 'pwa-call-sim-v1';
const OFFLINE_URL = '/';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        OFFLINE_URL,
        'index.html',
        'manifest.json',
        'sw.js'
      ]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  // Handle navigation requests by falling back to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  }
});
