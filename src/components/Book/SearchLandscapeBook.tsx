import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import { getEscapedNode } from 'src/utils/highlight';
import { css } from '@emotion/core';
import { computeSearchBookTitle } from 'src/utils/bookTitleGenerator';
import {
  dodgerBlue50,
  orange40, red40,
  slateGray20,
  slateGray40,
  slateGray50,
  slateGray60,
} from '@ridi/colors';
import Link from 'next/link';
import * as React from 'react';
import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import * as SearchTypes from 'src/types/searchResults';
import * as BookApi from 'src/types/book';
import styled from '@emotion/styled';
import Star from 'src/svgs/Star.svg';
import isPropValid from '@emotion/is-prop-valid';
import ThumbnailWithBadge from 'src/components/Book/ThumbnailWithBadge';

const StyledThumbnailWithBadge = styled(ThumbnailWithBadge)`
  width: 100px;
  ${orBelow(BreakPoint.LG, 'width: 80px;')}
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

const PriceItem = styled.dl`
  display: flex;
  align-items: center;
  height: 18px;
`;
const priceBase = css`
  font-size: 13px;
  line-height: 18px;;
`;
const PriceTitle = styled.dt`
  margin-right: 2px;
  color: ${slateGray60};
  ${priceBase}
`;

const Price = styled.span`
  color: ${dodgerBlue50};
  font-weight: bold;
  ${priceBase}
`;

const Discount = styled.span`
  color: ${red40};
  font-weight: bold;
  ${priceBase}
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: ${slateGray50};
  ${priceBase}
`;

function PriceLabel(props: { title: string; price: number; discount?: number }) {
  const { title, price, discount = 0 } = props;
  return (
    <PriceItem>
      <PriceTitle>{title}</PriceTitle>
      <dd>
        <Price>
          { Math.min(price, price - price * (discount / 100))}
          원
        </Price>
        {' '}
        {discount > 0 && (
        <Discount>
          (
          {discount}
          %↓)
        </Discount>
        )}
        {' '}
        {discount > 0 && <OriginalPrice>{price}</OriginalPrice>}
      </dd>
    </PriceItem>
  );
}

function PriceInfo(props: {
  seriesPriceInfo: SearchTypes.SeriesPriceInfo[];
  book: BookApi.ClientBook | null;
}) {
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
        {seriesPriceInfo.rent && (
          <PriceLabel
            title="대여"
            price={
              seriesPriceInfo.rent.min_price !== 0
                ? seriesPriceInfo.rent.min_price
                : seriesPriceInfo.rent.max_price
            }
          />
        )}
        {seriesPriceInfo.normal && (
          <PriceLabel
            title="구매"
            price={
              seriesPriceInfo.normal.min_price !== 0
                ? seriesPriceInfo.normal.min_price
                : seriesPriceInfo.normal.max_price
            }
          />
        )}
      </>
    );
  }
  if (props.book?.price_info) {
    const { buy = null, rent = null } = props.book.price_info;
    return (
      <>
        {rent && <PriceLabel title="대여" price={rent.regular_price} discount={rent.discount_percentage} />}
        {buy && (
          <PriceLabel
            title="구매"
            price={buy.regular_price}
            discount={buy.discount_percentage}
          />
        )}
      </>
    );
  }
  return null;
}

interface SearchLandscapeBookProps {
  item: SearchTypes.SearchBookDetail;
  title: string;
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
  const { item, title } = props;
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
      <StyledThumbnailWithBadge
        bId={thumbnailId}
        bookDetail={book}
        genre="general"
        slug="search-result"
        sizes="(min-width: 999px) 100px, 80px"
        title={title}
      />
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
              {parent_category_name && (
                <a href={`/category/${parent_category}`}>{parent_category_name}</a>
              )}
              {parent_category_name2 && parent_category_name2 !== parent_category_name && (
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
              {item.series_prices_info.length > 0 && item.is_series_complete && (
                <SeriesCompleted>완결</SeriesCompleted>
              )}
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
