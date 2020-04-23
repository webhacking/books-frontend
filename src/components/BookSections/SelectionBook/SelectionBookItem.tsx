import React, { useCallback, useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { slateGray20, slateGray60 } from '@ridi/colors';

import BookMeta from 'src/components/BookMeta';
import { sendClickEvent, useEventTracker } from 'src/hooks/useEventTracker';
import { requestExcludeBook, requestCancelExcludeBook } from 'src/utils/recommendation';
import {
  AIRecommendationBook,
  DisplayType,
  MdBook,
} from 'src/types/sections';
import PortraitBook from 'src/components/Book/PortraitBook';

const RecommendButton = styled.button<{ fetching?: boolean }>`
  width: 55px;
  margin-top: 8px;
  border-radius: 4px;
  border: 1px solid ${slateGray20};
  padding: 6px 7px;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
  color: ${slateGray60};
  outline: none;

  ${(props) => props.fetching && `
    opacity: 0.3;
    cursor: not-allowed;
  `}
`;

interface CommonProps {
  genre: string;
  width: number;
  slug: string;
  order?: number;
  excluded?: boolean;
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
    slug,
    order,
    excluded,
    className,
  } = props;
  const ratingInfo = props.type === DisplayType.HomeMdSelection
    ? props.book.rating
    : undefined;

  // 추천제외 여부
  const [localExcluded, setLocalExcluded] = useState(excluded);
  const [isFetching, setFetching] = useState(false);
  const [tracker] = useEventTracker();
  const requestToggleExclude = useCallback(
    async () => {
      try {
        setFetching(true);
        let result: any;
        if (localExcluded) {
          result = await requestCancelExcludeBook(book.b_id, genre);
        } else if ('rcmd_id' in book) {
          result = await requestExcludeBook(book.b_id, book.rcmd_id, genre);
        } else {
          throw new Error(`rcmd_id not found for AI recommendation: ${book.b_id}`);
        }
        if (result) {
          setLocalExcluded(!localExcluded);
        }
      } finally {
        setFetching(false);
      }
    },
    [localExcluded, genre, book],
  );

  const handleClick = useCallback(() => {
    sendClickEvent(tracker, book, slug, order);
  }, [tracker, book, slug, order]);

  return (
    <PortraitBook
      bId={book.b_id}
      bookDetail={book.detail}
      index={order}
      genre={genre}
      slug={slug}
      disabled={localExcluded}
      onClick={handleClick}
      className={className}
    >
      {book.detail && (
        <BookMeta
          showTag={['bl', 'bl-serial'].includes(genre)}
          book={book.detail}
          width={`${props.width || 140}px`}
          ratingInfo={ratingInfo}
          css={
            localExcluded
            && css`
              opacity: 0.2;
              pointer-events: none;
            `
          }
        />
      )}

      {props.type === DisplayType.AiRecommendation && (
        <RecommendButton
          fetching={isFetching}
          onClick={requestToggleExclude}
        >
          {localExcluded ? '다시 보기' : '추천 제외'}
        </RecommendButton>
      )}
    </PortraitBook>
  );
};

export default React.memo(SelectionBookItem);
