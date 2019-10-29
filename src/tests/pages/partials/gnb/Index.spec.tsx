import * as React from 'react';
import Index from 'src/pages/partials/gnb';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../../../store/config';
import { Provider } from 'react-redux';
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
    query: { type: '1', theme: 'dark' },
  });

  const { getByText } = render(
    <Provider store={store}>
      <Index {...props} />
    </Provider>,
  );

  expect(getByText(/리디셀렉트/)).toHaveTextContent('리디셀렉트');
  expect(getByText(/RIDIBOOKS/)).toHaveTextContent('RIDIBOOKS');
});
