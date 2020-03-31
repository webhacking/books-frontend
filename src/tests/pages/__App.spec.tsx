import * as React from 'react';
import App from 'src/pages/_app';
import Index from 'src/components/Meta';
import GNB from 'src/pages/partials/gnb';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../store/config';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { createRouter } from 'next/router';
const router = createRouter('/', { genre: 'general' }, '', {
  subscription: jest.fn(),
  initialProps: {},
  pageLoader: jest.fn(),
  App: jest.fn(),
  Component: jest.fn(),
  isFallback: false,
  wrapApp: jest.fn(),
});

afterEach(cleanup);

const store = makeStore({}, { asPath: 'test', isServer: false });

test('should be render Index Component', async () => {
  const props = await App.getInitialProps({
    // pathname: '/',
    path: '/',
    isServer: false,
    asPath: '/',
    store,
    // router: {
    //   location: { pathname: '/' },
    // },
    ctx: {
      router: {
        location: { pathname: '/' },
      },
      pathname: '/',
      query: { genre: '1', search: 'testKeyword' },
      req: {
        headers: { cookie: ''},
      }
    },
    req: {
      path: '/',
    },
    Component: Index,
  });

  render(
    <RouterContext.Provider value={{ asPath: '', query: { pathname: '/'} }}>
      <App Component={Index} router={{}} {...props} />
    </RouterContext.Provider>,
  );
  // expect(getByText(/general/)).toHaveTextContent('general');
});
test('should be render Partials Component', async () => {
  const props = await App.getInitialProps({
    pathname: '/partials/gnb',
    isServer: false,
    asPath: '/partials/gnb',
    store,
    ctx: {
      router: {
        location: { pathname: '/partials/gnb' },
      },
      pathname: '/partials/gnb',
      query: { search: 'testKeyword', pathname: '/books' },
      req: {
        headers: { cookie: ''},
      }
    },
    req: {
      path: '/',
    },
    Component: GNB,
  });

  const { container } = render(
    <RouterContext.Provider value={{ asPath: '', query: { pathname: '/cart'} }}>
      <App Component={GNB} router={{}} {...props} />
    </RouterContext.Provider>,
  );

  const input = container.getElementsByTagName('input');
  expect(input).not.toBe('null');
});
