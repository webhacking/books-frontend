import React from 'react';

import { useBookSelector } from 'src/hooks/useBookDetailSelector';
import { computeBookTitle } from 'src/utils/bookTitleGenerator';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { getThumbnailIdFromBookDetail } from 'src/utils/books';

import BookBadgeRenderer from '../Badge/BookBadgeRenderer';
import FreeBookRenderer from '../Badge/FreeBookRenderer';
import SetBookRenderer from '../Badge/SetBookRenderer';
import ThumbnailRenderer from '../BookThumbnail/ThumbnailRenderer';
import { AdultBadge } from '../Badge/AdultBadge';
import { BadgeContainer } from '../Badge/BadgeContainer';

interface Props {
  bId: string;
  order?: number;
  genre: string;
  slug: string;
  sizes: string;
  className?: string;
  onlyAdultBadge?: boolean;
  title?: string;
}

export default function ThumbnailWithBadge(props: Props) {
  const {
    bId,
    order,
    genre,
    slug,
    sizes,
    className,
    onlyAdultBadge,
  } = props;
  const bookDetail = useBookSelector(bId);
  const title = props.title || computeBookTitle(bookDetail);
  const singlePriceInfo = bookDetail?.price_info;
  const seriesPriceInfo = bookDetail?.series?.price_info;
  return (
    <ThumbnailRenderer
      order={order}
      title={title}
      className={className}
      sizes={sizes}
      slug={slug}
      thumbnailId={getThumbnailIdFromBookDetail(bookDetail) || bId}
      isAdultOnly={bookDetail?.property.is_adult_only || false}
      imgSize="large"
    >
      {!onlyAdultBadge && (
        <>
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
          <SetBookRenderer
            setBookCount={bookDetail?.setbook?.member_books_count}
          />
        </>
      )}
      {bookDetail?.property?.is_adult_only && <AdultBadge />}
    </ThumbnailRenderer>
  );
}
