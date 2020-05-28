import { configureScope } from '@sentry/browser';
import libAxios, { CancelTokenSource } from 'axios';
import React from 'react';

import axios, { CancelToken, OAuthRequestType } from 'src/utils/axios';
import { CancelledError, runWithExponentialBackoff } from 'src/utils/backoff';
import { LoggedUser } from 'src/types/account';

const AccountContext = React.createContext<LoggedUser | null>(null);

async function checkLoggedIn(cancel: CancelTokenSource) {
  try {
    const { data } = await axios.get<LoggedUser>('/accounts/me', {
      baseURL: process.env.NEXT_STATIC_ACCOUNT_API,
      withCredentials: true,
      custom: {
        authorizationRequestType: OAuthRequestType.CHECK,
      },
      cancelToken: cancel.token,
    });
    return data;
  } catch (err) {
    if (libAxios.isCancel(err)) {
      throw new CancelledError();
    }
    throw err;
  }
}

export function AccountProvider(props: { children?: React.ReactNode }) {
  const [account, setAccount] = React.useState<LoggedUser | null>(null);

  React.useEffect(() => {
    const cancel = CancelToken.source();
    runWithExponentialBackoff(
      () => checkLoggedIn(cancel),
    ).then(setAccount);
    return () => cancel.cancel();
  }, []);

  React.useEffect(() => {
    configureScope((scope) => {
      scope.setUser(account);
    });
  }, [account]);

  return React.createElement(
    AccountContext.Provider,
    { value: account },
    props.children,
  );
}

export default function useAccount() {
  return React.useContext(AccountContext);
}
