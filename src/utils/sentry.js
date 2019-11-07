const Sentry = require('@sentry/node');
const SentryIntegrations = require('@sentry/integrations');

const getConfig = require('next/config').default;
const { publicRuntimeConfig } = getConfig();
const { captureException, configureScope, init } = Sentry;

module.exports = (nextBuildId = process.env.SENTRY_RELEASE) => {
  const sentryOptions = {
    dsn: publicRuntimeConfig.SENTRY_DSN,
    release: nextBuildId,
    maxBreadcrumbs: 50,
    environment: publicRuntimeConfig.ENVIRONMENT || 'local',
    attachStacktrace: true,
    sampleRate: 0.5,
  };

  init(sentryOptions);

  if (process.env.NODE_ENV !== 'production') {
    const sentryTestkit = require('sentry-testkit');
    const { sentryTransport } = sentryTestkit();

    sentryOptions.transport = sentryTransport;
    sentryOptions.integrations = [
      new SentryIntegrations.Debug({
        // Trigger DevTools debugger instead of using console.log
        debugger: false,
      }),
    ];
  }

  return {
    Sentry,
    captureException: (error, ctx = null) => {
      configureScope(scope => {
        if (ctx) {
          const {
            isServer,
            req,
            res,
            store,
            err,
            asPath,
            query,
            pathname,
            ...rest
          } = ctx;
          scope.setTag('isServer', isServer);
          scope.setExtra('path', asPath);
          scope.setExtra('NEXT_JS_ERROR', err);
          scope.setExtra('query', query);
          // Todo add extra store information
          const state = store.getState();

          if (req && res) {
            scope.setExtra('RES_STATUS_CODE', res.statusCode);
          }
        }
      });

      return captureException(error);
    },
  };
};
