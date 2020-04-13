import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { getMaxDiscountPercentage } from 'src/utils/common';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import * as BookApi from 'src/types/book';

import { ThumbnailWrapper } from '../BookThumbnail/ThumbnailWrapper';
import BookBadgeRenderer from '../Badge/BookBadgeRenderer';
import FreeBookRenderer from '../Badge/FreeBookRenderer';
import SetBookRenderer from '../Badge/SetBookRenderer';
import ThumbnailRenderer from '../BookThumbnail/ThumbnailRenderer';
import { AdultBadge } from '../Badge/AdultBadge';
import { BadgeContainer } from '../Badge/BadgeContainer';

const bookWidthStyle = css`
  width: 100px;

  @media (min-width: 1000px) {
    width: 140px;
  }
`;

const PortraitBookWrapper = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;

  ${orBelow(
    BreakPoint.LG,
    `
      min-width: 100px;
      width: 100px;
    `,
  )}
`;

const StyledThumbnailWrapper = styled(ThumbnailWrapper)<{ disabled?: boolean }>`
  transition: opacity 0.2s;
  ${(props) => props.disabled && 'opacity: 0.2;'}
`;

interface Props {
  bId: string;
  bookDetail: BookApi.ClientBook | null;
  index?: number;
  genre: string;
  slug: string;
  disabled?: boolean;
  onClick?(): void;
  className?: string;
  children?: React.ReactNode;
}

export default function PortraitBook(props: Props) {
  const {
    bId,
    bookDetail,
    index,
    genre,
    slug,
    disabled,
    onClick,
    className,
    children,
  } = props;
  const href = `/books/${bId}`;
  const singlePriceInfo = bookDetail?.price_info;
  const seriesPriceInfo = bookDetail?.series?.price_info;
  return (
    <PortraitBookWrapper className={className}>
      <a css={css`display: inline-block;`} href={href} onClick={onClick}>
        <StyledThumbnailWrapper disabled={disabled}>
          <ThumbnailRenderer
            order={index}
            className={slug}
            css={bookWidthStyle}
            sizes="(min-width: 999px) 140px, 100px"
            slug={slug}
            book={{ b_id: bId, detail: bookDetail }}
            imgSize="large"
          >
            <BadgeContainer>
              <BookBadgeRenderer
                isRentable={
                  (!!singlePriceInfo?.rent
                    || !!seriesPriceInfo?.rent)
                  && ['general', 'romance', 'bl'].includes(genre)
                }
                isWaitFree={bookDetail?.series?.property.is_wait_free}
                discountPercentage={getMaxDiscountPercentage(bookDetail)}
              />
            </BadgeContainer>
            <FreeBookRenderer
              freeBookCount={
                seriesPriceInfo?.rent?.free_book_count
                || seriesPriceInfo?.buy?.free_book_count
                || 0
              }
              unit={bookDetail?.series?.property.unit || '권'}
            />
            <SetBookRenderer setBookCount={bookDetail?.setbook?.member_books_count} />
            {bookDetail?.property?.is_adult_only && <AdultBadge />}
          </ThumbnailRenderer>
        </StyledThumbnailWrapper>
      </a>
      {children}
    </PortraitBookWrapper>
  );
}
