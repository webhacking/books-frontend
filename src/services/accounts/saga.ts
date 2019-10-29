import { takeEvery, all, call, put } from 'redux-saga/effects';
import { accountActions } from 'src/services/accounts/reducer';
import { checkLoggedIn } from 'src/services/accounts/request';

function* watchCheckLogged() {
  try {
    const data = yield call(checkLoggedIn);
    yield put({ type: accountActions.setLogged.type, payload: data.result });
  } catch (err) {
    yield put({ type: accountActions.setLogged.type, payload: null });
  }
}

export function* accountRootSaga() {
  yield all([takeEvery(accountActions.checkLogged.type, watchCheckLogged)]);
}
