import { css } from '@emotion/core';
import { between, BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import { DisplayType, MdBook } from 'src/types/sections';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import BookMeta from 'src/components/BookMeta/BookMeta';
import React, { useEffect, useRef, useState } from 'react';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import getConfig from 'next/config';
import {
  sendClickEvent,
  useEventTracker,
  useSendDisplayEvent,
} from 'src/hooks/useEveneTracker';
import { Tracker } from '@ridi/event-tracker';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { useMultipleIntersectionObserver } from 'src/hooks/useMultipleIntersectionObserver';

const { publicRuntimeConfig } = getConfig();
interface MultipleLineBooks {
  items: MdBook[];
  title: string;
  genre: string;
  slug: string;
}

interface MultipleLineBookItemProps {
  genre: string;
  item: MdBook;
  isIntersecting: boolean;
  slug: string;
  order: number;
  tracker: Tracker;
}

const itemCSS = css`
  ${orBelow(
    426,
    css`
      margin-right: 3px;
      :not(:nth-of-type(3n)) {
        margin-right: 20px;
      }
      width: 22%;
    `,
  )};
  ${orBelow(
    432,
    css`
      margin-right: 3px;
      :not(:nth-of-type(3n)) {
        margin-right: 20px;
      }
      width: 27%;
    `,
  )};
  ${between(
    433,
    579,
    css`
      :not(:nth-of-type(3n)) {
        margin-right: 4%;
      }
      width: 120px;
    `,
  )};
  ${between(
    580,
    833,
    css`
      :not(:nth-of-type(3n)) {
        margin-right: 16%;
      }
      width: 120px;
    `,
  )};
  ${between(
    850,
    BreakPoint.LG,
    css`
      :not(:nth-of-type(6n)) {
        margin-right: 2.1%;
      }
      width: 120px;
    `,
  )};
  ${greaterThanOrEqualTo(
    1001,
    css`
      :not(:nth-of-type(6n)) {
        //margin-right: 20px;
        flex-grow: 0;
      }
      margin: 0 1px 20px 1px;
      width: 140px;
    `,
  )};
  margin-bottom: 24px;
`;

const MultipleLineBookItem: React.FC<MultipleLineBookItemProps> = props => {
  const { item, genre, isIntersecting, slug, order, tracker } = props;
  return (
    <li css={itemCSS}>
      <ThumbnailWrapper
        css={css`
          ${orBelow(
            BreakPoint.SM,
            css`
              width: 100%;
              min-width: 70px;
              height: calc(90px * 1.618 - 10px);
            `,
          )};
          ${between(
            BreakPoint.SM + 1,
            BreakPoint.M,
            css`
              width: 100%;
              min-width: 100px;
              height: calc(100px * 1.618 - 10px);
            `,
          )};

          ${between(
            BreakPoint.M + 1,
            BreakPoint.MD,
            css`
              width: 120px;
            `,
          )};
          ${between(
            BreakPoint.MD + 1,
            BreakPoint.LG,
            css`
              width: 120px;
            `,
          )};
          ${greaterThanOrEqualTo(
            BreakPoint.LG + 1,
            css`
              width: 140px;
            `,
          )};
        `}>
        <div
          css={css`
            ${greaterThanOrEqualTo(
              BreakPoint.LG,
              css`
                img {
                  width: 140px;
                }
              `,
            )}
          `}>
          <a
            css={css`
              display: inline-block;
            `}
            onClick={sendClickEvent.bind(null, tracker, item, slug, order)}
            href={new URL(
              `/books/${item.b_id}`,
              publicRuntimeConfig.STORE_HOST,
            ).toString()}>
            <ThumbnailRenderer
              order={order}
              className={slug}
              slug={slug}
              book={{ b_id: item.b_id, detail: item.detail }}
              imgSize={'xlarge'}
              isIntersecting={isIntersecting}>
              <div
                css={css`
                  position: absolute;
                  display: block;
                  top: -7px;
                  left: -7px;
                `}>
                <BookBadgeRenderer
                  type={DisplayType.RecommendedBook}
                  wrapperCSS={css``}
                  isWaitFree={item.detail?.series?.property.is_wait_free}
                  discountPercentage={getMaxDiscountPercentage(item.detail)}
                />
              </div>
              <FreeBookRenderer
                freeBookCount={
                  item.detail?.series?.price_info?.rent?.free_book_count ||
                  item.detail?.series?.price_info?.buy?.free_book_count ||
                  0
                }
                unit={item.detail?.series?.property.unit || '권'}
              />
            </ThumbnailRenderer>
          </a>
        </div>
      </ThumbnailWrapper>
      {item.detail && (
        <BookMeta
          book={item.detail}
          showTag={['bl', 'bl-serial'].includes(genre)}
          wrapperCSS={css`
            ${between(
              BreakPoint.M + 1,
              BreakPoint.LG,
              css`
                width: 120px;
              `,
            )}
            ${greaterThanOrEqualTo(
              BreakPoint.LG + 1,
              css`
                width: 140px;
              `,
            )}
          `}
          showRating={true}
          isAIRecommendation={false}
        />
      )}
    </li>
  );
};

const multipleLineSectionCSS = css`
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 24px;
  padding-top: 24px;
  ${orBelow(
    433,
    css`
      justify-content: space-between;
      padding: 16px 10px;
      padding-right: 29px !important;
    `,
  )}
  ${orBelow(
    BreakPoint.LG,
    css`
      padding-left: 20px;
      padding-right: 26px;
      padding-top: 16px;
      padding-bottom: 16px;
    `,
  )}
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      padding-left: 24px;
    `,
  )}
`;

const ItemList: React.FC<any> = props => {
  const { isIntersecting, slug, genre, books } = props;
  const ref = useRef<HTMLUListElement>(null);
  const [isMounted, setMounted] = useState(false);
  const [tracker] = useEventTracker();
  const sendDisplayEvent = useSendDisplayEvent(slug);
  useMultipleIntersectionObserver(ref, slug, sendDisplayEvent, isMounted);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ul
      ref={ref}
      css={css`
          display: flex;
          flex-wrap: wrap;
          flex-shrink: 0;
          justify-content: space-around;
          margin-bottom: -24px;
          ${orBelow(
            432,
            css`
              justify-content: space-between;
              margin-left: -10px;
            `,
          )};
           ${between(
             BreakPoint.M + 1,
             BreakPoint.MD,
             css`
               justify-content: space-between;
               margin-left: -10px;
             `,
           )}
          ${between(
            BreakPoint.MD + 1,
            BreakPoint.LG,
            css`
              justify-content: space-between;
              margin-left: -6px;
            `,
          )}
          ${greaterThanOrEqualTo(
            BreakPoint.LG + 1,
            css`
              left: -19px;
              position: relative;
            `,
          )}
        `}>
      {(books as MdBook[]).slice(0, 18).map((item, index) => (
        <MultipleLineBookItem
          order={index}
          slug={slug}
          key={index}
          genre={genre}
          item={item}
          isIntersecting={isIntersecting}
          tracker={tracker}
        />
      ))}
    </ul>
  );
};

export const MultipleLineBooks: React.FC<MultipleLineBooks> = props => {
  const { title, items, genre, slug } = props;
  const [books] = useBookDetailSelector(items);
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '-150px');

  return (
    <section ref={targetRef} css={multipleLineSectionCSS}>
      <h2
        aria-label={title}
        css={css`
          font-size: 19px;
          font-weight: normal;
          line-height: 26px;
          margin-bottom: 10px;
          color: #000000;
          word-break: keep-all;
          ${orBelow(
            BreakPoint.MD,
            css`
              margin-left: -2px;
            `,
          )}
        `}>
        <span>{title}</span>
      </h2>
      <ItemList genre={genre} slug={slug} books={books} isIntersecting={isIntersecting} />
    </section>
  );
};
