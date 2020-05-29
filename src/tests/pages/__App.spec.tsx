import '@testing-library/jest-dom/extend-expect';
import { act, render, cleanup, RenderResult } from '@testing-library/react';
import * as React from 'react';

import App from 'src/pages/_app';
import makeStore from 'src/store/config';

afterEach(async () => {
  await act(async () => {
    cleanup();
  });
});

const store = makeStore({}, { asPath: 'test', isServer: false });

jest.mock('src/components/GNB', () => ({
  __esModule: true,
  default: () => <nav>GNB</nav>,
}));

jest.mock('src/components/Footer', () => ({
  __esModule: true,
  default: () => <footer>Footer</footer>,
}));

jest.mock('next-redux-wrapper', () => ({
  __esModule: true,
  default: () => (value) => value,
}));

jest.mock('next-redux-saga', () => ({
  __esModule: true,
  default: (value) => value,
}));

describe('App', () => {
  describe('getInitialProps', () => {
    it('should detect partials', async () => {
      const props = await App.getInitialProps({
        ctx: {
          pathname: '/partials/gnb',
        },
        Component: () => null,
      });
      expect(props.isPartials).toBe(true);
    });

    it('should detect inapp', async () => {
      const props = await App.getInitialProps({
        ctx: {
          pathname: '/inapp/notification',
        },
        Component: () => null,
      });
      expect(props.isInApp).toBe(true);
    });
  });

  it('should render regular pages', async () => {
    const mock = jest.fn().mockReturnValue(<div>mock</div>);
    let renderResult: RenderResult;
    await act(async () => {
      renderResult = render(
        <App
          store={store}
          pageProps={{}}
          query={{}}
          hasError={false}
          Component={mock}
        />
      );
    });
    expect(renderResult.container.innerHTML).not.toMatch(/GLOBAL_STYLE_RESET/);
    expect(renderResult.container).toHaveTextContent(/GNB/);
    expect(renderResult.container).toHaveTextContent(/mock/);
    expect(renderResult.container).toHaveTextContent(/Footer/);
  });

  it('should render inapp', async () => {
    const mock = jest.fn().mockReturnValue(<div>mock</div>);
    let renderResult: RenderResult;
    await act(async () => {
      renderResult = render(
        <App
          store={store}
          pageProps={{}}
          query={{}}
          isInApp
          hasError={false}
          Component={mock}
        />
      );
    });
    expect(renderResult.container.innerHTML).not.toMatch(/GLOBAL_STYLE_RESET/);
    expect(renderResult.container).not.toHaveTextContent(/GNB/);
    expect(renderResult.container).toHaveTextContent(/mock/);
    expect(renderResult.container).not.toHaveTextContent(/Footer/);
  });

  it('should render partials', async () => {
    const mock = jest.fn().mockReturnValue(<div>mock</div>);
    let renderResult: RenderResult;
    await act(async () => {
      renderResult = render(
        <App
          store={store}
          pageProps={{}}
          query={{}}
          isPartials
          hasError={false}
          Component={mock}
        />
      );
    });
    expect(renderResult.container.innerHTML).toMatch(/GLOBAL_STYLE_RESET/);
    expect(renderResult.container).not.toHaveTextContent(/GNB/);
    expect(renderResult.container).toHaveTextContent(/mock/);
    expect(renderResult.container).not.toHaveTextContent(/Footer/);
  });
});
