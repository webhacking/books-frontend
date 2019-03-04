import * as React from 'react';
import About from 'src/pages/about';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import makeStore from '../../store/config';
import { Provider } from 'react-redux';
jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));

afterEach(cleanup);

const store = makeStore({}, { asPath: 'test', isServer: false });

test('should be render Index Component', () => {
  const { getByText } = render(
    <Provider store={store}>
      <About id={'12345'} />
    </Provider>,
  );

  // const img = getByAltText('도서 표지');
  // expect(img.attributes.getNamedItem('src')).toContainEqual('src');
  expect(getByText(/Home/)).toHaveTextContent('Home');
});
