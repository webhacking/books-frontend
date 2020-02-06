const path = require('path');

const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const initSentry = require('../src/utils/sentry');
const csp = require('./csp');
const { clientRoutes } = require('./routes');

function createServer(app, isDev = false) {
  const server = express();
  const { Sentry } = initSentry(app.buildId);
  const handle = clientRoutes.getRequestHandler(app);

  if (!isDev) {
    csp(server);
  }
  server.use(compression());
  server.use(Sentry.Handlers.requestHandler());
  server.use(cookieParser());
  server.use(express.json());
  server.use('/_next', express.static(path.join(__dirname, '../build')));
  server.use('/static', express.static(path.join(__dirname, '../static')));
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
  server.use(Sentry.Handlers.errorHandler());
  return server;
}

module.exports = {
  createServer,
};
