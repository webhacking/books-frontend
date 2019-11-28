import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { booksActions } from 'src/services/books';

const useIsSelectFetch = (bIds: string[]) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: booksActions.checkSelectBook.type, payload: bIds });
  }, []);
};

export default useIsSelectFetch;
