require('intersection-observer');
const { initModules } = require('./__mocks__/mockModules');

initModules();

global.publicRuntimeConfig = {
  BOOKS_HOST: 'https://books.local.ridi.io',
  STORE_HOST: 'https://master.test.ridi.io',
  STORE_MASTER_HOST: 'https://master.test.ridi.io',
  STORE_API: 'https://store-api.dev.ridi.io',
  STATIC_CDN_URL: 'https://books.ridicdn.net',
};

window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
    };
  };

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  function(callback) {
    setTimeout(callback, 0);
  };
