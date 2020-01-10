import axios, { OAuthRequestType } from 'src/utils/axios';
import { LoggedUser } from 'src/types/account';
import { CancelTokenSource } from 'axios';

export const checkLoggedIn = async (cancelToken: CancelTokenSource) => {
  const { data } = await axios.get<LoggedUser>('/accounts/me', {
    baseURL: publicRuntimeConfig.ACCOUNT_API,
    withCredentials: true,
    custom: {
      authorizationRequestType: OAuthRequestType.CHECK,
    },
    cancelToken: cancelToken.token,
  });
  return data;
};
