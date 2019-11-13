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
