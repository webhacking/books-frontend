import React, { useCallback, useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { slateGray20, slateGray60 } from '@ridi/colors';

import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import BookMeta from 'src/components/BookMeta';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import { AdultBadge } from 'src/components/Badge/AdultBadge';
import { BadgeContainer } from 'src/components/Badge/BadgeContainer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { sendClickEvent, useEventTracker } from 'src/hooks/useEventTracker';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { requestExcludeBook, requestCancelExcludeBook } from 'src/utils/recommendation';
import {
  AIRecommendationBook,
  DisplayType,
  MdBook,
} from 'src/types/sections';

const bookWidthStyle = css`
  width: 140px;
  @media (max-width: 999px) {
    width: 100px;
  }
`;

interface CommonProps {
  genre: string;
  width: number;
  slug: string;
  order?: number;
  excluded?: boolean;
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
    excluded,
  } = props;

  // 추천제외 여부
  const [localExcluded, setLocalExcluded] = useState(excluded);
  const [isFetching, setFetching] = useState(false);
  const [tracker] = useEventTracker();
  const requestExclude = useCallback(
    async (bId, rcmdId) => {
      try {
        setFetching(true);
        const result = await requestExcludeBook(bId, rcmdId, genre);
        // @ts-ignore
        if (result) {
          setLocalExcluded(true);
        }
      } finally {
        setFetching(false);
      }
    },
    [genre],
  );

  const requestCancelExclude = useCallback(
    async (bId) => {
      try {
        setFetching(true);
        const result = await requestCancelExcludeBook(bId, genre);
        // @ts-ignore
        if (result) {
          setLocalExcluded(false);
        }
      } finally {
        setFetching(false);
      }
    },
    [genre],
  );

  return (
    <>
      <a
        css={css`display: block;`}
        onClick={sendClickEvent.bind(null, tracker, book, slug, order)}
        href={`/books/${book.b_id}`}
      >
        <ThumbnailWrapper
          css={[
            localExcluded
              && css`
                opacity: 0.2;
                pointer-events: none;
              `,
            css`
              transition: opacity 0.2s;
            `,
          ]}
        >
          <ThumbnailRenderer
            className={slug}
            order={order}
            slug={slug}
            css={bookWidthStyle}
            sizes="(max-width: 999px) 100px, 140px"
            book={{ b_id: book.b_id, detail: book.detail }}
            imgSize="large"
          >
            <BadgeContainer>
              <BookBadgeRenderer
                isRentable={
                  (!!book.detail?.price_info?.rent
                    || !!book.detail?.series?.price_info?.rent)
                  && ['general', 'romance', 'bl'].includes(genre)
                }
                isWaitFree={book.detail?.series?.property.is_wait_free}
                discountPercentage={getMaxDiscountPercentage(book.detail)}
              />
            </BadgeContainer>
            <FreeBookRenderer
              freeBookCount={
                book.detail?.series?.price_info?.rent?.free_book_count
                || book.detail?.series?.price_info?.buy?.free_book_count
                || 0
              }
              unit={book.detail?.series?.property.unit || '권'}
            />
            <SetBookRenderer setBookCount={book.detail?.setbook?.member_books_count} />
            {book.detail?.property?.is_adult_only && <AdultBadge />}
          </ThumbnailRenderer>
        </ThumbnailWrapper>
      </a>

      {book.detail && (
        <BookMeta
          showTag={['bl', 'bl-serial'].includes(genre)}
          book={book.detail}
          width={`${props.width || 140}px`}
          showRating={type === DisplayType.HomeMdSelection}
          ratingInfo={(book as MdBook).rating}
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
        <button
          css={[
            css`
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
            `,
            isFetching
              && css`
                opacity: 0.3;
                cursor: not-allowed;
              `,
          ]}
          onClick={
            localExcluded
              ? requestCancelExclude.bind(null, props.book.b_id)
              : requestExclude.bind(
                null,
                props.book.b_id,
                props.book.rcmd_id,
              )
          }
          aria-label={localExcluded ? '다시 보기' : '추천 제외'}
        >
          {localExcluded ? '다시 보기' : '추천 제외'}
        </button>
      )}
    </>
  );
};

export default React.memo(SelectionBookItem);
