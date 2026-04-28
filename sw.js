// sw.js - Service Worker Cyberpunk v5.0 - Máxima Eficiência Offline
const CACHE_NAME = 'ethical-hacker-premium-v5.0';
const CRITICAL_CACHE = 'critical-v5.0';
const PENTEST_CACHE = 'pentest-v5.0';

// ASSETS_CRITICAL - TODOS os recursos expandidos (150+ templates ProceduralAI, i18n completa, game engine, cyberpunk UI)
// ASSETS_CRITICAL - Recursos fundamentais para funcionamento offline
const ASSETS_CRITICAL = [
  './', 
  './index.html', 
  './manifest.json',
  './css/style.css', 
  './css/bootstrap.min.css',
  './css/all.min.css',
  './css/animate.min.css',
  './js/bootstrap.bundle.min.js',
  './js/security.js',
  './js/ai_generator.js', 
  './js/i18n.js', 
  './js/offline.js',
  './icon.png',
  './webfonts/fa-brands-400.woff2',
  './webfonts/fa-brands-400.ttf',
  './webfonts/fa-regular-400.woff2',
  './webfonts/fa-regular-400.ttf',
  './webfonts/fa-solid-900.woff2',
  './webfonts/fa-solid-900.ttf',
  './webfonts/fa-v4compatibility.woff2',
  './webfonts/fa-v4compatibility.ttf'
];

// Recursos dinâmicos (CVEs recentes, leaderboards - network-first com cache fallback)
const DYNAMIC_ASSETS = [
  '/api/leaderboards', '/api/cves-latest', '/api/multiplayer-redblue'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Ativa SW imediatamente
  
  event.waitUntil(
    Promise.all([
      // Cache crítico (instantâneo, 100% offline-first)
      caches.open(CRITICAL_CACHE).then(cache => 
        cache.addAll(ASSETS_CRITICAL)
      ),
      // Precaching pentest payloads (alta prioridade)
      caches.open(PENTEST_CACHE).then(cache => 
        cache.addAll([
          './data/arsenal.json'
        ])
      )
    ])
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Limpa caches antigos
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cache => 
          (cache !== CACHE_NAME && cache !== CRITICAL_CACHE && cache !== PENTEST_CACHE) &&
          caches.delete(cache)
        )
      )
    )
  );
  clients.claim(); // Assume controle imediato
});

// ESTRATÉGIAS DE CACHE INTELIGENTES
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 1. CRÍTICO: Cache-first (HTML/JS/CSS/i18n/ProceduralAI - 0ms latency)
  if (ASSETS_CRITICAL.some(asset => event.request.url.includes(asset) || url.pathname === asset)) {
    event.respondWith(cacheFirst(event.request, CRITICAL_CACHE));
    return;
  }
  
  // 2. PENTEST RESOURCES: Cache-first (payloads/offline exploits)
  if (event.request.url.includes('/data/payloads/') || event.request.url.includes('/data/exploits/')) {
    event.respondWith(cacheFirst(event.request, PENTEST_CACHE));
    return;
  }
  
  // 3. DINÂMICO: Network-first + cache fallback (leaderboards/CVEs)
  if (DYNAMIC_ASSETS.some(asset => event.request.url.includes(asset))) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  
  // 4. IMAGENS/SFX: Stale-while-revalidate (60fps performance)
  if (event.request.destination === 'image' || event.request.destination === 'audio') {
    event.respondWith(staleWhileRevalidate(event.request, event));
    return;
  }
  
  // 5. DEFAULT: Stale-while-revalidate (app shell)
  event.respondWith(staleWhileRevalidate(event.request, event));
});

// IMPLEMENTAÇÕES DAS ESTRATÉGIAS
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  let response = await cache.match(request);
  
  if (response) return response; // 100% hit rate para critical assets
  
  // Fallback network (raramente usado)
  response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    // Cache para offline fallback
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch {
    // Fallback cache
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(request) || new Response('Offline - Dark Web desconectada', {status: 503});
  }
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(CACHE_NAME);
  let response = await cache.match(request);
  
  event.waitUntil(
    fetch(request).then(networkResponse => {
      cache.put(request, networkResponse.clone());
    }).catch(() => {/* Network failed, cache stays */})
  );
  
  return response || fetch(request);
}

// BACKGROUND SYNC - Sincronização IndexedDB (user progress/achievements)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncUserProgress());
  }
});

async function syncUserProgress() {
  // Sincroniza localStorage/IndexedDB com servidor
  const clientsList = await clients.matchAll({includeUncontrolled: true});
  clientsList.forEach(client => {
    client.postMessage({type: 'SYNC_PROGRESS'});
  });
}

// PUSH NOTIFICAÇÕES - Novas CVEs/exploits
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: `🌀 Nova CVE: ${data.title} (CVSS ${data.score})`,
    icon: './icon.png',
    badge: './icon.png',
    data: {url: `./index.html#challenge?cve=${data.id}`}
  };
  event.waitUntil(
    self.registration.showNotification('Ethical Hacker Premium', options)
  );
});

// POST MESSAGE - Comunicação com app (precache dinâmico)
self.addEventListener('message', (event) => {
  if (event.data.type === 'PRECACHE_PENTEST') {
    caches.open(PENTEST_CACHE).then(cache => 
      cache.addAll(event.data.resources)
    );
  }
});