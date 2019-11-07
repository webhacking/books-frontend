import axios, { OAuthRequestType } from 'src/utils/axios';
import { LoggedUser } from 'src/types/account';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
export const checkLoggedIn = async () => {
  const { data } = await axios.get<LoggedUser>('/accounts/me', {
    baseURL: publicRuntimeConfig.ACCOUNT_API,
    withCredentials: true,
    custom: {
      authorizationRequestType: OAuthRequestType.CHECK,
    },
  });
  return data;
};
