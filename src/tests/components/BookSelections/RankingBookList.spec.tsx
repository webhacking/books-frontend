import * as React from 'react';
import RankingBookList from 'src/components/BookSections/RankingBook/RankingBookList';
import { render, cleanup, getAllByAltText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import { Provider } from 'react-redux';
import fixture from './rankingbook.fixture.json';
import makeStore from 'src/store/config';

afterEach(cleanup);
const store = makeStore(
  {
    books: {
      items: {
        '3306000063': {
          id: '3306000063',
          title: {
            main: '나는 책 입니다',
          },
          property: {
            is_adult_only: true,
            is_somedeal: true,
            is_novel: false,

          },
          file: {
            is_comic: true,
            is_comic_hd: true,
          },
          authors: [{name: 'Ridi', id: '1', role: 'author'}]
        },
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
        <RankingBookList
          {...fixture}
          genre={'fantasy'}
          showTimer={true}
        />
      </Provider>
    </ThemeProvider>,
  );

describe('test SelectionBookContainer', () => {
  it('should be render SelectionBookList item', () => {
    const { container } = renderSelectionBookList();
    const itemNode = getAllByAltText(container, '나는 책 입니다');
    expect(itemNode).not.toBe(null);
  });
});
