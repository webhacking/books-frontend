module.exports = {
  apps: [
    {
      name: 'store-web-server',
      script: './server/server.js',
      autorestart: true,
      watch: './{server,src}/**/*.{js,jsx,ts,tsx}',
      env_development: {
        PORT: 8081,
        NODE_ENV: 'development',
      },
      env_local: {
        PORT: 8081,
        NODE_ENV: 'local',
      },
    },
  ],
};
