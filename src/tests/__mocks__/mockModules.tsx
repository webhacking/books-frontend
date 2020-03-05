import * as React from 'react';

require('dotenv').config();

export const initModules = () => {
  // jest.mock('src/utils/sentry', () => ({ notifySentry: () => null }));
  jest.mock('axios', () => {
    let handler = (method: string, ...rest: any[]) => {
      return { data: {} };
    };
    let createHook = (instance: any, options: any) => {};
    return {
      __setHandler(newHandler: (method: string, ...rest: any[]) => any) {
        handler = newHandler;
      },
      __setCreateHook(
        hook: (
          instance: any,
          options: any,
        ) => ((method: string, ...rest: any[]) => any) | void,
      ) {
        createHook = hook;
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
      create: (options: any) => {
        const ret: any = {
          _getHandler() {
            return ret._handler || handler;
          },
          get(...args: any[]) {
            return ret._getHandler()('get', ...args);
          },
          post(...args: any[]) {
            return ret._getHandler()('post', ...args);
          },
          put(...args: any[]) {
            return ret._getHandler()('put', ...args);
          },
          delete(...args: any[]) {
            return ret._getHandler()('delete', ...args);
          },
          interceptors: {
            request: {
              use: () => null,
            },
            response: {
              use: () => null,
            },
          },
        };
        const localHandler = createHook(ret, options);
        ret._handler = localHandler;
        return ret;
      },
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
        sendEvent() {}
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
};
