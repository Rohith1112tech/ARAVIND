/**
 * ARAVIND GYM - Service Worker (PWA Offline Support)
 */

const CACHE_NAME = 'aravind-gym-v1.1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon.svg',
  './assets/images/chest-day.jpg',
  './assets/images/back-day.jpg',
  './assets/images/biceps-day.jpg',
  './assets/images/triceps-day.jpg',
  './assets/images/shoulder-day.jpg',
  './assets/images/leg-day.jpg'
];

// Install: Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old versions of cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for dynamic requests, Cache-fallback for offline support
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Do not intercept Google Apps Script calls or non-GET requests
  if (event.request.method !== 'GET' || url.hostname.includes('script.google.com') || url.hostname.includes('googleusercontent.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Fetch from network in parallel to keep cache fresh
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If network fails (e.g. offline in gym), fallback to cached response
        return cachedResponse;
      });

      // Return cached immediately if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
