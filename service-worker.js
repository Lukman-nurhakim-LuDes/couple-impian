Berikut adalah pembaruan pada Service Worker Anda:


```javascript
// Nama cache untuk aplikasi Anda
const CACHE_NAME = 'couple-growup-cache-v1';

// Daftar URL aset yang akan di-cache
// Pastikan nama file ini sesuai persis dengan yang ada di folder 'icons' Anda (termasuk huruf besar/kecil dan spasi)
const urlsToCache = [
    '/',
    '/index.html',
    '/icons/aku.png',
    '/icons/Background.jpg',
    '/icons/Kalender.png',
    '/icons/Dasbor.png',
    '/icons/Game-time.png',
    '/icons/Habits.png',
    '/icons/keuangan.png',
    '/icons/Monitor-event.png',
    '/icons/pasangan.png',
    '/icons/pic drop.png',
    '/icons/Tabungan.png',
    '/icons/Wishlist.png',
    '/icons/icon-192.png', // Pastikan file ini ada dan berukuran 192x192px
    '/icons/icon-512.png', // Pastikan file ini ada dan berukuran 512x512px
    '/icons/kamu.png',
    // URL CDN eksternal yang juga perlu di-cache
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

// Event 'install' Service Worker: Menginstal Service Worker dan membuka cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cache dibuka');
                // Menambahkan semua aset ke cache
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Service Worker: Gagal menambahkan aset ke cache selama instalasi:', error);
            })
    );
});

// Event 'fetch' Service Worker: Mencegat permintaan jaringan
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika ada di cache, kembalikan respons dari cache
                if (response) {
                    return response;
                }
                // Jika tidak ada di cache, coba ambil dari jaringan
                return fetch(event.request).catch(() => {
                    // If network is unavailable, you can return a fallback page
                    // For example, if it's an HTML request, return an offline page
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html'); // Or a dedicated offline.html
                    }
                    // For other assets, return an error response
                    return new Response('Kesalahan jaringan atau konten tidak ditemukan.', { status: 404 });
                });
            })
    );
});

// Event 'activate' Service Worker: Mengaktifkan Service Worker dan membersihkan cache lama
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // Daftar cache yang valid saat ini
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Hapus cache yang tidak ada dalam daftar putih (whitelist)
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
