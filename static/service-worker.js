if ('workbox' in self) {
  workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

  workbox.routing.registerRoute(new RegExp('.*.js'), new workbox.strategies.NetworkFirst());

  workbox.routing.registerRoute(
    /.*\.(jpg|png|jpeg|bmp)/,
    new workbox.strategies.CacheFirst({
      cacheName: 'books-images',
      plugins: [
        new workbox.cacheableResponse.Plugin({ statuses: [200] }),
        new workbox.rangeRequests.Plugin(),
      ],
    }),
  );
}
