import getConfig from 'next/config';
import * as CategoryApi from 'src/types/category';
import axios from 'src/utils/axios';
const { publicRuntimeConfig } = getConfig();
export const requestCategories = async (category_ids: number[]) => {
  const { data } = await axios.get<CategoryApi.Category[]>('/categories', {
    baseURL: publicRuntimeConfig.BOOK_API,
    params: {
      category_ids: category_ids.join(),
    },
  });
  return data;
};
