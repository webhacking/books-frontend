import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import * as BookApi from 'src/types/book';

export interface BooksState {
  items: { [key: string]: BookApi.Book | null };
  isFetching: boolean;
}

export const booksInitialState: BooksState = {
  items: {},
  isFetching: false,
};

export class BooksReducer extends ImmerReducer<BooksState> {
  public insertBookIds(payload: string[]) {
    const uniqIds = [...new Set(payload)];
    const books: BooksState['items'] = {};
    uniqIds.forEach((item: string) => {
      if (!this.draftState.items[item]) {
        books[item] = null;
      }
    });
    this.draftState.isFetching = true;
    this.draftState.items = { ...this.draftState.items, ...books };
  }

  public setBooks(payload: BookApi.Book[]) {
    const books: BooksState['items'] = {};
    payload.forEach(book => {
      if (this.draftState.items[book.id] === null) {
        books[book.id] = book;
      }
    });
    this.draftState.items = { ...this.draftState.items, ...books };
  }

  // 시리즈 도서 썸네일 확인 및 지정
  // https://rididev.slack.com/archives/CE55MTQH2/p1574134223004000
  // is_serial_complete 는 바라보지 않아도 됨
  // Todo series 만 따로 reducer 를 작성할지 고민해보기
  public setThumbnailId() {
    const seriesBooks: BooksState['items'] = {};
    Object.keys(this.draftState.items).forEach(bid => {
      if (this.draftState.items[bid] && this.draftState.items[bid].series) {
        seriesBooks[bid] = this.draftState.items[bid];
        if (!this.draftState.items[bid].series.property.is_completed) {
          seriesBooks[bid].thumbnailId =
            seriesBooks[bid].series.property.opened_last_volume_id;
        }
      }
    });
    this.draftState.items = {
      ...this.draftState.items,
      ...seriesBooks,
    };
  }

  public setSelectBook(payload: string[]) {
    payload.forEach(bId => {
      if (this.draftState.items[bId]) {
        this.draftState.items[bId].isAvailableSelect = true;
      }
    });
  }

  public setFetching(payload: boolean) {
    this.draftState.isFetching = payload;
  }
}

export const booksReducer = createReducerFunction(BooksReducer, booksInitialState);
export const booksActions = createActionCreators(BooksReducer);
