import React, { useContext, useRef } from 'react';
import {
  BookList,
  BookMeta,
  hotReleaseBookListCSS,
  recommendedBookListCSS,
  sentenceStyle,
} from 'src/components/RecommendedBook/RecommendedBook';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { css } from '@emotion/core';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { DisplayType, HotRelease, TodayRecommendation } from 'src/types/sections';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import { displayNoneForTouchDevice } from 'src/styles';
import { DeviceTypeContext } from 'src/components/Context/DeviceType';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { useMultipleIntersectionObserver } from 'src/hooks/useMultipleIntersectionObserver';
import { useSendDisplayEvent } from 'src/hooks/useEventTracker';
import { AdultBadge } from 'src/components/Badge/AdultBadge';

interface RecommendedBookListProps {
  items: TodayRecommendation[] | HotRelease[];
  type: DisplayType.HotRelease | DisplayType.TodayRecommendation;
  theme: 'dark' | 'white';
  isIntersecting: boolean;
  slug: string;
  genre: string;
}

interface ListItemProps {
  book: TodayRecommendation | HotRelease;
  index: number;
  type: DisplayType;
  theme: string;
  isIntersecting: boolean;
  slug: string;
  genre: string;
}

const ListItem = React.memo(function ListItem(props: ListItemProps) {
  const { book, index, type, theme, isIntersecting, slug, genre } = props;
  return (
    <PortraitBook
      key={index}
      css={[
        props.type === DisplayType.HotRelease
          ? css`
              margin-right: 12px !important;
              @media (min-width: 834px) {
                margin-right: 20px !important;
              }
              @media (min-width: 1000px) {
                margin-right: inherit !important;
              }
            `
          : css`
              margin-right: 30px !important;
              :last-of-type {
                padding-right: 35px !important;
              }
              @media (min-width: 1000px) {
                margin-right: inherit !important;
                padding-right: inherit !important;
              }
            `,
      ]}>
      <a
        css={css`
          display: inline-block;
        `}
        href={`/books/${book.b_id}`}>
        <ThumbnailWrapper>
          <ThumbnailRenderer
            className={slug}
            order={index}
            responsiveWidth={[
              css`
                width: 100px;
              `,
            ]}
            slug={slug}
            book={{ b_id: book.b_id, detail: book.detail }}
            imgSize={'large'}
            isIntersecting={isIntersecting}>
            <div
              css={css`
                position: absolute;
                display: block;
                top: -7px;
                left: -7px;
                z-index: 2;
              `}>
              <BookBadgeRenderer
                type={type}
                wrapperCSS={css``}
                isRentable={
                  (!!book.detail?.price_info?.rent ||
                    !!book.detail?.series?.price_info?.rent) &&
                  ['general', 'romance', 'bl'].includes(genre)
                }
                isWaitFree={book.detail?.series?.property.is_wait_free}
                discountPercentage={getMaxDiscountPercentage(book.detail)}
              />
            </div>
            <FreeBookRenderer
              freeBookCount={
                book.detail?.series?.price_info?.rent?.free_book_count ||
                book.detail?.series?.price_info?.buy?.free_book_count ||
                0
              }
              unit={book.detail?.series?.property.unit || '권'}
            />
            <SetBookRenderer setBookCount={book.detail?.setbook?.member_books_count} />
            {book.detail?.property?.is_adult_only && <AdultBadge />}
          </ThumbnailRenderer>
        </ThumbnailWrapper>
      </a>
      {/* Todo show sentence */}
      {book.detail && type === DisplayType.HotRelease && <BookMeta book={book.detail} />}
      {book.detail && type === DisplayType.TodayRecommendation && (
        <h4
          css={[
            css`
              padding-left: 0;
              position: relative;
              margin-top: 2px;
              ${sentenceStyle}
            `,
            theme === 'dark' &&
              css`
                color: white;
              `,
          ]}>
          <span
            dangerouslySetInnerHTML={{
              __html: (book as HotRelease).sentence.replace(/(?:\r\n|\r|\n)/g, '<br />'),
            }}
          />
        </h4>
      )}
    </PortraitBook>
  );
});

const RecommendedBookList: React.FC<RecommendedBookListProps> = React.memo(props => {
  const ref = useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref);
  const { theme, type, slug, isIntersecting, genre } = props;
  const deviceType = useContext(DeviceTypeContext);

  const sendDisplayEvent = useSendDisplayEvent(slug);
  useMultipleIntersectionObserver(ref, slug, sendDisplayEvent);

  const items = props.items;
  const carouselItems = React.useMemo(
    () =>
      items
        .filter(book => book.detail)
        .map((book, index) => (
          <ListItem
            key={index}
            book={book}
            index={index}
            type={type}
            theme={theme}
            isIntersecting={isIntersecting}
            slug={slug}
            genre={genre}
          />
        )),
    [items, type, theme, isIntersecting, slug],
  );

  return (
    <div
      css={css`
        position: relative;
        margin-top: 6px;
      `}>
      <BookList
        ref={ref}
        css={[
          type === DisplayType.HotRelease
            ? hotReleaseBookListCSS
            : recommendedBookListCSS,
          type === DisplayType.TodayRecommendation
            ? css`
                padding-left: 23px !important;
              `
            : css`
                padding-left: 13px !important;
              `,
        ]}>
        {carouselItems}
      </BookList>
      {!['mobile', 'tablet'].includes(deviceType) && (
        <form css={displayNoneForTouchDevice}>
          <Arrow
            onClickHandler={moveLeft}
            label={'이전'}
            color={theme}
            side={'left'}
            wrapperStyle={[
              css`
                left: 5px;
                z-index: 2;
                position: absolute;
                transition: opacity 0.2s;
                top: calc(
                  ${getArrowVerticalCenterPosition(
                    ref,
                    type === DisplayType.HotRelease ? '30px' : '0px',
                  )}
                );
              `,
              !isOnTheLeft && arrowTransition,
            ]}
          />
          <Arrow
            label={'다음'}
            onClickHandler={moveRight}
            color={theme}
            side={'right'}
            wrapperStyle={[
              css`
                z-index: 2;
                right: 9px;
                position: absolute;
                transition: opacity 0.2s;
                top: calc(
                  ${getArrowVerticalCenterPosition(
                    ref,
                    type === DisplayType.HotRelease ? '30px' : '0px',
                  )}
                );
              `,
              !isOnTheRight && arrowTransition,
            ]}
          />
        </form>
      )}
    </div>
  );
});

export default RecommendedBookList;
