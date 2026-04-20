const CACHE_NAME = 'ethical-hacker-v1';
const ASSETS_CRITICAL = [
    '/css/style.css',
    '/js/i18n.js',
    '/icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_CRITICAL))
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Cache-First for critical assets
    if (ASSETS_CRITICAL.includes(url.pathname)) {
        event.respondWith(
            caches.match(event.request).then((res) => res || fetch(event.request))
        );
        return;
    }

    // Stale-while-revalidate for other assets
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            });
            return cachedResponse || fetchPromise;
        })
    );
});
