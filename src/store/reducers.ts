import { combineReducers } from 'redux';
import { booksReducer } from 'src/services/books';
import { categoryReducer } from 'src/services/category';

export const rootReducers = combineReducers({
  books: booksReducer,
  categories: categoryReducer,
});
