// Armour of God - Enhanced Offline Service Worker
const CACHE_NAME = 'armour-of-god-v2';

// Pre-cached local application shell assets
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './favicon.png',
  './apple-touch-icon.png',
  './pwa-192x192.png',
  './pwa-512x512.png',
  './pwa-maskable-512x512.png',
  './fonts/cinzel-latin.woff2',
  './fonts/inter-latin.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Resilient precaching: individual fetch so an optional file doesn't block installation
      const tasks = PRECACHE_ASSETS.map(async (assetUrl) => {
        try {
          const res = await fetch(assetUrl, { cache: 'no-cache' });
          if (res && (res.status === 200 || res.type === 'opaque')) {
            await cache.put(assetUrl, res);
          }
        } catch {
          // Ignore missing optional asset
        }
      });
      await Promise.allSettled(tasks);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip non-http/https protocols (extensions, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // SPA Navigation: Network first with immediate fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          return (
            (await caches.match(event.request)) ||
            (await caches.match('./index.html')) ||
            (await caches.match('/index.html')) ||
            (await caches.match('./')) ||
            (await caches.match('/')) ||
            new Response(
              '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Armour of God - Offline</title></head><body style="background:#0b132b;color:#f1f5f9;font-family:sans-serif;padding:2rem;text-align:center;"><h2>Armour of God</h2><p>You are running offline. Please launch the app from your home screen or refresh.</p></body></html>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 200 }
            )
          );
        })
    );
    return;
  }

  // Static Assets (scripts, CSS, fonts, SVG/PNG icons):
  // Cache-First with background revalidation and dynamic caching
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Background revalidation
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(async () => {
          if (event.request.destination === 'image') {
            const fallback = (await caches.match('./icon.svg')) || (await caches.match('./favicon.png'));
            if (fallback) return fallback;
          }
          return new Response('Offline resource not in cache', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
