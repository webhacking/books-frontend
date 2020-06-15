import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Context, createWrapper } from 'next-redux-wrapper';

import createSagaMiddleware from 'redux-saga';
import { rootReducers } from 'src/store/reducers';

import rootSaga from 'src/store/sagas';

import { BooksState } from 'src/services/books/reducer';
import { CategoryState } from 'src/services/category/reducer';

export interface RootState {
  books: BooksState;
  categories: CategoryState;
}

const makeStore = (_context: Context): Store => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducers,
    process.env.IS_PRODUCTION
      ? applyMiddleware(sagaMiddleware)
      : composeWithDevTools(applyMiddleware(sagaMiddleware)),
  );

  (store as any).sagaTask = sagaMiddleware.run(rootSaga);
  return store as unknown as Store;
};

const wrapper = createWrapper(makeStore, { debug: false });

export default wrapper;
