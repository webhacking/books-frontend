import { createSimpleBookData } from 'src/types/book';

import books from './books.fixture.json';

describe('createSimpleBookData', () => {
  it.each(books)('should convert books', (book) => {
    expect(createSimpleBookData(book)).toMatchSnapshot({}, `bId ${book.id}`);
  });
});
