import { combineReducers } from 'redux';
import { accountReducer } from 'src/services/accounts';
import { booksReducer } from 'src/services/books';
import { categoryReducer } from 'src/services/category';
import { notificationReducer } from 'src/services/notification';

export const rootReducers = combineReducers({
  account: accountReducer,
  books: booksReducer,
  categories: categoryReducer,
  notifications: notificationReducer,
});
