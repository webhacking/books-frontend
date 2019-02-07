module.exports = {
  apps: [
    {
      name: 'store-ssr-server',
      script: 'ts-node',
      args: '--project ./tsconfig.server.json ./server/index.ts',
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
