import { useState, useEffect } from 'react';
import originalAxios from 'axios';
import pRetry from 'p-retry';
import axios, { OAuthRequestType } from 'src/utils/axios';
import sentry from 'src/utils/sentry';
import { LoggedUser } from 'src/types/account';

const { captureException } = sentry();

export const useCartCount = (loggedUserInfo: LoggedUser) => {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const cartRequestTokenSource = originalAxios.CancelToken.source();
    const requestCartCount = async () => {
      try {
        const cartUrl = new URL(
          '/api/cart/count',
          process.env.STORE_TEMP_API_HOST,
        );

        const result = await pRetry(
          () => axios.get(cartUrl.toString(), {
            withCredentials: true,
            cancelToken: cartRequestTokenSource.token,
            custom: { authorizationRequestType: OAuthRequestType.CHECK },
          }),
          { retries: 2 },
        );
        if (result.status === 200) {
          if (result.data.count) {
            setCartCount(result.data.count);
          }
        }
      } catch (error) {
        captureException(error);
      }
    };
    if (loggedUserInfo) {
      requestCartCount();
    }
    return () => {
      cartRequestTokenSource.cancel();
    };
  }, [loggedUserInfo]);

  return cartCount;
};
