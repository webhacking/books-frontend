import { css } from '@emotion/core';
import {
  between, BreakPoint, greaterThanOrEqualTo, orBelow,
} from 'src/utils/mediaQuery';
import { DisplayType, MdBook } from 'src/types/sections';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import BookMeta from 'src/components/BookMeta/BookMeta';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import { sendClickEvent, useEventTracker } from 'src/hooks/useEventTracker';
import { Tracker } from '@ridi/event-tracker';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { AdultBadge } from 'src/components/Badge/AdultBadge';
import styled from '@emotion/styled';
import { BadgeContainer } from 'src/components/Badge/BadgeContainer';

interface MultipleLineBooks {
  items: MdBook[];
  title: string;
  genre: string;
  slug: string;
}

interface MultipleLineBookItemProps {
  genre: string;
  item: MdBook;
  slug: string;
  order: number;
  tracker: Tracker;
}

const bookWidthStyles = css`
  width: 140px;
  @media (max-width: 999px) {
    width: 120px;
  }
  @media (max-width: 432px) {
    width: 100%;
  }
`;

const Item = styled.li`
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

const thumbnailOverrideStyle = css`
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
      img {
        width: 140px;
      }
    `,
  )};
`;

const ItemAnchor = styled.a`
  display: inline-block;
`;

const bookMetaWrapperStyle = css`
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
`;

const MultipleLineBookItem: React.FC<MultipleLineBookItemProps> = React.memo((props) => {
  const {
    item, genre, slug, order, tracker,
  } = props;

  const trackerEvent = useCallback(() => {
    sendClickEvent(tracker, item, slug, order);
  }, []);
  return (
    <Item>
      <ThumbnailWrapper css={thumbnailOverrideStyle}>
        <ItemAnchor
          onClick={trackerEvent}
          href={`/books/${item.b_id}`}
        >
          <ThumbnailRenderer
            order={order}
            className={slug}
            slug={slug}
            css={bookWidthStyles}
            sizes="(max-width: 999px) 120px, 140px"
            book={{ b_id: item.b_id, detail: item.detail }}
            imgSize="large"
          >
            <BadgeContainer>
              <BookBadgeRenderer
                type={DisplayType.RecommendedBook}
                isWaitFree={item.detail?.series?.property.is_wait_free}
                discountPercentage={getMaxDiscountPercentage(item.detail)}
              />
            </BadgeContainer>
            <FreeBookRenderer
              freeBookCount={
                item.detail?.series?.price_info?.rent?.free_book_count
                || item.detail?.series?.price_info?.buy?.free_book_count
                || 0
              }
              unit={item.detail?.series?.property.unit || '권'}
            />
            {item.detail?.property?.is_adult_only && <AdultBadge />}
          </ThumbnailRenderer>
        </ItemAnchor>
      </ThumbnailWrapper>
      {item.detail && (
        <BookMeta
          book={item.detail}
          showTag={['bl', 'bl-serial'].includes(genre)}
          wrapperCSS={bookMetaWrapperStyle}
          showRating
          isAIRecommendation={false}
        />
      )}
    </Item>
  );
});

const Section = styled.section`
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

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  flex: none;
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
`;

const ItemList: React.FC<{ slug: string; genre: string; books: MdBook[] }> = (props) => {
  const { slug, genre, books } = props;
  const [, setMounted] = useState(false);
  const [tracker] = useEventTracker();
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <List>
      {books
        .filter((book) => book.detail)
        .slice(0, 18)
        .map((item, index) => (
          <MultipleLineBookItem
            order={index}
            slug={slug}
            key={index}
            genre={genre}
            item={item}
            tracker={tracker}
          />
        ))}
    </List>
  );
};

const Title = styled.h2`
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
`;

export const MultipleLineBooks: React.FC<MultipleLineBooks> = (props) => {
  const {
    title, items, genre, slug,
  } = props;
  const [books] = useBookDetailSelector(items);
  const targetRef = useRef(null);
  return (
    <Section ref={targetRef}>
      <Title aria-label={title}>{title}</Title>
      <ItemList genre={genre} slug={slug} books={books as MdBook[]} />
    </Section>
  );
};
