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
        const cartUrl = `${process.env.NEXT_PUBLIC_LEGACY_STORE_API_HOST}/api/cart/count`;

        const result = await pRetry(
          () => axios.get(cartUrl, {
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
