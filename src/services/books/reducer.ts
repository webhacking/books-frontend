import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import * as BookApi from 'src/types/book';

export interface BooksState {
  items: { [key: string]: BookApi.SimpleBook | null };
  isAvailableSelect: { [key: string]: boolean };
  desc: { [key: string]: BookApi.BookDesc };
}

export const booksInitialState: BooksState = {
  items: {},
  isAvailableSelect: {},
  desc: {},
};

export class BooksReducer extends ImmerReducer<BooksState> {
  public insertBookIds(payload: { bIds: string[]; withDesc?: boolean }) {
    const uniqIds = [...new Set(payload.bIds)];
    uniqIds.forEach((item) => {
      if (!this.draftState.items[item]) {
        this.draftState.items[item] = null;
      }
    });
  }

  public setBooks(payload: { items: BookApi.Book[] }) {
    payload.items.forEach((book) => {
      const { id } = book;
      if (this.draftState.items[id] == null) {
        const simpleBook = BookApi.createSimpleBookData(book);
        this.draftState.items[id] = simpleBook;
      }
    });
  }

  public setDesc(payload: BookApi.BookDescResponse[]) {
    payload.forEach((desc) => {
      this.draftState.desc[desc.b_id] = desc.descriptions;
    });
  }

  public setSelectBook(payload: { checkedIds: string[]; isSelectedId: string[] }) {
    payload.checkedIds.forEach((bId) => {
      this.draftState.isAvailableSelect[bId] = payload.isSelectedId.includes(bId);
    });
  }

  public checkSelectBook() {}
}

const innerBooksReducer = createReducerFunction(BooksReducer, booksInitialState);
export function booksReducer(
  state: BooksState = booksInitialState,
  action: AnyAction,
): BooksState {
  if (action.type === HYDRATE) {
    return {
      items: { ...state.items, ...action.payload.books.items },
      isAvailableSelect: { ...state.isAvailableSelect, ...action.payload.books.isAvailableSelect },
      desc: { ...state.desc, ...action.payload.books.desc },
    };
  }
  return innerBooksReducer(state, action as any);
}
export const booksActions = createActionCreators(BooksReducer);
