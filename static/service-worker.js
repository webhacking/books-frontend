if ('workbox' in self) {
  workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

  workbox.loadModule('workbox-strategies');

  workbox.skipWaiting();
  workbox.clientsClaim();

  // ridibooks 요청일 경우 stateWhileRevalidate 캐싱
  workbox.routing.registerRoute(
    /.*(?:ridibooks)\.com.*$/,
    workbox.strategies.staleWhileRevalidate(),
  );
}
