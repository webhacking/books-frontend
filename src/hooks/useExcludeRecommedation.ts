import axios, { OAuthRequestType } from 'src/utils/axios';
import pRetry from 'p-retry';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const useExcludeRecommendation = (): [
  (bId: string, rcmdId: string) => void,
  (bId: string) => void,
] => {
  const requestURL = new URL('', publicRuntimeConfig.STORE_HOST);

  const requestExcludeBook = async (bId: string, rcmd_id: string) => {
    pRetry(
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
  };

  const requestCancelExcludeBook = async (bId: string) => {
    pRetry(
      () =>
        axios.delete(`/personalized-recommendation/blacklist/${bId}`, {
          baseURL: requestURL.toString(),
          withCredentials: true,
          custom: { authorizationRequestType: OAuthRequestType.CHECK },
        }),
      { retries: 2 },
    );
  };

  return [requestExcludeBook, requestCancelExcludeBook];
};
