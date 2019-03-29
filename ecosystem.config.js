module.exports = {
  apps: [
    {
      name: 'books-server',
      script: './server/server.js',
      autorestart: true,
      watch: './{server}/**/*.{js,jsx,ts,tsx}',
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
