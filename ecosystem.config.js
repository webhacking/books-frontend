module.exports = {
  apps: [
    {
      name: 'books-server',
      script: './server/server.js',
      autorestart: true,
      watch: './{server}/**/*.{js,jsx,ts,tsx}',
      env_local: {
        PORT: 8081,
        NODE_ENV: 'local',
      },
    },
  ],
};
