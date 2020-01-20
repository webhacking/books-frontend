const Sentry = require('@sentry/node');
const SentryIntegrations = require('@sentry/integrations');

const { captureException, withScope, init } = Sentry;

module.exports = (nextBuildId = publicRuntimeConfig.SENTRY_RELEASE) => {
  const sentryOptions = {
    dsn: publicRuntimeConfig.SENTRY_DSN,
    release: nextBuildId,
    maxBreadcrumbs: 30,
    environment: publicRuntimeConfig.ENVIRONMENT || 'local',
    attachStacktrace: true,
    ignoreErrors: [
      'ERR_BLOCKED_BY_CLIENT',
      'fb_xd_fragment',
      'Failed to fetch',
      'NetworkError when attempting to fetch resource',
      '__naverapp__',
      '__gCrWeb.autofill.extractForms',
      'There is no clipping info for given tab', // Evernote extension error
      "Unexpected token 'else'",
      'Unexpected identifier',
      'Unexpected end of input',
      'TypeError: WebKit에 내부 오류 발생',
      'Software caused connection abort',
      '소프트웨어에 의한 연결 중단',
      'No identifiers allowed directly after numeric literal',
      '특정 호스트 이름을 가진 서버를 찾을 수 없습니다',
      'TypeError: cancelled',
      'TypeError: 취소됨',
      'The Internet connection appears to be offline.',
      '서버에 안전하게 연결할 수 없습니다',
      'SSL',
      'A server with the specified hostname could not be found.',
      'The network connection was lost.',
      'kCFErrorDomainCFNetwork',
      '网络连接已中断。',
      '错误的 URL',
      '已取消',
      '未能找到使用指定主机名的服务器。',
      '指定されたホスト名のサーバが見つかりませんでした。',
      '未能完成该操作。软件导致连接中止',
      'Type error',
      'キャンセルしました',
      'supported-color-schemes',
      '请求超时。',
      'Abgebrochen',
      'cancelado',
      'AdBlock',
      'mttLongPressVar',
      'Blocked a frame with origin',
      "has no method 'checkDomStatus'",
      '이 서버에 대한 인증서가 유효하지 않습니다',
    ],
    sampleRate: 0.6,
    whitelistUrls: [
      /https?:\/\/(.+\.)?ridibooks\.com/,
      /https?:\/\/(.+\.)?ridi\.io/,
      /https?:\/\/s3.ap-northeast-2.amazonaws.com\/beacon-ridibooks(-test)*/,
    ],
  };
  init(sentryOptions);

  // // eslint-disable-next-line no-process-env
  // if (process.env.NODE_ENV !== 'production') {
  //   const sentryTestkit = require('sentry-testkit');
  //   const { sentryTransport } = sentryTestkit();
  //
  //   sentryOptions.transport = sentryTransport;
  //   sentryOptions.integrations = [
  //     new SentryIntegrations.Debug({
  //       // Trigger DevTools debugger instead of using console.log
  //       debugger: false,
  //     }),
  //   ];
  // }

  return {
    Sentry,
    captureException: (error, ctx = null) => {
      let eventId;
      withScope(scope => {
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

        if (ctx) {
          const { isServer, req, res, err, asPath, query, pathname } = ctx;
          scope.setTag('isServer', isServer);
          scope.setTag('path', asPath);
          scope.setExtra('NEXT_JS_ERROR', String(err));
          scope.setExtra('query', query);

          if (req && res) {
            scope.setExtra('NEXT_JS_RES_STATUS_CODE', res.statusCode);
          }
        }
        eventId = captureException(error);
      });
      return eventId;
    },
  };
};
