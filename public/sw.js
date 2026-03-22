const CACHE_VERSION = 'photremium.com-images-v1';
const CACHE_NAME = `${CACHE_VERSION}`;

const IMAGES_TO_CACHE = [
  '/Images/hero.webp',
  '/Images/image-compressor.webp',
  '/Images/image-resizer.webp',
  '/Images/image-croper.webp',
  '/Images/convert-to-jpg.webp',
  '/Images/convert-from-jpg.webp',
  '/Images/qr-code-generator.webp',
  '/Images/qr-code-scanner.webp',
  '/Images/blur-face.webp',
  '/Images/background-remover.webp',
  '/Images/watermark-image.webp',
];

const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const withScope = (assetPath) => `${scopePath}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`;
const scopedAssets = IMAGES_TO_CACHE.map(withScope);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(scopedAssets)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('photremium.com-images-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  const isCachedImage = scopedAssets.includes(requestUrl.pathname);
  if (!isCachedImage) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      });
    })
  );
});