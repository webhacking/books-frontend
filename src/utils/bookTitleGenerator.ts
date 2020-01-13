import * as BookApi from 'src/types/book';
import { getEscapedString } from 'src/utils/highlight';

import sentry from 'src/utils/sentry';

const { captureException } = sentry();
export const bookTitleGenerator = (book: BookApi.Book) => {
  try {
    if (!book) {
      return '';
    }
    if (book.is_deleted) {
      return '';
    }
    if (book.series) {
      if (book.title.prefix) {
        return getEscapedString(`${book.title.prefix} ${book.series.property.title}`);
      }
      return getEscapedString(book.series.property.title || book.title.main);
    }
    if (book.title) {
      if (book.title.prefix) {
        return getEscapedString(`${book.title.prefix} ${book.title.main}`);
      }
    }
    return getEscapedString(book.title.main);
  } catch (error) {
    captureException(error);
    console.log(book);
    return book.title.main;
  }
};
