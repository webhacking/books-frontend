const Sentry = require('@sentry/node');
const SentryIntegrations = require('@sentry/integrations');

const getConfig = require('next/config').default;
const { publicRuntimeConfig } = getConfig();
const { captureException, configureScope, init } = Sentry;

// eslint-disable-next-line no-process-env
module.exports = (nextBuildId = process.env.SENTRY_RELEASE) => {
  const sentryOptions = {
    dsn: publicRuntimeConfig.SENTRY_DSN,
    release: nextBuildId,
    maxBreadcrumbs: 30,
    environment: publicRuntimeConfig.ENVIRONMENT || 'local',
    attachStacktrace: true,
    ignoreErrors: [
      /ERR_BLOCKED_BY_CLIENT/,
      'fb_xd_fragment',
      /ReferenceError:.*/,
      /Failed to fetch/,
      /window.__naverapp__.extractMetadata/,
      /TypeError: undefined is not an object (evaluating '__gCrWeb.autofill.extractForms')/,
    ],
    sampleRate: 0.2,
    whitelistUrls: [
      /https?:\/\/(.+\.)?ridibooks\.com/,
      /https?:\/\/(.+\.)?ridi\.io/,
      /https?:\/\/s3.ap-northeast-2.amazonaws.com\/beacon-ridibooks(-test)*/,
    ],
  };
  init(sentryOptions);

  // eslint-disable-next-line no-process-env
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

          // isAxiosError
          if (error.config) {
            if (error.response) {
              scope.setExtra('Axios Response Url', error.config.url);
              scope.setTag('AXIOS_RESPONSE_CODE', error.response.status);
              scope.setTag('API_URL', error.config.url);
              scope.setFingerprint([
                error.config.url,
                error.response.status,
                error.message,
              ]);
            }
          }
          scope.setTag('isServer', isServer);
          scope.setExtra('path', asPath);
          scope.setExtra('NEXT_JS_ERROR', err);
          scope.setExtra('query', query);
          const state = store.getState();
          if (state.account && state.account.loggedUser) {
            // SSR 에 유저 정보가 없으니 늘 빈 값일 거 같다.
            // Fixme CSR 하다 에러가 났을 때 store 를 어디서 받아올지 고민
            scope.setExtras(state.account.loggedUser);
          }

          if (req && res) {
            scope.setExtra('NEXT_JS_RES_STATUS_CODE', res.statusCode);
          }
        }
      });

      return captureException(error);
    },
  };
};
