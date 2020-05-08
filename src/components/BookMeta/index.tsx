import React from 'react';
import styled from '@emotion/styled';

import StarRating from 'src/components/StarRating/StarRating';
import Tag from 'src/components/Tag/Tag';
import { StarRating as StarRatingType } from 'src/types/sections';

import { useBookSelector } from 'src/hooks/useBookDetailSelector';
import BookMetaBase from './BookMeta';

const TagWrapper = styled.div`
  display: flex;
  margin-top: 6px;
`;

interface BookMetaProps {
  bId: string;
  titleLineClamp?: number;
  showSomeDeal?: boolean;
  isAIRecommendation?: boolean;
  showTag: boolean;
  width?: string;
  className?: string;
  ratingInfo?: StarRatingType;
}

export default function BookMeta(props: BookMetaProps) {
  const {
    bId,
    showTag,
    showSomeDeal,
    ratingInfo,
    titleLineClamp,
    className,
    width,
  } = props;

  const book = useBookSelector(bId);
  if (book == null || book.is_deleted) {
    return null;
  }

  const {
    property: { is_somedeal, is_novel },
    file: { is_comic, is_comic_hd },
  } = book;
  return (
    <BookMetaBase
      bId={bId}
      titleLineClamp={titleLineClamp}
      width={width}
      className={className}
    >
      {ratingInfo && (
        <span>
          <StarRating
            totalReviewer={ratingInfo.buyer_rating_count}
            rating={ratingInfo.buyer_rating_score || 0}
          />
        </span>
      )}
      {(showTag || (showSomeDeal && is_somedeal)) && (
        <TagWrapper>
          {showTag && (is_comic_hd || is_comic) && <Tag.Comic />}
          {showTag && is_novel && <Tag.Novel />}
          {showSomeDeal && is_somedeal && <Tag.SomeDeal />}
        </TagWrapper>
      )}
    </BookMetaBase>
  );
}
