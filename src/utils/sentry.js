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
    maxBreadcrumbs: 100,
    environment: publicRuntimeConfig.ENVIRONMENT || 'local',
    attachStacktrace: true,
    ignoreErrors: [
      /ERR_BLOCKED_BY_CLIENT/,
      /fb_xd_fragment/,
      /ReferenceError:.*/,
      /undefined is not an object (evaluating 'e.split')/,
      /React is running in production mode, but dead code elimination has not been applied. Read how to correctly configure React for production/,
      /Cannot read property 'contains' of undefined/,
      /Failed to fetch/,
      /TypeError: NetworkError when attempting to fetch resource/,
      /NetworkError when attempting to fetch resource./,
      /window.__naverapp__.extractMetadata/,
      /TypeError: undefined is not an object (evaluating '__gCrWeb.autofill.extractForms')/,
      // Evernote extension error
      /Error: There is no clipping info for given tab/,
      /Error: SecurityError: Blocked a frame with origin "https:\/\/ridibooks.com" from accessing a frame with origin "https:\/\/bid.g.doubleclick.net". Protocols, domains, and ports must match./,
      /Error: SecurityError: Blocked a frame with origin "https:\/\/ridibooks.com" from accessing a cross-origin frame./,
      /SecurityError: Blocked a frame with origin "https:\/\/ridibooks.com" from accessing a frame with origin "https:\/\/bid.g.doubleclick.net". Protocols, domains, and ports must match./,
      /Uncaught SyntaxError: Unexpected token 'else'/,
      /Uncaught SyntaxError: Unexpected identifier/,
      /null is not an object (evaluating 'window.mttLongPressVar.tagName')/,
      /SyntaxError: Unexpected token 'else'/,
      /SyntaxError: Unexpected identifier/,
      /Unexpected end of input/,
      /TypeError: WebKit에 내부 오류 발생/,
      /The operation couldn’t be completed. Software caused connection abort/,
      /작업을 완료할 수 없습니다. 소프트웨어에 의한 연결 중단/,
      /No identifiers allowed directly after numeric literal/,
      /发生了SSL错误，无法建立与该服务器的安全连接。/,
      /TypeError: 특정 호스트 이름을 가진 서버를 찾을 수 없습니다./,
      /TypeError: cancelled/,
      /TypeError: 취소됨/,
      /An SSL error has occurred and a secure connection to the server cannot be made./,
      /The Internet connection appears to be offline./,
      /SSL 오류가 발생했으며 서버에 안전하게 연결할 수 없습니다./,
      /TypeError: SSL 오류가 발생했기 때문에 서버에 안전하게 연결할 수 없습니다./,
      /SSL/,
      /TypeError: 发生SSL错误，无法建立到该服务器的安全连接。/,
      /TypeError: 특정 호스트 이름을 가진 서버를 찾을 수 없습니다./,
      /TypeError: A server with the specified hostname could not be found./,
      /TypeError: 未能完成操作。（kCFErrorDomainCFNetwork错误310。）/,
      /TypeError: The operation couldn’t be completed. (kCFErrorDomainCFNetwork error 310.)/,
      /TypeError: The network connection was lost./,
      /TypeError: 작업을 완료할 수 없습니다.(kCFErrorDomainCFNetwork 오류 310.)/,
      /Error: SecurityError: Blocked a frame with origin "https:\/\/ridibooks.com" from accessing a cross-origin frame./,
      /TypeError: 未能完成操作。（kCFErrorDomainCFNetwork错误310。）/,
      /TypeError: The Internet connection appears to be offline./,
      /TypeError: 网络连接已中断。/,
      /TypeError: 错误的 URL/,
      /TypeError: 已取消/,
      /TypeError: 发生 SSL 错误，无法建立到该服务器的安全连接。/,
      /TypeError: 未能找到使用指定主机名的服务器。/,
      /TypeError: 指定されたホスト名のサーバが見つかりませんでした。/,
      /TypeError: 未能完成该操作。软件导致连接中止/,
      /TypeError: 취소됨/,
      /TypeError: Type error/,
      /キャンセルしました/,
      /null is not an object (evaluating 'document.head.querySelector("meta[name='supported/-color-schemes']").content')/,
      /TypeError: 请求超时。/,
      /TypeError: Abgebrochen/,
      /Error: SecurityError: Blocked a frame with origin "https:\/\/ridibooks.com" from accessing a cross-origin frame. Protocols, domains, and ports must match./,
      /Error: SecurityError: Blocked a frame with origin "https:\/\/ridibooks.com" from accessing a frame with origin "https:\/\/www.youtube-nocookie.com". Protocols, domains, and ports must match./,
      /TypeError: cancelado/,
      /TypeError: can't redefine non-configurable property "blockAdBlock"/,
      /TypeError: null is not an object (evaluating 'window.mttLongPressVar.tagName')/,
      /TypeError: can't redefine non-configurable property "fuckAdBlock"/,
      /Blocked a frame with origin/,
      /Object [object Object] has no method 'checkDomStatus'/,
      /TypeError: 이 서버에 대한 인증서가 유효하지 않습니다. ‘s3.ap-northeast-2.amazonaws.com’인 것처럼 보이는 서버에 연결될 수 있으며 이렇게 될 경우 사용자의 비밀 정보가 위험에 노출될 수 있습니다./,

      // sentry sendEvent 시 발생해서 일단 막아 둠
      /Converting circular structure to JSON/,
    ],
    sampleRate: 0.5,
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
        } else if (error.config) {
          if (error.response) {
            scope.setExtra('Axios Response Url', error.config.url);
            scope.setTag('AXIOS_RESPONSE_CODE', error.response.status || 'none');
            scope.setTag('API_URL', error.config.url);
            scope.setFingerprint([
              error.config.url,
              error.response.status,
              error.message,
            ]);
          }
        }
      });

      return captureException(error);
    },
  };
};
