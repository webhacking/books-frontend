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

    return config;
  },
});
