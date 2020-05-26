import * as R from 'runtypes';

import * as BookApi from 'src/types/book';
import axios from 'src/utils/axios';
import sentry from 'src/utils/sentry';

export const requestBooks = async (b_ids: string[]): Promise<BookApi.Book[]> => {
  try {
    const { data } = await axios.get('/books', {
      baseURL: process.env.NEXT_STATIC_BOOK_API,
      params: {
        b_ids: b_ids.join(),
      },
    });
    try {
      return R.Array(BookApi.RBookData).check(data);
    } catch (error) {
      sentry.captureException(error);
      return data as BookApi.Book[];
    }
  } catch (error) {
    sentry.captureException(error);
    return [];
  }
};


export const requestBooksDesc = async (b_ids: string[]) => {
  try {
    const { data } = await axios.get<BookApi.Book[]>('/books/descriptions', {
      baseURL: process.env.NEXT_STATIC_BOOK_API,
      params: {
        b_ids: b_ids.join(),
      },
    });
    return data;
  } catch (error) {
    sentry.captureException(error);
    return [];
  }
};


export const checkAvailableAtRidiSelect = async (b_ids: string[]) => {
  const { data } = await axios.get<{ [key: number]: string }>('/books/available', {
    baseURL: process.env.NEXT_STATIC_SELECT_API,
    params: {
      b_ids: b_ids.join(),
    },
  });
  return data;
};
