const express = require('express');
const next = require('next');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '8081', 10);
const app = next({ dev, dir: path.resolve(__dirname, '../src') });

const { clientRoutes } = require('./routes');

const handle = clientRoutes.getRequestHandler(app);

function createServer() {
  const server = express();

  server.use(compression());
  server.use(cookieParser());
  server.use(express.json());
  server.use((req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    next();
  });

  server.use(`/_next`, express.static(path.join(__dirname, '../build')));
  server.use('/static', express.static(path.join(__dirname, '../static')));
  server.get('*', async (req, res) => {
    // console.log(req.url);
    if (req.url === '/service-worker.js' || req.url.includes('precache-manifest')) {
      const filePath = path.join(__dirname, '../', 'build', req.url);
      // console.log(filePath);
      await app.serveStatic(req, res, filePath);
    }
    return handle(req, res);
  });

  return server;
}

const server = createServer();

if (!process.env.SERVERLESS) {
  app.prepare().then(() => {
    server.listen(port, () => {
      console.log(`Listening: ${port}`);
    });
  });
}

module.exports = { server };
