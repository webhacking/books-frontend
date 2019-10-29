import axios from 'src/utils/axios';
import { LoggedUser } from 'src/types/account';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
export function* checkLoggedIn() {
  const { data } = yield axios.get<LoggedUser>(
    new URL('/accounts/me', publicRuntimeConfig.ACCOUNT_API).toString(),
    {
      withCredentials: true,
    },
  );
  return data;
}
