import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Arrow from 'src/components/Carousel/Arrow';
import SliderCarousel from 'react-slick';
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
import SliderCarouselWrapper from 'src/components/Carousel/CarouselWrapper';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { AdultBadge } from 'src/components/Badge/AdultBadge';

const recommendedBookCarouselLoadingCSS = css`
  overflow: hidden;
  left: -18px;
  .slick-slide {
    width: 162px !important;
    //will-change: transform;
    .slide-item-inner {
      display: inline-block;
      width: 140px;
    }
  }
  div[aria-hidden='true'] .badge {
    //opacity: 0;
    transition: all 3s;
  }
  div[aria-hidden='false'] .badge {
    opacity: 1;
    //transition: all .3s;
  }
`;

const arrowWrapperCSS = css`
  position: absolute;
  top: calc(50% - 9px);
`;

const CarouselWrapper = styled.div`
  width: 1005px;
  margin: 0 auto;
  position: relative;
  padding-left: 36px;
  margin-top: 6px;
`;

interface RecommendedBookCarouselProps {
  items: TodayRecommendation[] | HotRelease[];
  type: DisplayType.HotRelease | DisplayType.TodayRecommendation;
  theme: 'dark' | 'white';
  slug?: string;
  genre: string;
}

const RecommendedBookCarouselLoading: React.FC<RecommendedBookCarouselProps> = React.memo(
  (props) => (
    <ul
      css={css`
        display: flex;
        padding-left: 3px;
        justify-content: center;
        margin-left: -18px;
      `}
    >
      {props.items
        .filter((book) => book.detail)
        .map((book, index) => (
          <PortraitBook key={index} css={css`position: relative; left: 7px; top: 7px;`}>
            <ThumbnailWrapper>
              <ThumbnailRenderer
                responsiveWidth={css`width: 140px;`}
                sizes="140px"
                book={{ b_id: book.b_id, detail: book.detail }}
                imgSize="large"
              />
            </ThumbnailWrapper>
            {book.detail && props.type === DisplayType.HotRelease && (
              <BookMeta book={book.detail} />
            )}
            {book.detail && props.type === DisplayType.TodayRecommendation && (
              <h4
                css={[
                  css`
                    padding-left: 0;
                    position: relative;
                    left: 7px;
                    ${sentenceStyle};
                  `,
                  props.theme === 'dark' && css`color: white;`,
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
        ))}
    </ul>
  ),
);

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
    // @ts-ignore
    <div
      css={css`
        display: flex;
        flex-direction: column;
        outline: none;
      `}
    >
      <PortraitBook
        css={css`
          height: 100%;
          padding-left: 0 !important;
        `}
      >
        <a
          css={css`
            display: inline-block;
          `}
          href={href}
        >
          <ThumbnailWrapper>
            <ThumbnailRenderer
              order={index}
              className={slug}
              responsiveWidth={css`width: 140px;`}
              sizes="140px"
              slug={slug}
              book={{ b_id: book.b_id, detail: book.detail }}
              imgSize="large"
            >
              <div
                css={css`
                  position: absolute;
                  display: block;
                  top: -7px;
                  left: -7px;
                  z-index: 2;
                `}
              >
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
              </div>
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
                left: 7px;
                margin-top: 2px;
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
    </div>
  );
});

const RecommendedBookCarousel = React.memo((
  props: RecommendedBookCarouselProps,
) => {
  const slider = useRef<SliderCarousel>();
  const {
    theme, type, slug, genre,
  } = props;
  // @ts-ignore
  const [isMounted, setMounted] = useState(false);

  const handleLeftArrow = (e: FormEvent) => {
    e.preventDefault();
    slider.current?.slickPrev();
  };
  const handleRightArrow = (e: FormEvent) => {
    e.preventDefault();
    slider.current?.slickNext();
  };

  useEffect(() => {
    window.setImmediate(() => setMounted(true));
  }, []);

  const { items } = props;
  const carouselItems = React.useMemo(
    () => items
      .filter((book) => book.detail)
      .map((book, index) => (
        <CarouselItem
          key={index}
          book={book}
          index={index}
          type={type}
          genre={genre}
          theme={theme}
          slug={slug}
        />
      )),
    [items, type, theme, slug],
  );

  if (!isMounted) {
    // Flickering 없는 UI 를 위해 추가함
    return (
      <RecommendedBookCarouselLoading
        theme={theme}
        genre={genre}
        type={props.type}
        items={props.items.slice(0, 6)}
      />
    );
  }

  return (
    <CarouselWrapper>
      <SliderCarouselWrapper
        forwardedRef={slider}
        css={recommendedBookCarouselLoadingCSS}
        className="slider"
        slidesToShow={Math.min(props.items.length, 6)}
        slidesToScroll={6}
        speed={200}
        autoplay={false}
        arrows={false}
        infinite
      >
        {carouselItems}
      </SliderCarouselWrapper>
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
