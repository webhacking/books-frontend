const { InjectManifest } = require('workbox-webpack-plugin');
const nextSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});
const SentryCliPlugin = require('@sentry/webpack-plugin');
const { parsed: localEnv = {} } = require('dotenv').config();
const CopyPlugin = require('copy-webpack-plugin');
const withCSS = require('@zeit/next-css');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const webpack = require('webpack');
const withTM = require('next-transpile-modules');

const STATIC_CDN_URL = process.env.STATIC_CDN_URL || localEnv.STATIC_CDN_URL || '';
const ENVIRONMENT = process.env.ENVIRONMENT || localEnv.ENVIRONMENT || 'local';

module.exports = withBundleAnalyzer(
  nextSourceMaps(
    withCSS(
      withTM({
        transpileModules: ['p-retry'], // for IE11
        distDir: '../build',
        assetPrefix: STATIC_CDN_URL || 'https://books.local.ridi.io',
        useFileSystemPublicRoutes: false,
        exportPathMap: () => {
          return {};
        },
        webpack(config, option) {
          const { isServer, buildId } = option;
          if (!isServer) {
            config.resolve.alias['@sentry/node'] = '@sentry/browser';
          }
          config.output.publicPath = STATIC_CDN_URL + '/_next/';

          const modifyEntries = entries => {
            Object.values(entries).forEach(entry => {
              if (!entry.includes('@babel/polyfill/noConflict')) {
                entry.unshift('@babel/polyfill/noConflict');
              } else if (typeof entry === 'string') {
                entry = ['@babel/polyfill/noConflict', entry];
              }

              if (!entry.includes('intersection-observer')) {
                entry.unshift('intersection-observer');
              } else if (typeof entry === 'string') {
                entry = ['intersection-observer', entry];
              }
            });
          };
          if (typeof config.entry === 'function') {
            modifyEntries(config.entry);
          } else {
            config.entry = (entriesFunction => {
              const entries = entriesFunction();
              if (typeof entries.then === 'function') {
                return entries.then(modifyEntries);
              } else {
                return modifyEntries(entries);
              }
            })(config.entry);
          }

          config.module.rules.push({
            test: /\.(eot|woff|woff2|ttf|png|jpg|gif)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 100000,
                name: '[name].[ext]',
              },
            },
          });
          config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
          });

          if (ENVIRONMENT !== 'local') {
            config.plugins.push(
              new SentryCliPlugin({
                include: ['./build/', './src/'],
                release: buildId,
                urlPrefix: `~/_next/`,
                ignoreFile: '.sentrycliignore',
                entries: [],
                ignore: ['coverage', 'server', 'node_modules', 'webpack.config.js'],
                rewrite: true,
              }),
            );
          }
          config.plugins.push(
            new CopyPlugin([
              {
                from: '../static/manifest.webmanifest',
                to: '',
                transform(content) {
                  return Promise.resolve(
                    Buffer.from(content, 'utf8')
                      .toString()
                      .replace(/<path>/gi, STATIC_CDN_URL),
                  );
                },
              },
            ]),
          );
          config.plugins.push(
            new InjectManifest({
              swSrc: 'static/service-worker.js',
              exclude: [
                /\.map$/,
                /\/pages\/partials\//,
                /build-manifest\.json/,
                /manifest\.webmanifest/,
              ],
            }),
          );
          const publicRuntimeConfig = {
            ENVIRONMENT,
            SENTRY_DSN: process.env.SENTRY_DSN || localEnv.SENTRY_DSN,
            SENTRY_RELEASE: buildId,
            VERSION: require('./package.json').version,
            ...require(`./env/${ENVIRONMENT}`),
          };
          const defs = {};
          Object.entries(publicRuntimeConfig).forEach(([key, value]) => {
            defs[`publicRuntimeConfig.${key}`] = JSON.stringify(value);
          });
          config.plugins.push(new webpack.DefinePlugin(defs));

          config.node = {
            net: 'empty',
            fs: 'empty',
          };
          return config;
        },
        analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
        analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
        bundleAnalyzerConfig: {
          server: {
            analyzerMode: 'static',
            reportFilename: '../bundles/server.html',
          },
          browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html',
          },
        },
      }),
    ),
  ),
);
