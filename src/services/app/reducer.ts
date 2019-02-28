import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';

export interface AppState {
  version: string;
}

const initialState: AppState = {
  version: '0.0.1',
};

export class AppReducer extends ImmerReducer<AppState> {
  public initialize(payload: { version: string }) {
    this.draftState.version = payload.version;
  }
}

export const appReducer = createReducerFunction(AppReducer, initialState);
export const appActions = createActionCreators(AppReducer);
