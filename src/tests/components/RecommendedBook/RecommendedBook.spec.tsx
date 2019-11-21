import * as React from 'react';
import {
  RecommendedBook,
  RecommendedBookCarousel,
  RecommendedBookList,
} from 'src/components/RecommendedBook';
import { render, cleanup, getAllByAltText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import { Provider } from 'react-redux';
import makeStore from 'src/store/config';

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
      title: { main: '와' },
    },
  },
];

const renderRecommendedBookWrapper = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <RecommendedBook type={'hot_release'} currentGenre={'general'} items={books} />
      </Provider>
    </ThemeProvider>,
  );

const renderList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <RecommendedBookList type={'hot_release'} items={books} />
      </Provider>
    </ThemeProvider>,
  );

const renderCarousel = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <RecommendedBookCarousel type={'hot_release'} items={books} />
      </Provider>
    </ThemeProvider>,
  );

describe('test recommendedBook wrapper', () => {
  it('should be render loading item', () => {
    // const { container } = renderRecommendedBookWrapper();
    // const itemNode = getAllByAltText(container, '도서 표지');
    // expect(itemNode).not.toBe(null);
  });

  it('should be render List', () => {
    const { container } = renderList();
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
  it('should be render RecommendedBookCarousel', async () => {
    const { container } = renderCarousel();
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
});
