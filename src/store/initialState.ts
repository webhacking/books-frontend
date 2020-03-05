import { RootState } from './config';

export const initialState: RootState = {
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
  notifications: {
    hasNotification: false,
    isLoaded: false,
    unreadCount: 0,
    items: [],
  },
};
