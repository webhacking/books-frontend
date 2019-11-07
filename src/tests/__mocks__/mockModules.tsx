import * as React from 'react';

export const initModules = () => {
  // jest.mock('src/utils/sentry', () => ({ notifySentry: () => null }));
  jest.mock('axios', () => ({
    defaults: {
      timeout: 1000,
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
  }));
  jest.mock('next/dynamic', () => () => {
    const DynamicComponent = () => null;
    DynamicComponent.displayName = 'LoadableComponent';
    DynamicComponent.preload = jest.fn();
    return DynamicComponent;
  });

  jest.mock('src/utils/sentry', () => () => ({}));

  jest.mock('next/config', () => () => ({
    publicRuntimeConfig: {
      BOOKS_HOST: 'https://books.local.ridi.io',
      STORE_HOST: 'https://master.test.ridi.io',
      STORE_API: 'https://store-api.dev.ridi.io',
    },
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
