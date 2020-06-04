import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import * as BookApi from 'src/types/book';
import sentry from 'src/utils/sentry';

export interface BooksState {
  items: { [key: string]: BookApi.ClientSimpleBook | null };
  isFetching: boolean;
}

export const booksInitialState: BooksState = {
  items: {},
  isFetching: false,
};

export class BooksReducer extends ImmerReducer<BooksState> {
  public insertBookIds(payload: { bIds: string[]; withDesc?: boolean }) {
    try {
      const uniqIds = [...new Set(payload.bIds)];
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

  public setBooks(payload: { items: BookApi.Book[] }) {
    try {
      const books: BooksState['items'] = {};
      payload.items.forEach((book) => {
        if (this.draftState.items[book.id] === null) {
          const simpleBook: any = BookApi.createSimpleBookData(book);
          simpleBook.clientBookFields = {
            isAvailableSelect: false,
            isAlreadyCheckedAtSelect: false,
          };
          books[book.id] = simpleBook;
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

  public setSelectBook(payload: { checkedIds: string[]; isSelectedId: string[] }) {
    // brute force
    // Todo 개선 필요
    try {
      payload.checkedIds.forEach((bId) => {
        const book: BookApi.ClientSimpleBook | null = this.draftState.items[bId];
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
