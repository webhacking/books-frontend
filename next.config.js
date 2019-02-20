const withTypeScript = require('@zeit/next-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = withTypeScript({
  distDir: '../build',
  webpack(config, option) {
    if (option.isServer)
      config.plugins.push(
        new ForkTsCheckerWebpackPlugin({
          tsconfig: '../tsconfig.json',
        }),
      );

    config.node = {
      fs: 'empty',
    };
    return config;
  },

  // https://github.com/zeit/next.js/pull/6305
  // 현재 Https 로 on-demand-entries websocket 이 동작하지 않는 이슈가 있음
  // onDemandEntries: {
  //   // period (in ms) where the server will keep pages in the buffer
  //   maxInactiveAge: 25 * 1000,
  //   // number of pages that should be kept simultaneously without being disposed
  //   pagesBufferLength: 2,
  //   // optionally configure a port for the onDemandEntries WebSocket, not needed by default
  //   websocketPort: 3001,
  //   // optionally configure a proxy path for the onDemandEntries WebSocket, not need by default
  //   websocketProxyPath: '/hmr',
  //   // optionally configure a proxy port for the onDemandEntries WebSocket, not need by default
  //   websocketProxyPort: 80,
  // },
});
