import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Arrow from 'src/components/Carousel/Arrow';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';
import { DisplayType, HotRelease, TodayRecommendation } from 'src/types/sections';
import { BookMeta, sentenceStyle } from 'src/components/RecommendedBook/RecommendedBook';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { AdultBadge } from 'src/components/Badge/AdultBadge';
import { BadgeContainer } from 'src/components/Badge/BadgeContainer';
import BooksCarousel from 'src/components/Carousel/BooksCarousel';

const arrowWrapperCSS = css`
  position: absolute;
  top: calc(50% - 9px);
`;

const CarouselWrapper = styled.div`
  width: 1005px;
  margin: 0 auto;
  position: relative;
  margin-top: 20px;
`;

const bookWidthStyle = css`width: 140px;`;

interface RecommendedBookCarouselProps {
  items: TodayRecommendation[] | HotRelease[];
  type: DisplayType.HotRelease | DisplayType.TodayRecommendation;
  theme: 'dark' | 'white';
  slug?: string;
  genre: string;
}

interface CarouselItemProps {
  book: TodayRecommendation | HotRelease;
  index: number;
  type: DisplayType;
  theme: string;
  slug: string;
  genre: string;
}

const CarouselItem = React.memo((props: CarouselItemProps) => {
  const {
    book, index, type, slug, theme, genre,
  } = props;
  const href = `/books/${book.b_id}`;
  return (
    <PortraitBook css={css`height: 100%;`}>
      <a
        css={css`display: inline-block;`}
        href={href}
      >
        <ThumbnailWrapper>
          <ThumbnailRenderer
            order={index}
            className={slug}
            css={bookWidthStyle}
            sizes="140px"
            slug={slug}
            book={{ b_id: book.b_id, detail: book.detail }}
            imgSize="large"
          >
            <BadgeContainer>
              <BookBadgeRenderer
                type={type}
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
      {/* Todo show sentence */}
      {book.detail && type === DisplayType.HotRelease && (
        <BookMeta book={book.detail} />
      )}
      {book.detail && type === DisplayType.TodayRecommendation && (
        <h4
          css={[
            css`
              padding-left: 0;
              position: relative;
              margin-top: 10px;
              ${sentenceStyle};
            `,
            theme === 'dark'
              && css`
                color: white;
              `,
          ]}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: (book).sentence.replace(
                /(?:\r\n|\r|\n)/g,
                '<br />',
              ),
            }}
          />
        </h4>
      )}
    </PortraitBook>
  );
});

const RecommendedBookCarousel = React.memo((
  props: RecommendedBookCarouselProps,
) => {
  const {
    theme, type, slug, genre,
  } = props;

  const { items } = props;
  const books = React.useMemo(
    () => items.filter((book) => book.detail),
    [items],
  );
  const totalItems = books.length;

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const handleLeftArrow = React.useCallback(() => {
    setCurrentIdx((idx) => {
      const page = Math.ceil(idx / 6);
      if (page === 0) {
        return totalItems - 6;
      }
      return (page - 1) * 6;
    });
  }, [totalItems]);
  const handleRightArrow = React.useCallback(() => {
    setCurrentIdx((idx) => {
      if (idx + 6 === totalItems) {
        return 0;
      }
      if (idx + 12 > totalItems) {
        return totalItems - 6;
      }
      return idx + 6;
    });
  }, [totalItems]);

  return (
    <CarouselWrapper>
      <BooksCarousel
        totalItems={books.length}
        itemsInPage={6}
        currentIdx={currentIdx}
        itemWidth={140}
        itemMargin={22}
      >
        {({ index }) => (
          <CarouselItem
            key={index}
            book={books[index]}
            index={index}
            type={type}
            genre={genre}
            theme={theme}
            slug={slug}
          />
        )}
      </BooksCarousel>
      {props.items.length > 6 && (
        <form key="arrows">
          <Arrow
            onClickHandler={handleLeftArrow}
            label="이전"
            color={theme}
            side="left"
            wrapperStyle={css`
              ${arrowWrapperCSS};
              ${greaterThanOrEqualTo(
              BreakPoint.XL + 1,
              css`left: -31px;`,
            )};
              left: 5px;
              top: ${getArrowVerticalCenterPosition()};
            `}
          />
          <Arrow
            label="다음"
            onClickHandler={handleRightArrow}
            color={theme}
            side="right"
            wrapperStyle={css`
              ${arrowWrapperCSS};
              ${greaterThanOrEqualTo(
              BreakPoint.XL + 1,
              css`right: -27px;`,
            )};
              right: 5px;
              top: ${getArrowVerticalCenterPosition()};
            `}
          />
        </form>
      )}
    </CarouselWrapper>
  );
});

export default RecommendedBookCarousel;
