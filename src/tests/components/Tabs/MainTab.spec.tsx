import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import { MainTab } from 'src/components/Tabs';
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import makeStore from 'src/store/config';
import { defaultTheme } from 'src/styles';
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

const store = makeStore({}, { asPath: 'test', isServer: false });
afterEach(cleanup);

const renderComponent = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <RouterContext.Provider value={{ asPath: '' , query: { pathname: '/'}}}>
        <Provider store={store}>
          <MainTab />
        </Provider>
      </RouterContext.Provider>
    </ThemeProvider>,
  );

describe('MainTab test', () => {
  it('should be render MainTab component', () => {
    const { container } = renderComponent();
    expect(container).not.toBe(null);
  });
});
