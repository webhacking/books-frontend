const next = require('next');
const path = require('path');

const { createServer } = require('./common');

const dev = process.env.NODE_ENV !== 'production';
const dir = path.resolve(__dirname, dev ? '../src' : '../build');
const app = next({ dev, dir });

const server = createServer(app, dev);

if (!process.env.SERVERLESS) {
  app.prepare().then(() => {
    const port = parseInt(process.env.PORT || '8081', 10);
    server.listen(port, () => {
      console.log(`Listening: ${port}`);
    });
  });
}

module.exports = { server };
