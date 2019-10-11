import * as React from 'react';
import Index from 'src/pages/partials/footer';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../../../store/config';
const store = makeStore({}, { asPath: 'test', isServer: false });

afterEach(cleanup);

test('should be render Index Component', async () => {
  // @ts-ignore
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { theme: 'dark' },
  });

  const { getByText } = render(<Index {...props} />);

  expect(getByText(/고객센터/)).toHaveTextContent('고객센터');
});
