import { appStateInitialState } from 'src/services/app/reducer';
import { RootState } from './config';

export const initialState: RootState = {
  app: appStateInitialState,
  account: {
    loggedUser: null,
  },
  books: {
    isFetching: false,
    items: {},
  },
  categories: {
    isFetching: false,
    items: {},
  },
};
