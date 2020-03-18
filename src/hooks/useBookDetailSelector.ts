import { createSelector } from 'reselect';
import { RootState } from 'src/store/config';
import { useSelector } from 'react-redux';
import { BooksState } from 'src/services/books/reducer';
import { BookItem } from 'src/types/sections';

const bookSelector: <T extends BookItem>(a: BooksState['items'], b: T[]) => T[] = createSelector(
  (books) => books,
  <T extends BookItem>(_: unknown, items: T[]) => items,
  <T extends BookItem>(books: BooksState['items'], items: T[]): T[] => items
    .map((item) => ({
      ...item,
      detail: books[item.b_id],
    }))
    .filter((item) => !item.detail?.is_deleted),
);

export const useBookDetailSelector = <T extends BookItem>(bookItems: T[]): [T[], boolean] => {
  const books: T[] = useSelector((state: RootState) => bookSelector(state.books.items, bookItems));

  const isFetching: boolean = useSelector((state: RootState) => state.books.isFetching);
  return [books.filter((book) => book.detail), isFetching];
};
