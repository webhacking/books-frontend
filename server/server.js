const next = require('next');
const path = require('path');

const { createServer } = require('./common');

require('dotenv').config();
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '8081', 10);
const app = next({ dev, dir: path.resolve(__dirname, dev ? '../src' : '../build') });

const { injectConfig } = require('../env/publicRuntimeConfig');

injectConfig(app.buildId);
const server = createServer(app, dev);

if (!process.env.SERVERLESS) {
  app.prepare().then(() => {
    server.listen(port, () => {
      console.log(`Listening: ${port}`);
    });
  });
}

module.exports = { server };
