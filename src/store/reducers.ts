import { combineReducers } from 'redux';
import { appReducer } from 'src/services';
import { routerReducer } from 'connected-next-router';
import { accountReducer } from 'src/services/accounts';

export const rootReducers = combineReducers({
  app: appReducer,
  router: routerReducer,
  account: accountReducer,
});
