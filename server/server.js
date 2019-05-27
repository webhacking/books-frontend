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

  server.use('/_next', express.static(path.join(__dirname, '../build')));
  server.use('/static', express.static(path.join(__dirname, '../static')));
  server.get('/partials/gnb', (req, res) => {
    return app.render(req, res, '/partials/gnb', {
      ...req.query,
    });
  });
  server.get('/partials/footer', (req, res) => {
    return app.render(req, res, '/partials/footer', {
      ...req.query,
    });
  });

  server.get('*', async (req, res) => {
    if (
      req.url === '/favicon.ico' ||
      req.url === '/service-worker.js' ||
      req.url.includes('precache-manifest') ||
      req.url.includes('react-loadable-manifest.json') ||
      req.url === '/manifest.webmanifest'
    ) {
      const filePath = path.join(__dirname, '../', 'build', req.url);
      await app.serveStatic(req, res, filePath);
      return;
    }
    return handle(req, res);
  });
  server.use(function(err, req, res, next) {
    console.log(err);
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
