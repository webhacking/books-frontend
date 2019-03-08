const withTypeScript = require('@zeit/next-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const nextSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});
const SentryCliPlugin = require('@sentry/webpack-plugin');
const { parsed: localEnv = {} } = require('dotenv').config();
const CopyPlugin = require('copy-webpack-plugin');

module.exports = nextSourceMaps(
  withTypeScript({
    distDir: '../build',
    assetPrefix: localEnv.CDN_URL || undefined,
    useFileSystemPublicRoutes: false,
    exportPathMap: () => {
      return {};
    },
    publicRuntimeConfig: {
      ENVIRONMENT: process.env.ENVIRONMENT || localEnv.ENVIRONMENT || 'local',
      SENTRY_DSN: process.env.SENTRY_DSN || localEnv.SENTRY_DSN,
      VERSION: require('./package.json').version,
      ...require(`./env/${process.env.ENVIRONMENT || localEnv.ENVIRONMENT || 'local'}`),
    },
    webpack(config, option) {
      if (option.isServer) {
        config.plugins.push(
          new ForkTsCheckerWebpackPlugin({
            tsconfig: '../tsconfig.json',
          }),
        );
      }
      if (process.env.ENVIRONMENT !== 'local') {
        config.plugins.push(
          new SentryCliPlugin({
            include: ['./build/', './src/'],
            release: require('./package.json').version,
            urlPrefix: `~/_next/`,
            ignoreFile: '.sentrycliignore',
            entries: [],
            ignore: ['coverage', 'server', 'node_modules', 'webpack.config.js'],
            rewrite: true,
          }),
        );
      }
      config.output.publicPath = localEnv.CDN_URL ? localEnv.CDN_URL + '/_next/' : undefined;
      config.plugins.push(
        new CopyPlugin([
          {
            from: '../static/manifest.webmanifest',
            to: '../build',
          },
        ]),
      );
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
  }),
);
