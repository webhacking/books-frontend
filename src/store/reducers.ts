import { combineReducers } from 'redux';
import { booksReducer } from 'src/services/books';
import { categoryReducer } from 'src/services/category';
import { notificationReducer } from 'src/services/notification';

export const rootReducers = combineReducers({
  books: booksReducer,
  categories: categoryReducer,
  notifications: notificationReducer,
});
