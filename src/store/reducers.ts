import { combineReducers } from 'redux';
import { appReducer } from 'src/services';
// import { routerReducer } from 'connected-next-router';

export const rootReducers = combineReducers({
  app: appReducer,
  // router: routerReducer,
  // append more reducers
});
