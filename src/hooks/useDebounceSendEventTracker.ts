import { useCallback, useState } from 'react';
import { useDebouncedCallback as useDebounce } from 'use-debounce';
import { useEventTracker } from 'src/hooks/useEveneTracker';

interface DisplayEvent {
  ts: number;
  idx: number;
  id: string;
}

export const useDebounceSendEventTracker = (): [
  (slug: string, bookId: string, timeStamp: number) => void,
] => {
  const [tracker] = useEventTracker();
  const [mergedImpressionBook, setImpressionBook] = useState<{
    [key: string]: DisplayEvent[];
  }>({});

  const sendImpression = useCallback(() => {
    Object.keys(mergedImpressionBook).forEach(key => {
      const sectionItem = mergedImpressionBook[key].map((item, index) => ({
        id: item.id,
        idx: index,
        ts: item.ts,
      }));
      tracker.sendEvent('display', { section: key, items: sectionItem });
    });

    setImpressionBook({});
  }, [tracker, mergedImpressionBook]);
  const [debouncedInsertImpressionItem] = useDebounce(sendImpression, 1000);

  const insertImpressionItem = useCallback(
    (slug, bookId) => {
      const keys = {
        ...mergedImpressionBook,
        [slug]: mergedImpressionBook[slug]
          ? [...mergedImpressionBook[slug], { id: bookId, ts: new Date().getTime() }]
          : [{ id: bookId, ts: new Date().getTime() }],
      };
      setImpressionBook(keys);
      debouncedInsertImpressionItem();
    },
    [debouncedInsertImpressionItem, mergedImpressionBook],
  );
  return [insertImpressionItem];
};
