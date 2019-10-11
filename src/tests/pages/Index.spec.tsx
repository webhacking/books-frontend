import * as React from 'react';
import Index from 'src/pages';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../store/config';
import { Genre, GenreSubService } from '../../constants/genres';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from '../../styles';
import { HomeProps } from '../../pages';
import { Router } from 'server/routes';
import { Provider } from 'react-redux';

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
    <Provider store={store}>{children}</Provider>
  </ThemeProvider>
);

const renderComponent = (
  props: HomeProps,
  genre?: keyof typeof Genre,
  service?: keyof typeof GenreSubService,
) =>
  render(
    providerWrap(
      <Index {...props} genre={genre || 'GENERAL'} service={service || 'SINGLE'} />,
    ),
  );

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
      query: { genre: Genre.FANTASY, service: GenreSubService.SINGLE },
      // @ts-ignore
      req: {
        cookies: {
          recentlyVisitedGenre: 'fantasy',
        },
      },
    });

    const { getByText } = renderComponent(props, 'FANTASY', 'SINGLE');
    expect(getByText(/단행본/)).toHaveTextContent('단행본');
  });
  it('should be redirection visited genre and service page', async () => {
    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: undefined, service: undefined },
      // @ts-ignore
      req: {
        path: '/',
        cookies: {
          recentlyVisitedGenre: 'fantasy',
          recentlyVisitedGenre_fantasy_Service: 'serial',
        },
      },
    });

    const node = renderComponent(props, 'GENERAL', undefined);
    expect(node.container).not.toBe(null);
    expect(mockWriteHead).toHaveBeenCalled();
  });

  it('should not be call redirect', async () => {
    window.history.pushState({}, 'romance serial', '/romance/serial');
    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'romance', service: undefined },
      // @ts-ignore
      req: {
        path: '/romance/serial',
        cookies: {
          recentlyVisitedGenre: 'romance',
          recentlyVisitedGenre_romance_Service: 'serial',
        },
      },
    });
    render(providerWrap(<Index {...props} genre={'romance'} service={'serial'} />));
    expect(mockWriteHead).toHaveBeenCalledTimes(0);
  });

  it('should be call replaceRoute by location change', async () => {
    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'romance', service: undefined },
      // @ts-ignore
      req: {
        path: '/romance/serial',
        cookies: {
          recentlyVisitedGenre: 'romance',
          recentlyVisitedGenre_romance_Service: 'serial',
        },
      },
    });
    const { rerender } = render(
      providerWrap(<Index {...props} genre={'romance'} service={'serial'} />),
    );
    // Client Side 페이지 이동
    window.history.pushState({}, 'Test', '/general');
    rerender(providerWrap(<Index {...props} genre={'romance'} service={''} />));
    // Client Side 페이지 이동
    window.history.pushState({}, 'Test', '/fantasy');
    rerender(providerWrap(<Index {...props} genre={'fantasy'} service={''} />));

    // Client Side 페이지 이동
    window.history.pushState({}, 'Test', '/');
    rerender(providerWrap(<Index {...props} genre={'general'} service={''} />));

    expect(Router.replaceRoute).toHaveBeenCalledTimes(2);
  });

  it('should be redirect fall backs (bl_serial)', async () => {
    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'bl_serial', service: undefined },
      // @ts-ignore
      req: {
        path: '/bl_serial',
        cookies: {},
      },
    });
    render(providerWrap(<Index {...props} genre={'bl'} service={'serial'} />));

    expect(mockWriteHead).toHaveBeenCalledTimes(1);
  });
  it('should be redirect fall backs (romance_serial)', async () => {
    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'romance_serial', service: undefined },
      // @ts-ignore
      req: {
        path: '/romance_serial',
        cookies: {},
      },
    });
    render(providerWrap(<Index {...props} genre={'romance'} service={'serial'} />));

    expect(mockWriteHead).toHaveBeenCalledTimes(1);
  });
  it('should be redirect fall backs (fantasy_serial)', async () => {
    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'fantasy_serial', service: undefined },
      // @ts-ignore
      req: {
        path: '/fantasy_serial',
        cookies: {},
      },
    });
    render(providerWrap(<Index {...props} genre={'fantasy'} service={'serial'} />));
    expect(mockWriteHead).toHaveBeenCalledTimes(1);
  });
});
