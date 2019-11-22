import { combineReducers } from 'redux';
import { appReducer } from 'src/services';
import { routerReducer } from 'connected-next-router';
import { accountReducer } from 'src/services/accounts';
import { booksReducer } from 'src/services/books';
import { categoryReducer } from 'src/services/category';

export const rootReducers = combineReducers({
  app: appReducer,
  router: routerReducer,
  account: accountReducer,
  books: booksReducer,
  categories: categoryReducer,
});
