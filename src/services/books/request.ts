import getConfig from 'next/config';
import * as BookApi from 'src/types/book';
import axios from 'src/utils/axios';
const { publicRuntimeConfig } = getConfig();
export const requestBooks = async (b_ids: string[]) => {
  const { data } = await axios.get<BookApi.Book[]>('/books', {
    baseURL: publicRuntimeConfig.BOOK_API,
    params: {
      b_ids: b_ids.join(),
    },
  });
  return data;
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
