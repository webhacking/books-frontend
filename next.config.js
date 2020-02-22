/* eslint-disable no-process-env */
/* eslint-disable @typescript-eslint/no-var-requires */

const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');
const withTM = require('next-transpile-modules');
// const withImages = require('next-images')
const withSvgr = require("next-svgr");
const withCSS = require('@zeit/next-css');
const nextSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});
const SentryCliPlugin = require('@sentry/webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const { InjectManifest } = require('workbox-webpack-plugin');

dotenvLoad();
const ENVIRONMENT = process.env.ENVIRONMENT || 'production';
const STATIC_CDN_URL = process.env.STATIC_CDN_URL || 'https://books.ridicdn.net';

const nextConfig = {
  assetPrefix: STATIC_CDN_URL,
  compress: false,
  distDir: 'build',
  exportPathMap: () => ({}),
  experimental: {
    redirects() {
      return [
        {
          source: "/general/:path*",
          destination: "/:path*",
          permanent: true,
        },
      ];
    },
    rewrites() {
      return [
        ...['', 'bestsellers'].map(path => ({
          source: `/${path}`,
          destination: `/general/${path}`,
        })),
      ];
    },
  },
  webpack (config, { buildId, isServer, webpack }) {
    config.output.publicPath = STATIC_CDN_URL + '/_next/';

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

    if (!['local', 'profile'].includes(ENVIRONMENT)) {
      config.plugins.push(
        new SentryCliPlugin({
          include: ['./build/', './src/'],
          release: buildId,
          urlPrefix: '~/_next/',
          ignoreFile: '.sentrycliignore',
          entries: [],
          ignore: ['coverage', 'server', 'node_modules', 'webpack.config.js'],
          rewrite: true,
        }),
      );
    }
    // config.plugins.push(
    //   new CopyPlugin([
    //     {
    //       from: '../static/manifest.webmanifest',
    //       to: '',
    //       transform(content) {
    //         return Promise.resolve(
    //           Buffer.from(content, 'utf8')
    //             .toString()
    //             .replace(/<path>/gi, STATIC_CDN_URL),
    //         );
    //       },
    //     },
    //   ]),
    // );
    config.plugins.push(
      new DotenvPlugin({
        systemvars: true,
        silent: true,
      }),
    );
    config.plugins.push(
      new InjectManifest({
        swSrc: 'public/static/service-worker.js',
        exclude: [
          /\.map$/,
          /\/pages\/partials\//,
          /build-manifest\.json/,
          /manifest\.webmanifest/,
        ],
      }),
    );

    config.plugins.push(new webpack.DefinePlugin({
      'process.env.IS_SERVER': JSON.stringify(isServer),
    }));

    config.plugins.push(
      new DotenvPlugin({
        systemvars: true,
        silent: true,
      }),
    );

    config.node = {
      net: 'empty',
      fs: 'empty',
    };
    return config;
  },
};

module.exports = withPlugins([
  [withBundleAnalyzer, {
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
  }],
  [withTM, {
    transpileModules: ['p-retry'],
  }],
  // [withImages, {
  //   // inlineImageLimit: 8192,
  // }],
  [withSvgr],
  [withCSS],
  [nextEnv()],
  [nextSourceMaps],
], nextConfig);
