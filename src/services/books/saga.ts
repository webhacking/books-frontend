import {
  takeEvery, all, call, put, select, takeLatest, delay,
} from 'redux-saga/effects';
import { checkAvailableAtRidiSelect, requestBooks } from 'src/services/books/request';
import pRetry from 'p-retry';
import { booksActions, BooksReducer, BooksState } from 'src/services/books/reducer';
import { Actions } from 'immer-reducer';
import { splitArrayToChunk } from 'src/utils/common';
import { RootState } from 'src/store/config';
import sentry from 'src/utils/sentry';

// 임시 청크
const DEFAULT_BOOKS_ID_CHUNK_SIZE = 60;

function* fetchBooks(bIds: string[]) {
  const data = yield call(pRetry, () => requestBooks(bIds), { retries: 2 });
  yield put({ type: booksActions.setBooks.type, payload: data });
}

function* isAvailableAtSelect(bIds: string[]) {
  try {
    const books: BooksState = yield select((state: RootState) => state.books);
    const availableBIds = bIds.filter(
      (bId) => {
        const book = books.items[bId];
        return book && !book.clientBookFields.isAlreadyCheckedAtSelect;
      },
    );
    if (availableBIds.length > 0) {
      const data = yield call(pRetry, () => checkAvailableAtRidiSelect(bIds), {
        retries: 2,
      });
      const ids = Object.keys(data).map((key) => data[key]);
      yield put({
        type: booksActions.setSelectBook.type,
        payload: { checkedIds: bIds, isSelectedId: ids },
      });
    }
  } catch (e) {
    sentry.captureException(e);
  }
}

function* watchCheckSelectBookIds(action: Actions<typeof BooksReducer>) {
  try {
    yield delay(1000);
    if (action.type === booksActions.checkSelectBook.type && action.payload.length > 0) {
      const uniqIds = [...new Set(action.payload)];
      const { items }: BooksState = yield select((state: RootState) => state.books);
      const excludedIds = uniqIds.filter(
        (id) => items[id] && !items[id]?.clientBookFields?.isAvailableSelect,
      );
      const arrays = splitArrayToChunk(excludedIds, DEFAULT_BOOKS_ID_CHUNK_SIZE);

      yield all(arrays.map((array) => isAvailableAtSelect(array)));
      yield put({ type: booksActions.setFetching.type, payload: false });
    }
  } catch (error) {
    yield put({ type: booksActions.setFetching.type, payload: false });
    sentry.captureException(error);
  }
}

function* watchInsertBookIds(action: Actions<typeof BooksReducer>) {
  try {
    if (action.type === booksActions.insertBookIds.type && action.payload.length > 0) {
      const uniqIds = [...new Set(action.payload)];

      const books: BooksState = yield select((state: RootState) => state.books);
      const excludedIds = uniqIds.filter((id) => !books.items[id]);
      const arrays = splitArrayToChunk(excludedIds, DEFAULT_BOOKS_ID_CHUNK_SIZE);

      yield all(arrays.map((array) => fetchBooks(array)));
      yield put({ type: booksActions.setThumbnailId.type });
      yield put({ type: booksActions.setFetching.type, payload: false });
    }
  } catch (error) {
    yield put({ type: booksActions.setFetching.type, payload: false });
    sentry.captureException(error);
  }
}

export function* booksRootSaga() {
  yield all([
    takeEvery(booksActions.insertBookIds.type, watchInsertBookIds),
    takeLatest(booksActions.checkSelectBook.type, watchCheckSelectBookIds),
  ]);
}
