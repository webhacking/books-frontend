const next = require('next');
const path = require('path');

const { profile } = require('./core');
const { server } = require('../server');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.resolve(__dirname, '../') });
const port = 8443;

(async () => {
  await app.prepare();
  const listener = server.listen(port);
  await profile(`http://localhost:${port}`);
  listener.close();
})().then(
  () => {
    process.exit(0);
  },
  err => {
    console.error(err);
    process.exit(1);
  },
);
