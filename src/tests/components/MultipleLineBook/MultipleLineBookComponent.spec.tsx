import * as React from 'react';
import {
  act,
  render,
  cleanup,
  RenderResult,
  getByAltText,
  waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import { MultipleLineBooks } from 'src/components/MultipleLineBooks/MultipleLineBooks';
import { defaultTheme } from 'src/styles';
import makeStore from '../../utils/makeStore';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';

afterEach(cleanup);
const store = makeStore(
  {
    categories: {
      items: {},
      isFetching: false,
    },
    books: {
      items: {
        '2414000748': {
          id: '2414000748',
          thumbnailId: '2414000748',
          title: '조선비즈k 기자일일보고(18.12.31)',
          categories: [
            {
              id: 210,
              name: '경영일반',
              genre: 'general',
              sub_genre: 'general',
              is_series_category: false,
            },
          ],
          price: { buy: { regular_price: 500, price: 500, discount_percentage: 0 } },
          series: {
            isSerial: true,
            isComplete: false,
            totalBookCount: 1,
            freeBookCount: 1,
            price: {
              buy: {
                regular_price: 1,
                discount_percentage: 1,
                free_book_count: 1,
                price: 1,
                total_book_count: 1,
              },
            },
          },
          authors: [{ name: '조선비즈', role: 'author', id: 1 }],
          isAdultOnly: false,
          isSomedeal: true,
          isTrial: false,
          isComic: false,
          isNovel: false,
          publisher: { id: 2414, name: '조선비즈' },
          clientBookFields: null,
        },
        '2414000749': null,
      },

      isFetching: false,
    },
  },
);
const renderMultipleLineBookList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <MultipleLineBooks
            title={'이 책 어때요'}
            genre={'fantasy'}
            slug={'home-fantasy'}
            items={[
              {
                b_id: '2414000748',
                type: 'book',
                rating: {
                  total_rating_count: 0,
                  buyer_rating_count: 0,
                  buyer_rating_score: 0,
                },
              },
              {
                b_id: '2414000749',
                type: 'book',
                rating: {
                  total_rating_count: 0,
                  buyer_rating_count: 0,
                  buyer_rating_score: 0,
                },
              },
            ]}
          />
        </ViewportIntersectionProvider>
      </Provider>
    </ThemeProvider>,
  );

function actRender(renderFunction: () => RenderResult) {
  let ret: RenderResult;
  act(() => {
    ret = renderFunction();
  });
  return ret;
}

describe('test MultipleLineBookComponent', () => {
  let originalIO: typeof IntersectionObserver;

  // simulate non-IO environment
  beforeAll(() => {
    originalIO = window.IntersectionObserver;
    window.IntersectionObserver = undefined;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIO;
  });

  it('should be render MultipleLineBookItem', async () => {
    const { container } = actRender(renderMultipleLineBookList);
    const totalItem = container.querySelectorAll('li');
    const availableItem = await waitForElement(() =>
      getByAltText(container, '조선비즈k 기자일일보고(18.12.31)'),
    );

    expect(availableItem).not.toBe(null);
    expect(totalItem.length).toBe(1); // detail null 이면 표시하지 않음
  });
});
