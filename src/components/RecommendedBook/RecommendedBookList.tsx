import React, { useRef } from 'react';
import {
  BookList,
  BookMeta,
  hotReleaseBookListCSS,
  recommendedBookListCSS,
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
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';

interface RecommendedBookListProps {
  items: TodayRecommendation[] | HotRelease[];
  type: DisplayType.HotRelease | DisplayType.TodayRecommendation;
  theme: 'dark' | 'white';
  isIntersecting: boolean;
}

const RecommendedBookList: React.FC<RecommendedBookListProps> = props => {
  const ref = useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref);
  const { theme, type } = props;
  return (
    <div
      css={css`
        position: relative;
      `}>
      <BookList
        ref={ref}
        css={[
          props.type === DisplayType.HotRelease
            ? hotReleaseBookListCSS
            : recommendedBookListCSS,
          css`
            padding-left: 0 !important;
          `,
        ]}>
        {props.items.map((book, index) => (
          <PortraitBook key={index}>
            <ThumbnailWrapper>
              <ThumbnailRenderer
                width={120}
                book={{ b_id: book.b_id, detail: book.detail }}
                imgSize={'xxlarge'}
                isIntersecting={props.isIntersecting}>
                <div
                  css={css`
                    position: absolute;
                    display: block;
                    top: -7px;
                    left: -7px;
                  `}>
                  <BookBadgeRenderer
                    type={type}
                    wrapperCSS={css``}
                    isWaitFree={book.detail?.series?.property.is_wait_free}
                    discountPercentage={
                      book.detail?.price_info?.buy.discount_percentage || 0
                    }
                  />
                </div>
                <FreeBookRenderer
                  freeBookCount={
                    book.detail?.series?.price_info?.buy?.free_book_count || 0
                  }
                />
                <SetBookRenderer
                  setBookCount={book.detail?.setbook?.member_books_count}
                />
              </ThumbnailRenderer>
            </ThumbnailWrapper>
            {/* Todo show sentence */}
            {book.detail && type === DisplayType.HotRelease && (
              <BookMeta book={book.detail} />
            )}
            {book.detail && type === DisplayType.TodayRecommendation && (
              <div
                css={[
                  css`
                    padding-left: 14px;
                    margin-top: 2px;
                    font-size: 13px;
                    line-height: 16px;
                    text-align: center;
                    font-weight: bold;
                    white-space: nowrap;
                    ${orBelow(
                      BreakPoint.LG,
                      css`padding-left: 13px;
   display: flex;
    width: 120px;
    justify-content: center;
}`,
                    )};
                  `,
                  theme === 'dark' &&
                    css`
                      color: white;
                    `,
                ]}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: (book as HotRelease).sentence.replace(
                      /(?:\r\n|\r|\n)/g,
                      '<br />',
                    ),
                  }}
                />
              </div>
            )}
          </PortraitBook>
        ))}
      </BookList>
      <form
        css={css`
          @media (hover: none) {
            display: none;
          }
        `}>
        <Arrow
          onClickHandler={moveLeft}
          label={'이전'}
          color={theme}
          side={'left'}
          wrapperStyle={[
            css`
              left: 5px;
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
    </div>
  );
};

export default RecommendedBookList;
