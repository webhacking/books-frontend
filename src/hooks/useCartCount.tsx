import { useState, useEffect } from 'react';
import pRetry from 'p-retry';
import axios, { CancelToken } from 'src/utils/axios';
import sentry from 'src/utils/sentry';
import { LoggedUser } from 'src/types/account';

export const useCartCount = (loggedUserInfo: LoggedUser | null) => {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const source = CancelToken.source();
    const requestCartCount = async () => {
      try {
        const result = await pRetry(
          () => axios.get('/api/cart/count', {
            baseURL: process.env.NEXT_STATIC_LEGACY_STORE_API_HOST,
            withCredentials: true,
            cancelToken: source.token,
          }),
          { retries: 2 },
        );
        if (result.status === 200) {
          if (result.data.count) {
            setCartCount(result.data.count);
          }
        }
      } catch (error) {
        sentry.captureException(error);
      }
    };
    if (loggedUserInfo) {
      requestCartCount();
    }
    return source.cancel;
  }, [loggedUserInfo]);

  return cartCount;
};
