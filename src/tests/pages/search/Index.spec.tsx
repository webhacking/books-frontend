import * as React from 'react';
import Index from 'src/pages/search';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from 'src/store/config';
afterEach(cleanup);

const store = makeStore({}, { asPath: 'test', isServer: false });

test('should be render Index Component', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { q: '1' },
  });

  const { getByText } = render(<Index {...props} />);

  expect(getByText(/검색 결과/)).toHaveTextContent('1');
});
