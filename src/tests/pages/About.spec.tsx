import * as React from 'react';
import About from 'src/pages/about';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../store/config';
import { Provider } from 'react-redux';
jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));

afterEach(cleanup);

const store = makeStore({}, { asPath: 'test', isServer: false });

test('should be render Index Component', async () => {
  const props = await About.getInitialProps({
    pathname: '',
    isServer: false,
    asPath: '',
    store,
    query: { id: '1' },
  });

  const { getByText } = render(
    <Provider store={store}>
      <About {...props} id={'12345'} />
    </Provider>,
  );

  // const img = getByAltText('도서 표지');
  // expect(img.attributes.getNamedItem('src')).toContainEqual('src');
  expect(getByText(/Home/)).toHaveTextContent('Home');
});
