import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import { getEscapedNode } from 'src/utils/highlight';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import { css } from '@emotion/core';
import { BadgeContainer } from 'src/components/Badge/BadgeContainer';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import { getMaxDiscountPercentage } from 'src/utils/common';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import { AdultBadge } from 'src/components/Badge/AdultBadge';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import { computeSearchBookTitle } from 'src/utils/bookTitleGenerator';
import {
  orange40,
  slateGray20,
  slateGray40, slateGray50, slateGray60,
} from '@ridi/colors';
import Link from 'next/link';
import * as React from 'react';
import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import * as SearchTypes from 'src/types/searchResults';
import * as BookApi from 'src/types/book';
import styled from '@emotion/styled';
import Star from 'src/svgs/Star.svg';
import isPropValid from '@emotion/is-prop-valid';

const thumbnailOverrideStyle = css`
  width: 100px;
  max-height: calc(100px * 1.618 - 10px);
  ${orBelow(
    BreakPoint.LG,
    `
      width: 80px;
      max-height: calc(80px * 1.618 - 10px);
    `,
  )};
`;


const SearchBookTitle = styled.h4`
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: normal;
`;

const SearchBookMetaList = styled.ul`
  display: flex;
  margin-bottom: 8px;
  ${orBelow(BreakPoint.LG, 'flex-direction: column; margin-bottom: 4px;')};
`;

const SearchBookMetaItem = styled.li`
  margin-bottom: 4px;
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    `
    margin-bottom: 0;
    :not(:last-of-type) {
      ::after {
        content: '|';
        color: ${slateGray20};
        margin: 0 8px;
      }
    }
  `,
  )};
`;

const SeriesCompleted = styled.span`
  padding: 3px 4px;
  background: ${slateGray40};
  color: white;
  font-size: 10px;
  font-weight: bold;
  margin-left: 4px;
  height: 16px;
  border-radius: 3px;
  position: relative;
  top: -1px;
`;

const StyledStar = styled(Star, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'fill',
})<{ fill: string }>`
  margin-right: 2px;
  fill: ${(props) => props.fill};
`;

const SearchBookMetaField = styled.span<{
  color: string;
  fontSize: string;
  weight?: string;
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => (props.weight ? props.weight : 'normal')};
`;

const BookDesc = styled.p`
  max-width: 836px;
  font-size: 13px;
  margin-bottom: 8px;
  color: ${slateGray60};
  ${orBelow(BreakPoint.LG, 'display: none;')}
`;


function StarCount(props: { count: number }) {
  return (
    <SearchBookMetaField color={slateGray40} fontSize="12px">
      (
      {props.count}
      )
    </SearchBookMetaField>
  );
}

function PriceInfo(props: { seriesPriceInfo: SearchTypes.SeriesPriceInfo[]; book: BookApi.ClientBook | null }) {
  if (!props.book) {
    return null;
  }
  const seriesPriceInfo: Record<string, SearchTypes.SeriesPriceInfo> = {};
  props.seriesPriceInfo.forEach((info) => {
    seriesPriceInfo[info.type] = info;
  });
  if (seriesPriceInfo.rent || seriesPriceInfo.normal) {
    return (
      <>
        { seriesPriceInfo.rent
        && (
          <dl>
            <dt>대여</dt>
            <dd>{ seriesPriceInfo.rent.min_price !== 0 ? seriesPriceInfo.rent.min_price : seriesPriceInfo.rent.max_price }</dd>
            {' '}
          </dl>
        )}
        { seriesPriceInfo.normal && (
          <dl>
            <dt>구매</dt>
            <dd>{seriesPriceInfo.normal.min_price !== 0 ? seriesPriceInfo.normal.min_price : seriesPriceInfo.normal.max_price }</dd>
            {' '}
          </dl>
        )}
      </>
    );
  }
  if (props.book?.price_info) {
    const { buy = null, rent = null } = props.book.price_info;
    return (
      <>
        { rent && (
          <dl>
            <dt>대여</dt>
            <dd>{rent.regular_price}</dd>
          </dl>
        )}
        { buy && (
          <dl>
            <dt>구매</dt>
            <dd>
              {buy.regular_price}
              {' '}
              {buy.discount_percentage}
            </dd>
          </dl>
        )}
      </>
    );
  }
  return null;
}

interface SearchLandscapeBookProps {
  item: SearchTypes.SearchBookDetail;
  title: string;
  isAdultOnly: boolean;
}

function getLastVolumeId(item: SearchTypes.SearchBookDetail) {
  if (item.is_series_complete || item.book_count === 1) {
    return item.b_id;
  }
  if (item.opened_last_volume_id.length > 0) {
    return item.opened_last_volume_id;
  }
  return item.b_id;
}


export function SearchLandscapeBook(props: SearchLandscapeBookProps) {
  const { item, title, isAdultOnly } = props;
  const thumbnailId = getLastVolumeId(item);
  const { books } = useSelector((state: RootState) => state);
  const {
    parent_category,
    parent_category2,
    parent_category_name,
    parent_category_name2,
  } = item;
  const book = books.items[item.b_id];
  const desc = book?.clientBookFields?.desc?.intro?.replace(/[\r\n]/g, ' ') ?? '';
  const escapedDesc = getEscapedNode(desc);
  return (
    <>
      <ThumbnailRenderer
        wrapperStyle={css`height: 100%;`}
        css={thumbnailOverrideStyle}
        thumbnailId={thumbnailId}
        isAdultOnly={isAdultOnly}
        imgSize="large"
        sizes="(min-width: 999px) 100px, 80px"
        title={title}
      >
        {/* Todo 기다무, 할인율 배지 */}
        <BadgeContainer>
          <BookBadgeRenderer
            isRentable={item.is_rental}
            discountPercentage={getMaxDiscountPercentage(book)}
            isWaitFree={item.is_wait_free}
          />
        </BadgeContainer>
        {item.is_setbook && <SetBookRenderer setBookCount={item.setbook_count} />}
        {isAdultOnly && <AdultBadge />}
        <FreeBookRenderer
          freeBookCount={
            book?.series?.price_info?.rent?.free_book_count
            || book?.series?.price_info?.buy?.free_book_count
            || 0
          }
          unit={book?.series?.property.unit || '권'}
        />
      </ThumbnailRenderer>
      <div
        css={css`
          flex: none;
          display: flex;
          flex-direction: column;
          margin-left: 16px;
        `}
      >
        <SearchBookTitle>{getEscapedNode(computeSearchBookTitle(item))}</SearchBookTitle>
        <SearchBookMetaList>
          <SearchBookMetaItem>
            <SearchBookMetaField color={slateGray60} fontSize="14px">
              {item.highlight.author
                ? getEscapedNode(item.highlight.author)
                : item.author}
            </SearchBookMetaField>
          </SearchBookMetaItem>
          {item.translator.length > 0 && (
            <SearchBookMetaItem>
              <SearchBookMetaField color={slateGray50} fontSize="13px">
                {item.highlight.translator
                  ? getEscapedNode(item.highlight.translator)
                  : item.translator}
                {' '}
                역
              </SearchBookMetaField>
            </SearchBookMetaItem>
          )}
          {/* Todo Star Rating */}
          <SearchBookMetaItem>
            {item.buyer_rating_score > 0 ? (
              <>
                <StyledStar fill={orange40} />
                <SearchBookMetaField color={orange40} fontSize="13px" weight="bold">
                  {item.buyer_rating_score}
                  점
                  {' '}
                </SearchBookMetaField>
              </>
            ) : (
              <StyledStar fill={slateGray20} />
            )}
            <StarCount count={item.buyer_rating_count} />
          </SearchBookMetaItem>
          <SearchBookMetaItem>
            <SearchBookMetaField color={slateGray50} fontSize="13px">
              <Link href={`/search?q=출판사%3A${item.publisher}`}>
                <a>
                  {item.highlight.publisher
                    ? getEscapedNode(item.highlight.publisher)
                    : item.publisher}
                </a>
              </Link>
            </SearchBookMetaField>
          </SearchBookMetaItem>
          <SearchBookMetaItem>
            <SearchBookMetaField color={slateGray50} fontSize="13px">
              {parent_category_name && <a href={`/category/${parent_category}`}>{parent_category_name}</a>}
              {parent_category_name2 && parent_category_name2 !== parent_category_name
              && (
                <>
                  <span>, </span>
                  <a href={`category/${parent_category2}`}>{parent_category_name2}</a>
                </>
              )}
            </SearchBookMetaField>
          </SearchBookMetaItem>
          {item.book_count > 1 && (
            <SearchBookMetaItem>
              <SearchBookMetaField color={slateGray50} fontSize="13px">
                {`총 ${item.book_count}권`}
              </SearchBookMetaField>
              {
                item.series_prices_info.length > 0 && item.is_series_complete && <SeriesCompleted>완결</SeriesCompleted>
              }
            </SearchBookMetaItem>
          )}
        </SearchBookMetaList>
        <BookDesc>
          {/* Todo 170 글자 제한 후 말줄임표 추가 */}
          {escapedDesc}
        </BookDesc>
        <PriceInfo seriesPriceInfo={item.series_prices_info} book={book} />
      </div>
    </>
  );
}
