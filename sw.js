const CACHE_NAME = 'cyberos-elite-v6.0';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './css/bootstrap.min.css',
    './css/all.min.css',
    './css/animate.min.css',
    './js/main.js',
    './js/core/kernel.js',
    './js/core/security_vault.js',
    './js/core/ui_engine.js',
    './js/services/storage_service.js',
    './js/modules/dashboard.js',
    './js/modules/pentest.js',
    './js/modules/academy.js',
     './js/modules/soc.js',
    './js/modules/onyx.js',
    './js/modules/tracking.js',
    './js/modules/market.js',
    './js/modules/bot_war.js',
    './js/bootstrap.bundle.min.js',
    './data/arsenal.js',
    './data/tecnicas.js',
    './webfonts/fa-brands-400.ttf',
    './webfonts/fa-brands-400.woff2',
    './webfonts/fa-regular-400.ttf',
    './webfonts/fa-regular-400.woff2',
    './webfonts/fa-solid-900.ttf',
    './webfonts/fa-solid-900.woff2',
    './webfonts/fa-v4compatibility.ttf',
    './webfonts/fa-v4compatibility.woff2'
];

// Install: Cache essential assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching system kernel and assets');
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate: Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log('[SW] Purging legacy cache:', name);
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Stale-While-Revalidate strategy
self.addEventListener('fetch', (event) => {
    // Only cache GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Check if we received a valid response
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Cache the new version
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // If network fails, return cached response if available
                return cachedResponse;
            });

            return cachedResponse || fetchPromise;
        })
    );
});