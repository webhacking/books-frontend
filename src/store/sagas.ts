import { all } from 'redux-saga/effects';
import { appRootSaga } from 'src/services';
import { accountRootSaga } from 'src/services/accounts';
import { booksRootSaga } from 'src/services/books';

export default function* rootSaga() {
  yield all([appRootSaga(), accountRootSaga(), booksRootSaga()]);
}
