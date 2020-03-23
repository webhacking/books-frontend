import axios from 'axios';
import * as React from 'react';
import Index from 'src/pages/[genre]';
import { act, render, RenderResult, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from '../../store/config';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from '../../styles';
import { Provider } from 'react-redux';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import fantasyFixture from './home-fantasy-fixture.json';
import blFixture from './home-bl-fixture.json';
import { ViewportIntersectionProvider } from '../../hooks/useViewportIntersection';
import { createRouter } from 'next/router';

const mockRes = {
  writeHead: () => null,
  end: () => null,
};

const router = createRouter('/', { genre: 'general' }, '', {
  subscription: jest.fn(),
  initialProps: {},
  pageLoader: jest.fn(),
  App: jest.fn(),
  Component: jest.fn(),
  isFallback: false,
  wrapApp: jest.fn(),
});

const store = makeStore(
  {
    router: {},
    books: {
      isFetching: false,
      items: {
        '102087083': {
          id: '102087083',
          property: {
            is_somedeal: false,
          },
          file: {
            is_comic: false,
          },
          authors: [],
          title: { main: '판타지 도서 타이틀' },
        },
        '111020494': {
          id: '102087083',
          property: {
            is_somedeal: false,
          },
          file: {
            is_comic: false,
          },
          authors: [],
          title: { main: 'Bl 도서 Title1' },
        },
        '777035894': {
          id: '777035894',
          property: {
            is_somedeal: false,
          },
          file: {
            is_comic: false,
          },
          authors: [],
          title: { main: 'Bl 도서 Title2' },
        },
      },
    },
  },
  { asPath: '/', isServer: false },
);
const mockSomeProps = {
  isServer: true,
  asPath: '',
  store,
  res: mockRes,
};

function actRender(renderFunction: () => RenderResult) {
  let ret: RenderResult;
  act(() => {
    ret = renderFunction();
  });
  return ret;
}

const renderComponent = ({ props }): RenderResult => {
  let component;
  component = render(
    <ThemeProvider theme={defaultTheme}>
      <RouterContext.Provider value={router}>
        <Provider store={store}>
          <ViewportIntersectionProvider>
            <Index {...props} />
          </ViewportIntersectionProvider>
        </Provider>
      </RouterContext.Provider>
    </ThemeProvider>,
  );

  return component;
};

describe('Genre Home Test', () => {
  it('should be render Home Component (Empty Branches)', async () => {
    const handler = jest.fn().mockReturnValue({
      data: {
        slug: 'home-fantasy',
        type: 'Page',
        title: '판타지 홈',
        branches: [],
      },
    });
    (axios as any).__setHandler(handler);

    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'fantasy' },
      req: {
        cookies: {
          main_genre: 'fantasy',
        },
      },
    });
    expect(handler).toBeCalledTimes(1);
    expect(handler.mock.calls[0][0]).toEqual('get');
    expect(handler.mock.calls[0][1]).toEqual('/pages/home-fantasy/');
  });

  it('should be render Home Component (Server Side Data)', async () => {
    const handler = jest.fn().mockReturnValue({
      data: {
        slug: 'home-fantasy',
        type: 'Page',
        title: '판타지 홈',
        branches: fantasyFixture.branches,
      },
    });
    (axios as any).__setHandler(handler);

    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'fantasy' },
      req: {
        cookies: {
          main_genre: 'fantasy',
        },
      },
    });
    expect(handler).toBeCalledTimes(3);
    expect(handler.mock.calls[0][0]).toEqual('get');
    expect(handler.mock.calls[0][1]).toEqual('/pages/home-fantasy/');

    const { getAllByText } = actRender(() => renderComponent({ props }));
    expect(getAllByText(/판타지 도서 타이/)[0]).not.toBeNull();
  });

  it('should be render Home Component (Client Branches)', async () => {
    const handler = jest.fn().mockReturnValue({
      data: {
        slug: 'home-bl',
        type: 'Page',
        title: 'BL 홈',
        branches: blFixture.branches,
      },
    });
    (axios as any).__setHandler(handler);

    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'bl' },
      genre: 'bl',
      isServer: false,
      req: {
        cookies: {
          main_genre: 'bl',
        },
      },
    });
    const { getAllByAltText, container } = renderComponent({ ...props, genre: 'bl' });
    expect(handler).toBeCalledTimes(1);

    const renderer = await waitForElement(() => getAllByAltText(/\[소설\] 리뷰 전원/), {
      timeout: 2000,
      container,
    });
    expect(renderer[0]).not.toBe(null);
  });
});
