import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import { LoggedUser } from 'src/types/account';

export interface AccountState {
  loggedUser: null | LoggedUser;
}

export const accountInitialState: AccountState = {
  loggedUser: null,
};

export class AccountReducer extends ImmerReducer<AccountState> {
  // eslint-disable-next-line
  public checkLogged() {}

  public setLogged(payload: LoggedUser | null) {
    this.draftState.loggedUser = payload;
  }
}

export const accountReducer = createReducerFunction(AccountReducer, accountInitialState);
export const accountActions = createActionCreators(AccountReducer);
