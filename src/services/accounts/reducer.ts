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
  public checkLogged(cancelToken: CancelTokenSource) {}

  public setLogged(payload: LoggedUser | null) {
    this.draftState.loggedUser = payload;
  }
}

export const accountReducer = createReducerFunction(AccountReducer, accountInitialState);
export const accountActions = createActionCreators(AccountReducer);
