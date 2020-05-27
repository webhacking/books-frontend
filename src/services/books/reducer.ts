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

const createSimpleBookData = (book: BookApi.Book): BookApi.ClientSimpleBook => ({
  id: book.id,
  is_deleted: book.is_deleted,
  authors: book.authors,
  categories: book.categories,
  file: {
    is_comic: book.file.is_comic,
    is_comic_hd: book.file.is_comic_hd,
  },
  property: {
    is_trial: book.property.is_trial,
    is_adult_only: book.property.is_adult_only,
    is_novel: book.property.is_novel,
    is_somedeal: book.property.is_somedeal,
  },
  price_info: {
    rent: book.price_info.rent,
    buy: book.price_info.buy,
  },
  publisher: {
    id: book.publisher.id,
    name: book.publisher.name,
  },
  series: book.series,
  setbook: book.setbook,
  title: book.title,
  clientBookFields: {
    isAvailableSelect: false,
    isAlreadyCheckedAtSelect: false,
  },
});

export class BooksReducer extends ImmerReducer<BooksState> {
  public insertBookIds(payload: { bIds: string[]; withDesc?: boolean; setSimple?: boolean }) {
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

  public setBooks(payload: { items: BookApi.Book[]; setSimple?: boolean }) {
    try {
      const books: BooksState['items'] = {};
      payload.items.forEach((book) => {
        if (this.draftState.items[book.id] === null) {
          books[book.id] = createSimpleBookData(book);
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
