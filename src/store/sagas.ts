import { all } from 'redux-saga/effects';
import { appRootSaga } from 'src/services';

export default function *rootSaga() {
  yield all([
    // append more sagas
    appRootSaga(),
  ]);
}
