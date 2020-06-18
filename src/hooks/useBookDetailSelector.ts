import { RootState } from 'src/store/config';
import { useSelector } from 'react-redux';
import * as BookApi from 'src/types/book';

export function useBookSelector(bId: string): BookApi.SimpleBook | null {
  return useSelector<RootState, BookApi.SimpleBook | null>((state) => state.books?.items?.[bId] ?? null);
}

export function useBookDescription(bId: string): BookApi.BookDesc | null {
  return useSelector<RootState, BookApi.BookDesc | null>((state) => state.books?.desc?.[bId] ?? null);
}

export function useIsAvailableSelect(bId: string): boolean | null {
  return useSelector<RootState, boolean | null>((state) => state.books?.isAvailableSelect?.[bId] ?? null);
}
