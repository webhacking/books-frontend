import * as React from 'react';

export const initModules = () => {
  // jest.mock('src/utils/sentry', () => ({ notifySentry: () => null }));
  jest.mock('next/dynamic', () => () => {
    const DynamicComponent = () => null;
    DynamicComponent.displayName = 'LoadableComponent';
    DynamicComponent.preload = jest.fn();
    return DynamicComponent;
  });
  jest.mock('next/config', () => () => ({ publicRuntimeConfig: {} }));
  jest.mock('server/routes', () => {
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
