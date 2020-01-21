import * as React from 'react';

export const initModules = () => {
  // jest.mock('src/utils/sentry', () => ({ notifySentry: () => null }));
  jest.mock('axios', () => {
    let handler = (method: string, ...rest: any[]) => {
      return { data: {} };
    };
    return {
      __setHandler(newHandler: (method: string, ...rest: any[]) => any) {
        handler = newHandler;
      },
      get(...args: any[]) {
        return handler('get', ...args);
      },
      post(...args: any[]) {
        return handler('post', ...args);
      },
      put(...args: any[]) {
        return handler('put', ...args);
      },
      delete(...args: any[]) {
        return handler('delete', ...args);
      },
      defaults: {
        timeout: 1000,
      },
      CancelToken: {
        source: () => {
          return {
            cancel: () => null,
          };
        },
      },
      create: () => ({
        get: () => {
          return { data: {} };
        },
        interceptors: {
          request: {},
          response: {
            use: () => null,
          },
        },
      }),
    };
  });
  jest.mock('@ridi/event-tracker', () => {
    const DeviceType = {
      PC: 'pc',
    };
    return {
      DeviceType: {
        PC: 'pc',
      },
      Tracker: class Tracker {
        constructor() {}
        initialize() {}
      },
    };
  });
  // jest.mock('next/router', () => () => ({ useRouter: () => {} }));
  jest.mock('next/dynamic', () => () => {
    const DynamicComponent = () => null;
    DynamicComponent.displayName = 'LoadableComponent';
    DynamicComponent.preload = jest.fn();
    return DynamicComponent;
  });

  jest.mock('src/utils/sentry', () => () => ({
    captureException: () => null,
  }));

  jest.mock('server/routes', () => {
    // eslint-disable-next-line global-require
    require('react');
    return {
      default: {},
      // @ts-ignore
      Link: props => <div>{props.children}</div>,
      Router: {
        pushRoute: () => null,
        push: () => null,
        replace: () => null,
        replaceRoute: () => null,
      },
    };
  });
};
