import * as React from 'react';
import Index from 'src/pages';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import makeStore from '../../store/config';
jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));

afterEach(cleanup);

const store = makeStore({}, { asPath: 'test', isServer: false });

test('should be render Index Component', async () => {
  const props = await Index.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { genre: '1' },
  });

  const { getByText } = render(<Index {...props} />);

  expect(getByText(/Home/)).toHaveTextContent('Home');
});
