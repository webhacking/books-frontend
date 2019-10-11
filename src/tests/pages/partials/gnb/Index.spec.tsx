import * as React from 'react';
import Index from 'src/pages/partials/gnb';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../../../store/config';
afterEach(cleanup);
const store = makeStore({}, { asPath: 'test', isServer: false });

test('should be render Index Component', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { type: '1', theme: 'dark' },
  });

  const { getByText } = render(<Index {...props} />);

  expect(getByText(/리디셀렉트/)).toHaveTextContent('리디셀렉트');
  expect(getByText(/RIDIBOOKS/)).toHaveTextContent('RIDIBOOKS');
});
