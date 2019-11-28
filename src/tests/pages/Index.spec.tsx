import * as React from 'react';
import Index from 'src/pages';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../store/config';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from '../../styles';
import { HomeProps } from '../../pages';
import { Router } from 'server/routes';
import { Provider } from 'react-redux';
import { BrowserLocationWithRouter } from 'src/components/Context';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

Router.replaceRoute = jest.fn(() => null);
// @ts-ignore
const mockWriteHead = jest.fn((code, header) => {
  window.history.pushState({}, 'Test', header.Location);
});

const mockRes = {
  writeHead: mockWriteHead,
  end: () => null,
};
const store = makeStore({}, { asPath: 'test', isServer: false });
const mockSomeProps = {
  isServer: true,
  asPath: '',
  store,
  // @ts-ignore
  res: mockRes,
};

const providerWrap = (
  // @ts-ignore
  children,
) => (
  <ThemeProvider theme={defaultTheme}>
    <RouterContext.Provider value={{ asPath: '/bl' }}>
      <Provider store={store}>{children}</Provider>
    </RouterContext.Provider>
  </ThemeProvider>
);

const renderComponent = (props: HomeProps, genre: string) =>
  render(providerWrap(<Index {...props} genre={genre} />));

describe('Home Test', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should be render Home Component', async () => {
    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'general' },
      // @ts-ignore
      req: {
        cookies: {
          main_genre: 'fantasy',
        },
      },
    });

    const { getByText } = renderComponent(props, 'fantasy');
    expect(getByText(/단행본/)).toHaveTextContent('단행본');
  });

  it('should not be call redirect', async () => {
    window.history.pushState({}, 'romance serial', '/romance-serial');
    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'romance' },
      // @ts-ignore
      req: {
        path: '/romance/serial',
        cookies: {
          main_genre: 'romance',
        },
      },
    });
    render(
      providerWrap(
        <RouterContext.Provider value={{ asPath: '' }}>
          <BrowserLocationWithRouter isPartials={false} pathname={'/'}>
            <Index {...props} genre={'romance'} />
          </BrowserLocationWithRouter>
        </RouterContext.Provider>,
      ),
    );
    expect(mockWriteHead).toHaveBeenCalledTimes(0);
  });
});
