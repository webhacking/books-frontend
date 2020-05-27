import { RootState } from 'src/store/config';
import { useSelector } from 'react-redux';
import * as BookApi from 'src/types/book';

export function useBookSelector(bId: string): BookApi.ClientBook | BookApi.ClientSimpleBook | null {
  return useSelector<RootState, BookApi.ClientBook | BookApi.ClientSimpleBook | null>((state) => state.books?.items?.[bId] || null);
}
