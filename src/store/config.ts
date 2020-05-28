import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import createSagaMiddleware from 'redux-saga';
import { rootReducers } from 'src/store/reducers';

import rootSaga from 'src/store/sagas';

import { initialState } from 'src/store/initialState';
import { BooksState } from 'src/services/books/reducer';
import { CategoryState } from 'src/services/category/reducer';
import { NotificationState } from 'src/services/notification/reducer';

export interface RootState {
  books: BooksState;
  categories: CategoryState;
  notifications: NotificationState;
}

const makeStore = (
  preLoadedState: RootState = initialState,
): Store => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducers,
    preLoadedState,
    process.env.IS_PRODUCTION
      ? applyMiddleware(sagaMiddleware)
      : composeWithDevTools(applyMiddleware(sagaMiddleware)),
  );

  (store as any).sagaTask = sagaMiddleware.run(rootSaga);
  return store as unknown as Store;
};

export default makeStore;
