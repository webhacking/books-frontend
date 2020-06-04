import React from 'react';

import { useBookSelector } from 'src/hooks/useBookDetailSelector';
import { getMaxDiscountPercentage } from 'src/utils/common';

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
  const title = props.title || bookDetail?.title || '';
  const singlePriceInfo = bookDetail?.price;
  const seriesPriceInfo = bookDetail?.series?.price;
  return (
    <ThumbnailRenderer
      order={order}
      title={title}
      className={className}
      sizes={sizes}
      slug={slug}
      thumbnailId={bookDetail?.thumbnailId || bId}
      isAdultOnly={bookDetail?.isAdultOnly || false}
      imgSize="large"
    >
      {!onlyAdultBadge && (
        <>
          <BadgeContainer>
            <BookBadgeRenderer
              isRentable={
                (!!singlePriceInfo?.rent
                  || (!!seriesPriceInfo?.rent && bookDetail?.series?.isSerial))
                && ['general', 'romance', 'bl'].includes(genre)
              }
              isWaitFree={bookDetail?.series?.isWaitFree}
              discountPercentage={getMaxDiscountPercentage(bookDetail)}
            />
          </BadgeContainer>
          <FreeBookRenderer
            freeBookCount={
              seriesPriceInfo?.rent?.free_book_count
              || seriesPriceInfo?.buy?.free_book_count
              || 0
            }
            unit={bookDetail?.unit || '권'}
          />
          <SetBookRenderer
            setBookCount={bookDetail?.setBookCount}
          />
        </>
      )}
      {bookDetail?.isAdultOnly && <AdultBadge />}
    </ThumbnailRenderer>
  );
}
