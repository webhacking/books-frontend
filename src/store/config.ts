import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import createSagaMiddleware, { Task } from 'redux-saga';
import { rootReducers } from 'src/store/reducers';
import { AppState } from 'src/services/app/reducer';
import { ServerResponse } from 'http';
import { createRouterMiddleware, initialRouterState, RouteState } from 'connected-next-router';

import rootSaga from 'src/store/sagas';

// @ts-ignore
import { Router } from 'server/routes';
import { initialState } from 'src/store/initialState';

export interface StoreRootState {
  app?: AppState;
  router?: RouteState;
}

interface MakeStoreOption {
  asPath?: string;
  storeKey?: string;
  debug?: boolean;
  // tslint:disable-next-line
  serializeState?: any;
  // tslint:disable-next-line
  deserializeState?: any;
  req?: Request;
  res?: ServerResponse;
  isServer: boolean;
}

const sagaMiddleware = createSagaMiddleware();
const routerMiddleware = createRouterMiddleware({
  Router,
  method: {
    push: 'pushRoute',
    replace: 'replaceRoute',
    prefetch: 'prefetchRoute',
  },
});

// next-redux-saga
// next-redux-wrapper
// connected-next-router
const makeStore = (
  preLoadedState: StoreRootState = initialState,
  makeStoreOption?: MakeStoreOption,
) => {
  // @ts-ignore
  if (makeStoreOption && makeStoreOption.asPath) {
    preLoadedState.router = initialRouterState(makeStoreOption.asPath);
  }

  const store = createStore(
    rootReducers,
    preLoadedState,
    composeWithDevTools(applyMiddleware(sagaMiddleware, routerMiddleware)),
  );

  (store as Store & { sagaTask: Task }).sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export default makeStore;
