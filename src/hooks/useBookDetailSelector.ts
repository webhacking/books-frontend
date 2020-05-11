import { RootState } from 'src/store/config';
import { useSelector } from 'react-redux';
import * as BookApi from 'src/types/book';

export function useBookSelector(bId: string): BookApi.ClientBook | null {
  return useSelector<RootState, BookApi.ClientBook | null>((state) => state.books?.items?.[bId] || null);
}
