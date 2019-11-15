// Todo Uglify or minize,
// Todo dev/prod 분리

const PRECACHE_NAME = 'books-precache';

if ('workbox' in self) {
  workbox.setConfig({ debug: true, cleanupOutdatedCaches: true });

  workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

  workbox.routing.registerRoute(
    new RegExp('/'),
    new workbox.strategies.NetworkFirst({
      cacheName: PRECACHE_NAME,
    }),
  );

  workbox.routing.registerRoute(
    /.*\.(jpg|png|jpeg|bmp|woff|woff2|ttf)/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-cache',
      plugins: [
        new workbox.cacheableResponse.Plugin({ statuses: [200] }),
        new workbox.rangeRequests.Plugin(),
      ],
    }),
  );

  workbox.routing.registerRoute(
    /.*(?:ridibooks)\.com.*$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'misc-images-cache',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxEntries: 1000,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  );
}
