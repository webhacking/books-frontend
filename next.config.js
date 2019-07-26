const { InjectManifest } = require('workbox-webpack-plugin');
const nextSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});
const SentryCliPlugin = require('@sentry/webpack-plugin');
const { parsed: localEnv = {} } = require('dotenv').config();
const CopyPlugin = require('copy-webpack-plugin');
const withCSS = require('@zeit/next-css');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

module.exports = withBundleAnalyzer(
  nextSourceMaps(
    withCSS({
      distDir: '../build',
      assetPrefix: localEnv.STATIC_CDN_URL || 'https://books.local.ridi.io',
      useFileSystemPublicRoutes: false,
      experimental: {
        amp: true,
      },
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
        const originalEntry = config.entry;
        config.entry = async () => {
          const entries = await originalEntry();
          Object.values(entries).forEach(entry => {
            if (!!entry.unshift) {
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
            }
          });
          return entries;
        };
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
        config.output.publicPath = !!localEnv.STATIC_CDN_URL
          ? localEnv.STATIC_CDN_URL + '/_next/'
          : '/_next/';
        config.plugins.push(
          new CopyPlugin([
            {
              from: '../static/manifest.webmanifest',
              to: '',
              transform(content, src) {
                return Promise.resolve(
                  Buffer.from(content, 'utf8')
                    .toString()
                    .replace(/<path>/gi, localEnv.STATIC_CDN_URL || ''),
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
              /build-manifest.json/,
              /manifest.webmanifest/,
            ],
          }),
        );

        config.node = {
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
);
