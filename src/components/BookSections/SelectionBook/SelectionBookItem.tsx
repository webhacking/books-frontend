import React, { useCallback } from 'react';

import BookMeta from 'src/components/BookMeta';
import * as tracker from 'src/utils/event-tracker';
import { DisplayType, BookItem } from 'src/types/sections';
import PortraitBook from 'src/components/Book/PortraitBook';

interface Props {
  type: DisplayType;
  order?: number;
  slug: string;
  genre: string;
  className?: string;
  book: BookItem;
}

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

  const handleClick = useCallback(() => {
    tracker.sendClickEvent(book, slug, order);
  }, [book, slug, order]);
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
