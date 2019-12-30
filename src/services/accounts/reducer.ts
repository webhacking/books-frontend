import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import { LoggedUser } from 'src/types/account';
import { CancelTokenSource } from 'axios';

export interface AccountState {
  loggedUser: null | LoggedUser;
}

export const accountInitialState: AccountState = {
  loggedUser: null,
};

export class AccountReducer extends ImmerReducer<AccountState> {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public checkLogged(cancelToken: CancelTokenSource) {}

  public setLogged(payload: LoggedUser | null) {
    this.draftState.loggedUser = payload;
  }
}

export const accountReducer = createReducerFunction(AccountReducer, accountInitialState);
export const accountActions = createActionCreators(AccountReducer);
