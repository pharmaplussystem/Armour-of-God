import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

/**
 * PWA Service Worker Builder Plugin
 * Automatically inspects the exact files emitted during Vite production build
 * (including hashed JS, CSS, bundled fonts, and icons) and writes them into dist/sw.js
 * for 100% offline pre-caching under the configured repository base.
 */
function pwaOfflineBuilderPlugin(): Plugin {
  let resolvedBase = '/';
  return {
    name: 'pwa-offline-builder',
    apply: 'build',
    configResolved(config) {
      resolvedBase = config.base || '/';
      if (!resolvedBase.endsWith('/')) {
        resolvedBase += '/';
      }
    },
    closeBundle() {
      const distDir = path.resolve('dist');
      if (!fs.existsSync(distDir)) return;

      const collectFiles = (dir: string, base = ''): string[] => {
        let results: string[] = [];
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
          const fullPath = path.join(dir, entry);
          const stat = fs.statSync(fullPath);
          const relPath = base ? `${base}/${entry}` : entry;
          if (stat.isDirectory()) {
            results = results.concat(collectFiles(fullPath, relPath));
          } else {
            // Exclude sw.js itself, source maps, and zip archives
            if (entry !== 'sw.js' && !entry.endsWith('.map') && !entry.endsWith('.zip')) {
              results.push(relPath);
            }
          }
        }
        return results;
      };

      const emittedFiles = collectFiles(distDir);
      const rawAssets = Array.from(new Set(['', 'index.html', ...emittedFiles]));
      const precacheList = rawAssets.map((f) => (f ? `${resolvedBase}${f}` : resolvedBase));

      const swContent = `// Armour of God - 100% Offline Service Worker
// Automatically generated with exact Vite build output assets
const CACHE_NAME = 'armour-of-god-v3';
const BASE_PATH = ${JSON.stringify(resolvedBase)};

// Pre-cached local application shell and bundle assets
const PRECACHE_ASSETS = ${JSON.stringify(precacheList, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const tasks = PRECACHE_ASSETS.map(async (assetUrl) => {
        try {
          const req = new Request(assetUrl, { cache: 'no-cache' });
          const res = await fetch(req);
          if (res && (res.status === 200 || res.type === 'opaque')) {
            await cache.put(req, res);
          }
        } catch (err) {
          console.warn('[SW] Could not precache:', assetUrl, err);
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

  // Skip non-http/https protocols
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
            (await caches.match(BASE_PATH + 'index.html')) ||
            (await caches.match(BASE_PATH)) ||
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
            const fallback = (await caches.match(BASE_PATH + 'icon.svg')) || (await caches.match(BASE_PATH + 'favicon.png'));
            if (fallback) return fallback;
          }
          return new Response('Offline resource not in cache', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
`;

      fs.writeFileSync(path.join(distDir, 'sw.js'), swContent, 'utf-8');
      console.log(`[PWA Plugin] Generated dist/sw.js with ${precacheList.length} exact build assets for base ${resolvedBase}`);
    }
  };
}

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const repoName = '/Armour-of-God/';
  const base = process.env.VITE_BASE_PATH || (isBuild ? repoName : '/');

  return {
    base,
    plugins: [react(), tailwindcss(), pwaOfflineBuilderPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
