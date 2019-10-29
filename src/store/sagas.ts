import { all } from 'redux-saga/effects';
import { appRootSaga } from 'src/services';
import { accountRootSaga } from 'src/services/accounts';

export default function* rootSaga() {
  yield all([appRootSaga(), accountRootSaga()]);
}
