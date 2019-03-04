import { StoreRootState } from './config';
import { appStateInitialState } from 'src/services/app/reducer';

export const initialState: StoreRootState = {
  app: appStateInitialState,
  router: {
    action: '',
  },
};
