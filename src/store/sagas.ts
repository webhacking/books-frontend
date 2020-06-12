import { all } from 'redux-saga/effects';
import { booksRootSaga } from 'src/services/books';
import { categoriesRootSaga } from 'src/services/category';

export default function* rootSaga() {
  yield all([
    booksRootSaga(),
    categoriesRootSaga(),
  ]);
}
