const { version: VERSION } = require('../package.json');

function createConfig(buildId) {
  const ENVIRONMENT = process.env.ENVIRONMENT || 'local';

  return {
    ENVIRONMENT,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_RELEASE: buildId,
    VERSION,
    ...require(`./${ENVIRONMENT}`),
  };
}

function injectConfig(buildId) {
  global.publicRuntimeConfig = createConfig(buildId);
}

function getDefinitions(buildId) {
  const publicRuntimeConfig = createConfig(buildId);
  const defs = {};
  Object.entries(publicRuntimeConfig).forEach(([key, value]) => {
    defs[`publicRuntimeConfig.${key}`] = JSON.stringify(value);
  });
  return defs;
}

module.exports = {
  injectConfig,
  getDefinitions,
};
