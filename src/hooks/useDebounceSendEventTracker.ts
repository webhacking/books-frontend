import { useCallback, useState } from 'react';
import { useDebouncedCallback as useDebounce } from 'use-debounce';
import { useEventTracker } from 'src/hooks/useEveneTracker';

interface DisplayEvent {
  ts: number;
  order: number;
  id: string;
}

export const useDebounceSendEventTracker = (): [
  (slug: string, bookId: string, order: number) => void,
] => {
  const [tracker] = useEventTracker();
  const [mergedImpressionBook, setImpressionBook] = useState<{
    [key: string]: DisplayEvent[];
  }>({});

  const sendImpression = useCallback(() => {
    Object.keys(mergedImpressionBook).forEach(key => {
      const sectionItem = mergedImpressionBook[key].map(item => ({
        id: item.id,
        order: item.order,
        ts: item.ts,
      }));
      tracker.sendEvent('display', { section: key, items: sectionItem });
    });

    setImpressionBook({});
  }, [tracker, mergedImpressionBook]);
  const [debouncedInsertImpressionItem] = useDebounce(sendImpression, 1000);

  const insertImpressionItem = useCallback(
    (slug, bookId, order) => {
      const keys = {
        ...mergedImpressionBook,
        [slug]: mergedImpressionBook[slug]
          ? [
              ...mergedImpressionBook[slug],
              { id: bookId, order, ts: new Date().getTime() },
            ]
          : [{ id: bookId, order, ts: new Date().getTime() }],
      };
      setImpressionBook(keys);
      debouncedInsertImpressionItem();
    },
    [debouncedInsertImpressionItem, mergedImpressionBook],
  );
  return [insertImpressionItem];
};
