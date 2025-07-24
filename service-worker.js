const CACHE_NAME = 'couple-growup-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    // All assets are now in the 'icons' folder
    '/icons/Aku.png',
    '/icons/Background.jpg',
    '/icons/Calendar.png',
    '/icons/Dashboard.png',
    '/icons/Game-time.png',
    '/icons/Habits.png',
    '/icons/keuangan.png',
    '/icons/Monitor-event.png',
    '/icons/pasangan.png',
    '/icons/pic-dropping.png',
    '/icons/Tabungan.png',
    '/icons/Wishlist.png',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request).catch(() => {
                    // If network is unavailable, you can return a fallback page
                    // For example, if it's an HTML request, return an offline page
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html'); // Or a dedicated offline.html
                    }
                    return new Response('Network error or content not found.', { status: 404 });
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
