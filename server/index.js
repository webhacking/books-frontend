process.env.SERVERLESS = true;
process.env.NODE_ENV = 'production';

const sls = require('serverless-http');
const binaryMimeTypes = require('./binaryMimeTypes');
const { server } = require('./server');

module.exports.handler = sls(server, {
  binary: binaryMimeTypes,
});
