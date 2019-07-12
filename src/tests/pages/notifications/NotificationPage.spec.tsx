import * as React from 'react';
import Index from 'src/pages/notification';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
// import makeStore from 'src/store/config';
// const store = makeStore({}, { asPath: 'test', isServer: false });
jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));
afterEach(cleanup);

test('should be render Index Component', async () => {
  // @ts-ignore
  const props = await Index.getInitialProps({
    pathname: '',
    asPath: '',
    // store,
    query: { theme: 'dark' },
  });

  const { getByText } = render(<Index {...props} />);

  expect(getByText(/알림/)).toHaveTextContent('알림');
});
