import { createSelector } from 'reselect';
import { RootState } from 'src/store/config';
import { useSelector } from 'react-redux';
import { BooksState } from 'src/services/books/reducer';
import { BookItem } from 'src/types/sections';

const bookSelector = createSelector(
  (books: BooksState['items']) => books,
  (_: any, items: BookItem[]) => items,
  (books, items) =>
    items
      .map(item => ({
        ...item,
        detail: books[item.b_id],
      }))
      .filter(item => !item.detail?.is_deleted),
);

export const useBookDetailSelector = (bookItems: BookItem[]): [BookItem[], boolean] => {
  const books: BookItem[] = useSelector((state: RootState) =>
    bookSelector(state.books.items, bookItems),
  );

  const isFetching: boolean = useSelector((state: RootState) => state.books.isFetching);
  return [books.filter(book => book.detail), isFetching];
};
