// 🐾 NEKO DEFENSE SERVICE WORKER - Offline Support, nyaa~!
const CACHE_NAME = 'neko-defense-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/static/js/bundle.js',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🐾 [ServiceWorker] Installing, nyaa~!');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🐾 [ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('🐾 [ServiceWorker] Cache failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🐾 [ServiceWorker] Activating, desu~!');
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('🐾 [ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Network failed, return offline page if available
          return caches.match('/offline.html');
        });
      })
  );
});

// Background sync - sync threats when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-threats') {
    console.log('🐾 [ServiceWorker] Background sync: threats');
    event.waitUntil(syncThreats());
  }
});

async function syncThreats() {
  try {
    const response = await fetch('/api/threats');
    const threats = await response.json();

    // Update cache
    const cache = await caches.open(CACHE_NAME);
    await cache.put('/api/threats', new Response(JSON.stringify(threats)));

    console.log('🐾 [ServiceWorker] Threats synced, nyaa~!');
    return threats;
  } catch (error) {
    console.error('🐾 [ServiceWorker] Sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('🐾 [ServiceWorker] Push received, desu~!');

  const options = {
    body: event.data ? event.data.text() : 'New threat detected, nyaa~!',
    icon: '/neko-icon-192.png',
    badge: '/neko-icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'threat-alert',
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'View Threat', icon: '/neko-icon-192.png' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    data: {
      url: '/threats'
    }
  };

  event.waitUntil(
    self.registration.showNotification('🐾 Neko Defense Alert', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🐾 [ServiceWorker] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/threats')
    );
  }
});
