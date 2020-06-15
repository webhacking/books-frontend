import { createStore, Store } from 'redux';
import { rootReducers } from 'src/store/reducers';

export default function makeStore(initialState?: any): Store {
  const store = createStore(rootReducers, initialState);
  (store as any).sagaTask = {
    toPromise: () => Promise.resolve(),
  };
  return store;
}
