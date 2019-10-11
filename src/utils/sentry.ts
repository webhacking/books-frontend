import * as http from 'http';
import { captureException, init, configureScope, Scope } from '@sentry/browser';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const initializeSentry = () => {
  init({
    dsn: publicRuntimeConfig.SENTRY_DSN,
    environment: publicRuntimeConfig.ENVIRONMENT || 'local',
    release: publicRuntimeConfig.VERSION || 'UNKNOWN',
  });
};

export const notifySentry = (
  err: Error,
  req?: http.IncomingMessage,
  // statusCode?: number,
) => {
  configureScope((scope: Scope) => {
    if (!req) {
      scope.setTag('ssr', 'false');
    } else {
      scope.setTag('ssr', 'true');
    }

    //   scope.setExtra(`url`, req.url);
    //   scope.setExtra(`statusCode`, statusCode);
    //   scope.setExtra(`headers`, req.headers);
    //
    // }
  });

  captureException(err);
};
