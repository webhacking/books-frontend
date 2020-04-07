import pRetry from 'p-retry';

import axios, { OAuthRequestType } from 'src/utils/axios';
import sentry from 'src/utils/sentry';

export async function requestExcludeBook(bId: string, rcmd_id: string, genre: string) {
  try {
    return pRetry(
      () => axios.post(
        `/recommendation/book/exclude/${bId}/?genre=${genre}`,
        { rcmd_id },
        {
          baseURL: process.env.NEXT_STATIC_STORE_API,
          withCredentials: true,
          custom: { authorizationRequestType: OAuthRequestType.CHECK },
        },
      ),
      { retries: 2 },
    );
  } catch (error) {
    sentry.captureException(error);
    return false;
  }
}

export async function requestCancelExcludeBook(bId: string, genre: string) {
  try {
    return pRetry(
      () => axios.delete(`/recommendation/book/exclude/${bId}/?genre=${genre}`, {
        baseURL: process.env.NEXT_STATIC_STORE_API,
        withCredentials: true,
        custom: { authorizationRequestType: OAuthRequestType.CHECK },
      }),
      { retries: 2 },
    );
  } catch (error) {
    sentry.captureException(error);
    return false;
  }
}
