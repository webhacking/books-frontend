import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import * as BookApi from 'src/types/book';
import sentry from 'src/utils/sentry';

export interface BooksState {
  items: { [key: string]: BookApi.ClientBook | null };
  isFetching: boolean;
}

export const booksInitialState: BooksState = {
  items: {},
  isFetching: false,
};

export class BooksReducer extends ImmerReducer<BooksState> {
  public insertBookIds(payload: string[]) {
    try {
      const uniqIds = [...new Set(payload)];
      const books: BooksState['items'] = {};
      uniqIds.forEach((item: string) => {
        if (!this.draftState.items[item]) {
          books[item] = null;
        }
      });
      this.draftState.isFetching = true;
      this.draftState.items = { ...this.draftState.items, ...books };
    } catch (error) {
      sentry.captureException(error);
    }
  }

  public setBooks(payload: BookApi.ClientBook[]) {
    try {
      const books: BooksState['items'] = {};
      payload.forEach((book) => {
        if (this.draftState.items[book.id] === null) {
          book.clientBookFields = {
            isAlreadyCheckedAtSelect: false,
            isAvailableSelect: false,
          };
          books[book.id] = book;
        }
      });
      this.draftState.items = { ...this.draftState.items, ...books };
    } catch (error) {
      sentry.captureException(error);
    }
  }

  public setDesc(payload: BookApi.BookDescResponse[]) {
    payload.forEach((desc) => {
      const book = this.draftState.items[desc.b_id];
      if (book) {
        book.clientBookFields.desc = desc.descriptions;
      }
    });
  }

  // 시리즈 도서 썸네일 확인 및 지정
  // https://rididev.slack.com/archives/CE55MTQH2/p1574134223004000
  // is_serial_complete 는 바라보지 않아도 됨
  // Todo series 만 따로 reducer 를 작성할지 고민해보기
  public setThumbnailId() {
    const seriesBooks: BooksState['items'] = {};
    Object.keys(this.draftState.items).forEach((bid) => {
      if (this.draftState.items[bid] && this.draftState.items[bid]?.series) {
        seriesBooks[bid] = this.draftState.items[bid];
        if (!this.draftState.items[bid]?.series?.property.is_completed) {
          // @ts-ignore
          seriesBooks[bid].thumbnailId = seriesBooks[bid]?.series?.property.opened_last_volume_id.length === 0
            ? bid
            : seriesBooks[bid]?.series?.property.opened_last_volume_id;
        }
      }
    });
    this.draftState.items = {
      ...this.draftState.items,
      ...seriesBooks,
    };
  }

  public setSelectBook(payload: { checkedIds: string[]; isSelectedId: string[] }) {
    // brute force
    // Todo 개선 필요
    try {
      payload.checkedIds.forEach((bId) => {
        const book: BookApi.ClientBook | null = this.draftState.items[bId];
        if (book) {
          book.clientBookFields = {
            isAvailableSelect: payload.isSelectedId.includes(bId),
            isAlreadyCheckedAtSelect: true,
          };
        }
      });
    } catch (error) {
      sentry.captureException(error);
    }
  }

  public checkSelectBook() {}

  public setFetching(payload: boolean) {
    this.draftState.isFetching = payload;
  }
}

export const booksReducer = createReducerFunction(BooksReducer, booksInitialState);
export const booksActions = createActionCreators(BooksReducer);
