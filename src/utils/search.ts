import pRetry from 'p-retry';

import { Query } from 'src/hooks/useSearchQueries';
import * as SearchTypes from 'src/types/searchResults';
import axios from 'src/utils/axios';

export const ITEM_PER_PAGE = 24;
export const MAX_PAGE = 400;
const orderType = ['score', 'recent', 'review_cnt', 'price', 'similarity'];

export async function runSearch(query: Query) {
  const {
    q: searchKeyword,
    isAdultExclude,
    page,
    categoryId,
    order,
  } = query;
  const searchUrl = new URL('/search', process.env.NEXT_STATIC_SEARCH_API);

  searchUrl.searchParams.set('adult_exclude', isAdultExclude ? 'y' : 'n');
  searchUrl.searchParams.set('site', 'ridi-store');
  searchUrl.searchParams.append('where', 'book');
  if (orderType.includes(order)) {
    searchUrl.searchParams.set('order', order);
  }

  if (/^\d+$/.test(categoryId)) {
    searchUrl.searchParams.set('category_id', categoryId);
  }

  const startPosition = Math.min(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * (MAX_PAGE - 1));
  if (startPosition >= 0) {
    searchUrl.searchParams.set('start', startPosition.toString());
  }

  const isPublisherSearch = searchKeyword.startsWith('출판사:');
  if (isPublisherSearch) {
    searchUrl.searchParams.set('what', 'publisher');
    searchUrl.searchParams.set(
      'keyword',
      searchKeyword.replace('출판사:', ''),
    );
  } else {
    searchUrl.searchParams.set('what', 'base');
    searchUrl.searchParams.append('where', 'author');
    searchUrl.searchParams.set('keyword', searchKeyword);
  }

  const { data } = await pRetry(
    () => axios.get(searchUrl.toString()),
    {
      retries: 3,
    },
  );
  return SearchTypes.checkSearchResult(isPublisherSearch ? {
    book: data,
    author: { total: 0, authors: [] },
  } : data);
}
