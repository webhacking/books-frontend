import { RootState } from './config';

export const initialState: RootState = {
  books: {
    isFetching: false,
    items: {},
  },
  categories: {
    isFetching: false,
    items: {},
  },
};
