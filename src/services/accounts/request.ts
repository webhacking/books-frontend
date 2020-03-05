import axios, { OAuthRequestType, wrapCatchCancel } from 'src/utils/axios';
import { LoggedUser } from 'src/types/account';
import { CancelTokenSource } from 'axios';

export const checkLoggedIn = async (cancelToken: CancelTokenSource) => {
  const { data } = await wrapCatchCancel(axios.get)<LoggedUser>('/accounts/me', {
    baseURL: process.env.NEXT_PUBLIC_ACCOUNT_API,
    withCredentials: true,
    custom: {
      authorizationRequestType: OAuthRequestType.CHECK,
    },
    cancelToken: cancelToken.token,
  });
  return data;
};
