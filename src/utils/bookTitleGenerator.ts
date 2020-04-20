import * as BookApi from 'src/types/book';

import sentry from 'src/utils/sentry';

export function computeBookTitle(book: BookApi.BookType): string {
  if (book.from === 'book-api') {
    if (!book) {
      return '';
    }
    if (book.is_deleted) {
      return '';
    }
    try {
      if (book.series) {
        if (book.title.prefix) {
          return `${book.title.prefix} ${book.series.property.title}`;
        }
        return book.series.property.title || book.title.main;
      }
      if (book.title) {
        if (book.title.prefix) {
          return `${book.title.prefix} ${book.title.main}`;
        }
      }
      return book.title.main;
    } catch (error) {
      sentry.captureException(error);
      return book.title.main;
    }
  } else if (book.from === 'search-api') {
    if (book.highlight.web_title_title) {
      return book.highlight.web_title_title;
    }
    return book.web_title_title;
  }
  return '';
}
