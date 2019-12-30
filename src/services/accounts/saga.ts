import { takeEvery, all, call, put } from 'redux-saga/effects';
import { accountActions, AccountReducer } from 'src/services/accounts/reducer';
import { checkLoggedIn } from 'src/services/accounts/request';
import pRetry from 'p-retry';
import { Actions } from 'immer-reducer';
import { CancelTokenSource } from 'axios';

function* watchCheckLogged(action: Actions<typeof AccountReducer>) {
  try {
    const data = yield call(
      pRetry,
      () => checkLoggedIn(action.payload as CancelTokenSource),
      {
        retries: 2,
      },
    );
    yield put({ type: accountActions.setLogged.type, payload: data.result });
  } catch (err) {
    yield put({ type: accountActions.setLogged.type, payload: null });
  }
}

export function* accountRootSaga() {
  yield all([takeEvery(accountActions.checkLogged.type, watchCheckLogged)]);
}
