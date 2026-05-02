const CACHE_NAME = 'cyberos-v5.2-cache';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './css/bootstrap.min.css',
    './css/all.min.css',
    './css/animate.min.css',
    './js/offline.js',
    './js/security.js',
    './js/ai_generator.js',
    './js/evolution_engine.js',
    './js/gemma_optimizer.js',
    './js/defense_engine.js',
    './js/bot_war.js',
    './data/arsenal.js',
    './data/tecnicas.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});