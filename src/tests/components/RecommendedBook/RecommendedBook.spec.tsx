import * as React from 'react';
import { act, render, cleanup, getAllByAltText, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import {
  RecommendedBook,
  RecommendedBookCarousel,
  RecommendedBookList,
} from 'src/components/RecommendedBook';
import { defaultTheme } from 'src/styles';
import makeStore from 'src/store/config';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';

afterEach(cleanup);
const store = makeStore(
  {
    books: {
      itmes: {
        '12345': null,
      },
      isFetching: false,
    },
  },
  { asPath: 'test', isServer: false },
);

const books = [
  {
    b_id: '12345',
    detail: {
      title: { main: '도서 표지' },
      property: {},
    },
  },
];

function actRender(renderFunction: () => RenderResult) {
  let ret: RenderResult;
  act(() => {
    ret = renderFunction();
  });
  return ret;
}

const renderRecommendedBookWrapper = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <RecommendedBook type={'hot_release'} currentGenre={'general'} items={books} />
        </ViewportIntersectionProvider>
      </Provider>
    </ThemeProvider>,
  );

const renderList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <RecommendedBookList type={'hot_release'} items={books} />
        </ViewportIntersectionProvider>
      </Provider>
    </ThemeProvider>,
  );

const renderCarousel = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <RecommendedBookCarousel type={'hot_release'} items={books} />
        </ViewportIntersectionProvider>
      </Provider>
    </ThemeProvider>,
  );

describe('test recommendedBook wrapper', () => {
  let originalIO: typeof IntersectionObserver;

  // simulate non-IO environment
  beforeAll(() => {
    originalIO = window.IntersectionObserver;
    window.IntersectionObserver = undefined;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIO;
  });

  it('should be render loading item', () => {
    // const { container } = renderRecommendedBookWrapper();
    // const itemNode = getAllByAltText(container, '도서 표지');
    // expect(itemNode).not.toBe(null);
  });

  it('should be render List', () => {
    const { container } = actRender(renderList);
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
  it('should be render RecommendedBookCarousel', () => {
    const { container } = actRender(renderCarousel);
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
});
