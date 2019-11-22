import { all } from 'redux-saga/effects';
import { appRootSaga } from 'src/services';
import { accountRootSaga } from 'src/services/accounts';
import { booksRootSaga } from 'src/services/books';
import { categoriesRootSaga } from 'src/services/category';

export default function* rootSaga() {
  yield all([appRootSaga(), accountRootSaga(), booksRootSaga(), categoriesRootSaga()]);
}
