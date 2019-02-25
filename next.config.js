const withTypeScript = require('@zeit/next-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const { parsed: localEnv = {} } = require('dotenv').config();

module.exports = withTypeScript({
  distDir: '../build',
  assetPrefix: localEnv.CDN_URL || undefined,
  exportPathMap: () => {
    return {};
  },
  webpack(config, option) {
    if (option.isServer)
      config.plugins.push(
        new ForkTsCheckerWebpackPlugin({
          tsconfig: '../tsconfig.json',
        }),
      );
    config.output.publicPath = localEnv.CDN_URL ? localEnv.CDN_URL + '/_next/' : undefined;
    config.plugins.push(
      new InjectManifest({
        swSrc: 'static/service-worker.js',
      }),
    );
    config.node = {
      fs: 'empty',
    };
    return config;
  },
});
