const CACHE_NAME = 'couple-growup-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    // Tambahkan URL ikon yang digunakan di sini agar bisa di-cache
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:Dasboard.png-c08212f9-e382-4ea6-aad3-963ea6c21cfc',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:Keuangan.png-88ae531d-2354-473f-8df5-182c9446e253',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:Tabungan.png-9e41643e-d7ef-41cc-9cee-838dbbbf2e5c',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:Game-time.png-e6a68a2b-d98b-48fa-b24f-af92b70f0145',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:pasangan.jpg-74ef9965-99b5-47a2-a44f-18dfdd16b132',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:Calender.png-f713adef-8c8c-48fe-a163-3a27626232ad',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:Habits.png-3847b4bc-8889-43c7-a2ba-7193ea1971b8',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:pic-drop.png-2cbb69f5-bcd3-419f-9582-465ecba93840',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:wishlist.png-8c35dc3c-0673-4b4f-bc0e-de088a0a933b',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:Monitor-event.png-b7009ade-dad1-43ec-8363-29fefbd77e9d',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:aku.png-7e124c76-1de2-454b-bef5-1c9fbb1bfa18',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:kamu.png-59ac26c5-fe8e-4961-9f2f-8fd1e1efc913',
    // Icon aplikasi yang baru
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:icon-192.png-778d07d5-a99c-4db2-b91c-87e7ecc9d4bb',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:icon-512.jpg-5342d4fd-19a2-4d01-aa89-1b99e49eb33a',
    'https://googleusercontent.com/file_content/0?contentFetchId=uploaded:Background.jpg-009aaa04-4b2b-4921-b937-a0f717a496ec'
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
                // If not in cache, fetch from network
                return fetch(event.request).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and can only be consumed once. We must clone it so that
                        // the browser can consume one and we can consume the other.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
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
