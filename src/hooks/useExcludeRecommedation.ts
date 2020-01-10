import axios, { OAuthRequestType } from 'src/utils/axios';
import pRetry from 'p-retry';
import sentry from 'src/utils/sentry';

const { captureException } = sentry();

export const useExcludeRecommendation = (): [
  (bId: string, rcmdId: string) => void,
  (bId: string) => void,
] => {
  const requestURL = new URL('', publicRuntimeConfig.STORE_HOST);

  // eslint-disable-next-line consistent-return
  const requestExcludeBook = async (bId: string, rcmd_id: string) => {
    try {
      return pRetry(
        () =>
          axios.put(
            `/personalized-recommendation/blacklist/${bId}`,
            { rcmd_id },
            {
              baseURL: requestURL.toString(),
              withCredentials: true,
              custom: { authorizationRequestType: OAuthRequestType.CHECK },
            },
          ),
        { retries: 2 },
      );
    } catch (error) {
      captureException(error);
    }
  };

  // eslint-disable-next-line consistent-return
  const requestCancelExcludeBook = async (bId: string) => {
    try {
      return pRetry(
        () =>
          axios.delete(`/personalized-recommendation/blacklist/${bId}`, {
            baseURL: requestURL.toString(),
            withCredentials: true,
            custom: { authorizationRequestType: OAuthRequestType.CHECK },
          }),
        { retries: 2 },
      );
    } catch (error) {
      captureException(error);
    }
  };

  return [requestExcludeBook, requestCancelExcludeBook];
};
