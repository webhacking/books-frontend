import * as BookApi from 'src/types/book';
import { getEscapedString } from 'src/utils/highlight';

export const bookTitleGenerator = (book: BookApi.Book) => {
  if (!book) {
    return '';
  }
  if (book.series) {
    if (book.title.prefix) {
      return getEscapedString(`${book.title.prefix} ${book.series.property.title}`);
    }
    return getEscapedString(book.series.property.title);
  }
  if (book.title) {
    if (book.title.prefix) {
      return getEscapedString(`${book.title.prefix} ${book.title.main}`);
    }
  }
  return getEscapedString(book.title.main);
};
