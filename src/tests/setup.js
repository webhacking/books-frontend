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

  Object.defineProperty(window, 'location', {
    value: new URL('https://books.local.ridi.io'),
    configurable: true,
  });
}

initModules();
initWindow();
