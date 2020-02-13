const { version: VERSION } = require('../package.json');

function createConfig() {
  const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

  return {
    ENVIRONMENT,
    VERSION,
    ...require(`./${ENVIRONMENT}`),
  };
}

function addSentryConfig(config, release) {
  return {
    ...config,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_RELEASE: release,
  };
}

function injectConfig(config) {
  global.publicRuntimeConfig = config;
}

function getDefinitionsFromConfig(config) {
  const defs = {};
  Object.entries(config).forEach(([key, value]) => {
    defs[`publicRuntimeConfig.${key}`] = JSON.stringify(value);
  });
  return defs;
}

module.exports = {
  addSentryConfig,
  createConfig,
  injectConfig,
  getDefinitionsFromConfig,
};
