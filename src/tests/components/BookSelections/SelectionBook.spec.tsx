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
import SelectionBookList from 'src/components/BookSections/SelectionBook/SelectionBookList';
import { defaultTheme } from 'src/styles';
import makeStore from '../../utils/makeStore';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';

afterEach(cleanup);
const store = makeStore(
  {
    books: {
      items: {
        '12345666': {
          id: '12345666',
          title: '도서 표지',
          isAdultOnly: false,
          isComic: false,
          authors: [{ name: 'hi' }],
          categories: [{ genre: 'general' }],
        },
      },
      isFetching: false,
    },
  },
);
const renderSelectionBookList = (aiRecommendation: boolean) =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <SelectionBookList
            type={aiRecommendation ? 'AiRecommendation' : 'HomeMdSelection'}
            items={[
              { b_id: '12345666', type: 'test' },
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

describe('test SelectionBookContainer', () => {
  let originalIO: typeof IntersectionObserver;

  // simulate non-IO environment
  beforeAll(() => {
    originalIO = window.IntersectionObserver;
    window.IntersectionObserver = undefined;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIO;
  });

  it('should be render SelectionBookList item', async () => {
    const { container } = actRender(() => renderSelectionBookList(false));
    const item = await waitForElement(() => getAllByAltText(container, '도서 표지'));
    expect(item).not.toBe(null);
  });
});
