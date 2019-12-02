import { useCallback, useState } from 'react';
import { useDebouncedCallback as useDebounce } from 'use-debounce';
import { useEventTracker } from 'src/hooks/useEveneTracker';

export const useDebounceSendEventTracker = (): [
  (slug: string, bookId: string) => void,
] => {
  const [tracker] = useEventTracker();
  const [mergedImpressionBook, setImpressionBook] = useState<{ [key: string]: string[] }>(
    {},
  );

  const sendImpression = useCallback(() => {
    tracker.sendEvent('Impression', mergedImpressionBook);
    setImpressionBook({});
  }, [tracker, mergedImpressionBook]);
  const [debouncedInsertImpressionItem] = useDebounce(sendImpression, 1000);

  const insertImpressionItem = useCallback(
    (slug, bookId) => {
      const keys = {
        ...mergedImpressionBook,
        [slug]: mergedImpressionBook[slug]
          ? [...mergedImpressionBook[slug], bookId]
          : [bookId],
      };
      setImpressionBook(keys);
      debouncedInsertImpressionItem();
    },
    [debouncedInsertImpressionItem, mergedImpressionBook],
  );
  return [insertImpressionItem];
};
