import {
  takeEvery, all, call, put, select,
} from 'redux-saga/effects';
import pRetry from 'p-retry';
import { Actions } from 'immer-reducer';
import { splitArrayToChunk } from 'src/utils/common';
import { RootState } from 'src/store/config';
import sentry from 'src/utils/sentry';
import {
  categoryActions,
  CategoryReducer,
  CategoryState,
} from 'src/services/category/reducer';
import { requestCategories } from 'src/services/category/request';

const { captureException } = sentry();

const DEFAULT_CHUNK_SIZE = 20;

function* fetchCategories(category_ids: number[]) {
  const data = yield call(pRetry, () => requestCategories(category_ids), { retries: 2 });
  yield put({ type: categoryActions.setCategories.type, payload: data });
}

function* watchInsertCategoryIds(action: Actions<typeof CategoryReducer>) {
  try {
    if (
      action.type === categoryActions.insertCategoryIds.type
      && action.payload.length > 0
    ) {
      const uniqIds = [...new Set(action.payload)];

      const categories: CategoryState = yield select(
        (state: RootState) => state.categories,
      );
      const excludedIds = uniqIds.filter((id) => !categories.items[id]);
      const arrays = splitArrayToChunk(excludedIds, DEFAULT_CHUNK_SIZE);

      yield all(arrays.map((array) => fetchCategories(array)));
      yield put({ type: categoryActions.setFetching.type, payload: false });
    }
  } catch (error) {
    yield put({ type: categoryActions.setFetching.type, payload: false });
    captureException(error);
  }
}

export function* categoriesRootSaga() {
  yield all([takeEvery(categoryActions.insertCategoryIds.type, watchInsertCategoryIds)]);
}
