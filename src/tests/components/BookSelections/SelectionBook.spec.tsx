import * as React from 'react';
import SelectionBookList from 'src/components/BookSections/SelectionBook/SelectionBookList';
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
const renderSelectionBookList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <SelectionBookList
          isAIRecommendation={false}
          items={[
            {
              b_id: '12345666',
              type: 'test',
              detail: {
                title: { main: 'hey' },
                authors_ordered: [{ name: 'hi' }],
                property: { is_adult_only: false },
                file: { is_comic: false },
              },
            },
          ]}
        />
      </Provider>
    </ThemeProvider>,
  );

describe('test SelectionBookContainer', () => {
  it('should be render SelectionBookList item', () => {
    const { container } = renderSelectionBookList();
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
});
