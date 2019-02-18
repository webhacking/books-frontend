module.exports = {
  apps: [
    {
      name: 'store-web-server',
      script: './server/server.js',
      autorestart: true,
      watch: './{server,src}/**/*.{js,jsx,ts,tsx}',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
