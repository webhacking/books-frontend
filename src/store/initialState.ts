import { RootState } from './config';
import { appStateInitialState } from 'src/services/app/reducer';

export const initialState: RootState = {
  app: appStateInitialState,
  // router: {
  //   action: '',
  // },
};
