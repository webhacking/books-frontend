import * as BookApi from 'src/types/book';

export const bookTitleGenerator = (book: BookApi.Book) => {
  if (book.series) {
    return book.series.property.title;
  }
  if (book.title) {
    if (book.title.prefix) {
      return `${book.title.prefix} ${book.title.main}`;
    }
  }
  return book.title.main;
};
