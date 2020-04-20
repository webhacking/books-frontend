import React, { useCallback } from 'react';

import BookMeta from 'src/components/BookMeta';
import { sendClickEvent, useEventTracker } from 'src/hooks/useEventTracker';
import {
  AIRecommendationBook,
  DisplayType,
  MdBook,
} from 'src/types/sections';
import PortraitBook from 'src/components/Book/PortraitBook';

interface CommonProps {
  order?: number;
  slug: string;
  genre: string;
  className?: string;
}

interface MdBookProps {
  type: Exclude<DisplayType, DisplayType.AiRecommendation>;
  book: MdBook;
}

interface AIRecommendationBookProps {
  type: DisplayType.AiRecommendation;
  book: AIRecommendationBook;
}

type Props = CommonProps & (MdBookProps | AIRecommendationBookProps);

const SelectionBookItem: React.FC<Props> = (props) => {
  const {
    book,
    genre,
    type,
    slug,
    order,
    className,
  } = props;
  const { b_id: bId, detail } = book;

  const [tracker] = useEventTracker();

  const handleClick = useCallback(() => {
    sendClickEvent(tracker, book, slug, order);
  }, [tracker, book, slug, order]);

  return (
    <PortraitBook
      bId={bId}
      bookDetail={detail}
      index={order}
      genre={genre}
      slug={slug}
      onClick={handleClick}
      className={className}
    >
      {detail && (
        <BookMeta
          showTag={['bl', 'bl-serial'].includes(genre)}
          book={detail}
          showRating={type === DisplayType.HomeMdSelection}
          ratingInfo={(book as MdBook).rating}
        />
      )}
    </PortraitBook>
  );
};

export default React.memo(SelectionBookItem);
