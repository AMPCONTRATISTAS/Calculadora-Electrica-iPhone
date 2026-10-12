
const CACHE_NAME = 'calculadora-electrica-v1';

const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll([
        './',
        './index.html',
        './manifest.webmanifest'
      ]);

      await Promise.all(
        ['./icon-192.png', './icon-512.png'].map(
          async (archivo) => {
            try {
              await cache.add(archivo);
            } catch (error) {
              console.warn('Archivo opcional:', archivo);
            }
          }
        )
      );
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (new URL(event.request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(
      (respuesta) => respuesta || fetch(event.request)
    )
  );
});