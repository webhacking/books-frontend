import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import getConfig from 'next-server/config';
const { publicRuntimeConfig } = getConfig();
export interface AppState {
  version: string;
  environment: string;
}

export const appStateInitialState: AppState = {
  version: publicRuntimeConfig.VERSION || 'UNKNOWN',
  environment: publicRuntimeConfig.ENVIRONMENT || 'development',
};

export class AppReducer extends ImmerReducer<AppState> {
  public initialize(payload: { version: string }) {
    this.draftState.version = payload.version;
  }
}

export const appReducer = createReducerFunction(AppReducer, appStateInitialState);
export const appActions = createActionCreators(AppReducer);
