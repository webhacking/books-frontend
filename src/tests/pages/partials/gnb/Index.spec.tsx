import * as React from 'react';
import Index from 'src/pages/partials/gnb';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../../../store/config';
import { Provider } from 'react-redux';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

afterEach(cleanup);
const store = makeStore(
  { account: { loggedUser: null } },
  { asPath: 'test', isServer: false },
);

test('should be render Index Component', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { type: '1', theme: 'dark', pathname: '/' },
  });

  const { queryByText } = render(
    <Provider store={store}>
      <RouterContext.Provider value={{ asPath: '' }}>
        <Index {...props} />
      </RouterContext.Provider>
    </Provider>,
  );

  expect(queryByText(/리디셀렉트/)).not.toBe(null);
  expect(queryByText(/RIDIBOOKS/)).not.toBe(null);
});
test('should be render with CategoryList', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { type: '1', theme: 'dark', pathname: '/category/list' },
  });

  const { queryByText } = render(
    <Provider store={store}>
      <RouterContext.Provider value={{ asPath: '' }}>
        <Index {...props} />
      </RouterContext.Provider>
    </Provider>,
  );

  expect(queryByText(/리디셀렉트/)).not.toBe(null);
  expect(queryByText(/RIDIBOOKS/)).not.toBe(null);
  expect(queryByText(/일반/)).not.toBe(null);
});
test('should be render event page with nav bar', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { type: '1', theme: 'dark', pathname: '/event/romance' },
  });

  const { queryByText } = render(
    <Provider store={store}>
      <RouterContext.Provider value={{ asPath: '' }}>
        <Index {...props} />
      </RouterContext.Provider>
    </Provider>,
  );

  expect(queryByText(/리디셀렉트/)).not.toBe(null);
  expect(queryByText(/RIDIBOOKS/)).not.toBe(null);
  expect(queryByText(/BL/)).not.toBe(null);
});
