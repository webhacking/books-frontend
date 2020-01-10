import * as BookApi from 'src/types/book';
import axios from 'src/utils/axios';
import sentry from 'src/utils/sentry';
const { captureException } = sentry();

export const requestBooks = async (b_ids: string[]) => {
  try {
    const { data } = await axios.get<BookApi.Book[]>('/books', {
      baseURL: publicRuntimeConfig.BOOK_API,
      params: {
        b_ids: b_ids.join(),
      },
    });
    return data;
  } catch (error) {
    captureException(error);
    return [];
  }
};

export const checkAvailableAtRidiSelect = async (b_ids: string[]) => {
  const { data } = await axios.get<{ [key: number]: string }>('/books/available', {
    baseURL: publicRuntimeConfig.SELECT_API,
    params: {
      b_ids: b_ids.join(),
    },
  });
  return data;
};
