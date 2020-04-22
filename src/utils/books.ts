import * as BookApi from 'src/types/book';

/* 미완결 된 Series 도서중 공개(opened) 된 마지막 회차의 표지 ID를 위한 함수 */
export function getThumbnailBidFromBookApi(bookId: string, book: BookApi.Book | null) {
  if (!book) {
    return bookId;
  }
  if (book.series) {
    if (
      !book.series.property.is_completed && book.series.property.opened_last_volume_id.length !== 0
    ) {
      return book.series.property.opened_last_volume_id;
    }
  }
  return book.id;
}
