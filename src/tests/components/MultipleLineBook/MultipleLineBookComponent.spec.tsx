import * as React from 'react';
import {
  act,
  render,
  cleanup,
  getAllByAltText,
  RenderResult,
  waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import { MultipleLineBooks } from 'src/components/MultipleLineBooks/MultipleLineBooks';
import { defaultTheme } from 'src/styles';
import makeStore from 'src/store/config';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';

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
        '123456789': {
          id: '123456789',
          authors: [{ id: 1, role: 'author', name: 'boo' }],
          title: { main: 'foo' },
          property: { is_somedeal: true, is_adult_only: true },
          file: { is_comic: false },
        },
        '1234567800': {
          id: '1234567800',
          title: { main: 'bar' },
          authors: [{ id: 1, role: 'author', name: 'far' }],
          property: { is_somedeal: false },
          file: { is_comic: true },
        },
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
            title={'이 책 어땨요'}
            genre={'fantasy'}
            slug={'home-fantasy'}
            items={[
              {
                b_id: '123456789',
                detail: {
                  id: '123456789',
                  title: { main: '사랑스러운 책' },
                  authors: [{ name: 'hi' }],
                  property: { is_adult_only: false },
                  file: { is_comic: false },
                },
              },
              {
                b_id: '1234567800',
                detail: null,
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

  it('should be render MultipleLineBookItem', () => {
    const { container } = actRender(renderMultipleLineBookList);
    const itemNode = waitForElement(() => getAllByAltText(container, '사랑스러운 책'));
    expect(itemNode).not.toBe(null);
  });
});
