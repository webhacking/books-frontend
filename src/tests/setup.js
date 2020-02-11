require('intersection-observer');
const { initModules } = require('./__mocks__/mockModules');

function initWindow() {
  window.matchMedia = window.matchMedia
    || function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };

  window.requestAnimationFrame = window.requestAnimationFrame
    || function (callback) {
      setTimeout(callback, 0);
    };

  const newLocation = new Proxy(window.location, {
    href: '',
    get(target, p) {
      if (p === 'href') {
        return this.href;
      }
      return target[p];
    },
    set(target, p, value) {
      if (p === 'href') {
        this.href = value;
        return true;
      }
      target[p] = value;
      return true;
    },
  });
  Object.defineProperty(window, 'location', {
    value: newLocation,
  });
}

function initNextJSRuntimeConfig() {
  global.publicRuntimeConfig = {
    BOOKS_HOST: 'https://books.local.ridi.io',
    SEARCH_API: 'https://search-api.staging.ridi.io',
    STORE_HOST: 'https://master.test.ridi.io',
    STORE_MASTER_HOST: 'https://master.test.ridi.io',
    STORE_API: 'https://store-api.dev.ridi.io',
    STATIC_CDN_URL: 'https://books.ridicdn.net',
  };
}

initModules();
initWindow();
initNextJSRuntimeConfig();
