// Service Worker muy simple: precache de archivos básicos y estrategia "network falling back to cache"
const CACHE = 'hola-mundo-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/styles.css',
  './src/app.js',
  './icons/logo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE) ? null : caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
