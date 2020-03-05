import * as React from 'react';
import { act, render, cleanup, getAllByAltText, RenderResult, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import SelectionBookList from 'src/components/BookSections/SelectionBook/SelectionBookList';
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
const renderSelectionBookList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <ViewportIntersectionProvider>
          <SelectionBookList
            isAIRecommendation={false}
            items={[
              {
                b_id: '12345666',
                type: 'test',
                detail: {
                  title: { main: '도서 표지' },
                  authors: [{ name: 'hi' }],
                  property: { is_adult_only: false },
                  file: { is_comic: false },
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
    const { container } = actRender(renderSelectionBookList);
    const item = await waitForElement(() => getAllByAltText(container, '도서 표지'));
    expect(item).not.toBe(null);
  });
});
