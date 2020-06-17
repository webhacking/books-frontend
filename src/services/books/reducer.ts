import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import * as BookApi from 'src/types/book';
import sentry from 'src/utils/sentry';

export interface BooksState {
  items: { [key: string]: BookApi.ClientSimpleBook | null };
}

export const booksInitialState: BooksState = {
  items: {},
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
        const simpleBook: any = BookApi.createSimpleBookData(book);
        simpleBook.clientBookFields = {
          isAvailableSelect: false,
          isAlreadyCheckedAtSelect: false,
        };
        this.draftState.items[id] = simpleBook;
      }
    });
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
}

const innerBooksReducer = createReducerFunction(BooksReducer, booksInitialState);
export function booksReducer(
  state: BooksState = booksInitialState,
  action: AnyAction,
): BooksState {
  if (action.type === HYDRATE) {
    return {
      items: { ...state.items, ...action.payload.books.items },
    };
  }
  return innerBooksReducer(state, action as any);
}
export const booksActions = createActionCreators(BooksReducer);
