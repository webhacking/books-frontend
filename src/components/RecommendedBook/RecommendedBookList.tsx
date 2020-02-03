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
import { between, orBelow } from 'src/utils/mediaQuery';
import { AdultBadge } from 'src/components/Badge/AdultBadge';

interface RecommendedBookListProps {
  items: TodayRecommendation[] | HotRelease[];
  type: DisplayType.HotRelease | DisplayType.TodayRecommendation;
  theme: 'dark' | 'white';
  isIntersecting: boolean;
  slug: string;
}

const RecommendedBookList: React.FC<RecommendedBookListProps> = React.memo(props => {
  const ref = useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref);
  const { theme, type, slug } = props;
  const deviceType = useContext(DeviceTypeContext);

  const sendDisplayEvent = useSendDisplayEvent(slug);
  useMultipleIntersectionObserver(ref, slug, sendDisplayEvent);

  return (
    <div
      css={css`
        position: relative;
        margin-top: 6px;
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
          props.type === DisplayType.TodayRecommendation
            ? css`
                padding-left: 23px !important;
              `
            : css`
                padding-left: 13px !important;
              `,
        ]}>
        {props.items
          .filter(book => book.detail)
          .map((book, index) => (
            <PortraitBook
              key={index}
              css={[
                props.type === DisplayType.HotRelease
                  ? css`
                      ${orBelow(
                        833,
                        css`
                          margin-right: 12px !important;
                        `,
                      )}
                      ${between(
                        834,
                        999,
                        css`
                          margin-right: 20px !important;
                        `,
                      )}
                    `
                  : css`
                      ${orBelow(
                        999,
                        css`
                          margin-right: 30px !important;
                          :last-of-type {
                            padding-right: 35px !important;
                          }
                        `,
                      )}
                    `,
              ]}>
              <a
                css={[
                  css`
                    display: inline-block;
                  `,
                ]}
                href={new URL(
                  `/books/${book.b_id}`,
                  publicRuntimeConfig.STORE_HOST,
                ).toString()}>
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
                    <SetBookRenderer
                      setBookCount={book.detail?.setbook?.member_books_count}
                    />
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
                      __html: (book as HotRelease).sentence.replace(
                        /(?:\r\n|\r|\n)/g,
                        '<br />',
                      ),
                    }}
                  />
                </h4>
              )}
            </PortraitBook>
          ))}
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
