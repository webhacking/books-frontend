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
import makeStore from 'src/store/config';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';
import { AuthorRole } from 'src/types/book';

afterEach(cleanup);
const store = makeStore(
  {
    account: {
      loggedUser: null,
    },
    router: undefined,
    categories: {
      items: {},
      isFetching: false,
    },
    notifications: {
      items: [],
      hasNotification: false,
      unreadCount: 0,
      isLoaded: true,
    },
    books: {
      items: {
        '2414000748': {
          id: '2414000748',
          title: { main: '조선비즈k 기자일일보고(18.12.31)' },
          thumbnail: {
            small: 'https://img.ridicdn.net/cover/2414000748/small',
            large: '',
            xxlarge: '',
          },
          categories: [
            {
              id: 210,
              name: '경영일반',
              genre: 'general',
              sub_genre: 'general',
              is_series_category: false,
            },
          ],
          price_info: { buy: { regular_price: 500, price: 500, discount_percentage: 0 } },
          series: {
            id: '2414000055',
            volume: 483,
            property: {
              is_comic_hd: false,
              is_completed: false,
              is_serial: true,
              is_serial_complete: true,
              is_wait_free: false,
              opened_book_count: 5,
              opened_last_volume_id: '1',
              prev_books: [],
              next_books: [],
              last_volume_id: '1',
              total_book_count: 1,
              unit: null,
            },
            price_info: {
              buy: {
                regular_price: 1,
                discount_percentage: 1,
                free_book_count: 1,
                price: 1,
                total_book_count: 1,
              },
            },
          },
          authors: [{ name: '조선비즈', role: AuthorRole.AUTHOR, id: 1 }],
          file: {
            size: 232,
            format: 'epub',
            is_drm_free: false,
            is_comic: false,
            is_webtoon: false,
            is_manga: false,
            is_comic_hd: false,
            character_count: 5000,
            page_count: 200,
          },
          property: {
            is_novel: false,
            is_magazine: false,
            is_adult_only: false,
            is_new_book: false,
            is_open: false,
            is_somedeal: true,
            is_trial: false,
            review_display_id: '20',
            preview_rate: 1,
          },
          support: {
            android: true,
            ios: true,
            mac: true,
            paper: true,
            windows: true,
            web_viewer: false,
          },
          publish: {
            ridibooks_register: '2018-12-28T17:13:50+09:00',
            ebook_publish: '2018-12-28T00:00:00+09:00',
          },
          publisher: { id: 2414, name: '조선비즈', cp_name: '(주)조선경제아이_E/P' },
          last_modified: '2019-04-10T14:38:18+09:00',
          clientBookFields: null,
        },
        '2414000749': null,
      },

      isFetching: false,
    },
  },
  { asPath: 'test', isServer: false },
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
