import axios, { OAuthRequestType } from 'src/utils/axios';
import pRetry from 'p-retry';
import sentry from 'src/utils/sentry';

const { captureException } = sentry();

export const useExcludeRecommendation = (): [
  (bId: string, rcmdId: string, genre: string) => void,
  (bId: string, genre: string) => void,
] => {
  const requestURL = new URL('', publicRuntimeConfig.STORE_HOST);

  // eslint-disable-next-line consistent-return
  const requestExcludeBook = async (bId: string, rcmd_id: string, genre: string) => {
    try {
      return pRetry(
        () =>
          axios.post(
            `/recommendation/book/exclude/${bId}/?genre=${genre}`,
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
  const requestCancelExcludeBook = async (bId: string, genre: string) => {
    try {
      return pRetry(
        () =>
          axios.delete(`/recommendation/book/exclude/${bId}/?genre=${genre}`, {
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
