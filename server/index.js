process.env.SERVERLESS = true;
process.env.NODE_ENV = 'production';

const sls = require('serverless-http');
const binaryMimeTypes = require('./binaryMimeTypes');
const { server } = require('./server');

// binary mode
// https://github.com/dougmoscrop/serverless-http/blob/master/docs/ADVANCED.md#binary-mode
module.exports.handler = sls(server, {
  binary: binaryMimeTypes,
});
