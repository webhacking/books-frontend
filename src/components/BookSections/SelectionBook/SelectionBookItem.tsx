import React, { useCallback } from 'react';

import BookMeta from 'src/components/BookMeta';
import { sendClickEvent, useEventTracker } from 'src/hooks/useEventTracker';
import {
  AIRecommendationBook,
  DisplayType,
  BookItem,
} from 'src/types/sections';
import PortraitBook from 'src/components/Book/PortraitBook';

interface CommonProps {
  order?: number;
  slug: string;
  genre: string;
  className?: string;
}

interface MdBookProps {
  type: Exclude<DisplayType, 'AiRecommendation'>;
  book: BookItem;
}

interface AIRecommendationBookProps {
  type: 'AiRecommendation';
  book: AIRecommendationBook;
}

type Props = CommonProps & (MdBookProps | AIRecommendationBookProps);

const SelectionBookItem: React.FC<Props> = (props) => {
  const {
    book,
    genre,
    slug,
    order,
    className,
  } = props;
  const { b_id: bId } = book;
  const ratingInfo = props.type === 'HomeMdSelection'
    ? props.book.rating
    : undefined;

  const [tracker] = useEventTracker();

  const handleClick = useCallback(() => {
    sendClickEvent(tracker, book, slug, order);
  }, [tracker, book, slug, order]);
  return (
    <PortraitBook
      bId={bId}
      index={order}
      genre={genre}
      slug={slug}
      onClick={handleClick}
      className={className}
    >
      <BookMeta
        showTag={['bl', 'bl-serial'].includes(genre)}
        bId={bId}
        ratingInfo={ratingInfo}
      />
    </PortraitBook>
  );
};

export default React.memo(SelectionBookItem);
