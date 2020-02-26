import axios from 'axios';
import * as React from 'react';
import Index from 'src/components/Meta';
import { act, render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../store/config';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from '../../styles';
import { HomeProps } from '../../components/Meta';
import Router from 'next/router'
import { Provider } from 'react-redux';
import { BrowserLocationWithRouter } from 'src/components/Context';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

Router.replace = jest.fn(() => null);
// @ts-ignore
const mockWriteHead = jest.fn((code, header) => {
  window.history.pushState({}, 'Test', header.Location);
});

const mockRes = {
  writeHead: mockWriteHead,
  end: () => null,
};
const store = makeStore({}, { asPath: 'test', isServer: false });
const mockSomeProps = {
  isServer: true,
  asPath: '',
  store,
  // @ts-ignore
  res: mockRes,
};

interface RenderOptions {
  props: HomeProps;
  isPartials?: boolean;
}

const renderComponent = async ({ props, isPartials = false }: RenderOptions) => {
  let component;
  await act(async () => {
    component = render(
      <ThemeProvider theme={defaultTheme}>
        <RouterContext.Provider value={{ asPath: '/', query: { pathname: '/'} }}>
          <Provider store={store}>
            <Index {...props} />
          </Provider>
        </RouterContext.Provider>
      </ThemeProvider>,
    );
  });
  return component;
};

describe('Home Test', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should be render Home Component', async () => {
    const handler = jest.fn().mockReturnValue({
      data: {
        slug: 'home-fantasy',
        type: 'Page',
        title: '판타지 홈',
        branches: [],
      },
    });
    (axios as any).__setHandler(handler);

    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'fantasy' },
      req: {
        cookies: {
          main_genre: 'fantasy',
        },
      },
    });
    expect(handler).toBeCalledTimes(1);
    expect(handler.mock.calls[0][0]).toEqual('get');
    expect(new URL(handler.mock.calls[0][1])).toHaveProperty(
      'pathname',
      '/pages/home-fantasy/',
    );

    const { queryByText } = await renderComponent({ props, isPartials: false });
    expect(queryByText(/단행본/)).not.toBeNull();
  });

  it('should not be call redirect', async () => {
    const handler = jest.fn().mockReturnValue({
      data: {
        slug: 'home-romance',
        type: 'Page',
        title: '로맨스 홈',
        branches: [],
      },
    });
    (axios as any).__setHandler(handler);

    window.history.pushState({}, 'romance serial', '/romance-serial');
    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'romance' },
      req: {
        path: '/romance/serial',
        cookies: {
          main_genre: 'romance',
        },
      },
    });
    await renderComponent({ props, isPartials: false });
    expect(mockWriteHead).toHaveBeenCalledTimes(0);
  });
});
