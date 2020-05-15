import { css } from '@emotion/core';
import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import {
  dodgerBlue50,
  orange40,
  red40,
  slateGray20,
  slateGray40,
  slateGray50,
  slateGray60,
} from '@ridi/colors';
import * as React from 'react';
import Link from 'next/link';

import { getEscapedNode } from 'src/utils/highlight';
import { constructSearchDesc } from 'src/utils/books';
import { computeSearchBookTitle } from 'src/utils/bookTitleGenerator';
import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import * as SearchTypes from 'src/types/searchResults';
import { AuthorsInfo } from 'src/types/searchResults';
import * as BookApi from 'src/types/book';
import { AuthorRole } from 'src/types/book';
import Star from 'src/svgs/Star.svg';
import ThumbnailWithBadge from 'src/components/Book/ThumbnailWithBadge';
import { lineClamp } from 'src/styles';
import { useBookSelector } from 'src/hooks/useBookDetailSelector';

const StyledThumbnailWithBadge = styled(ThumbnailWithBadge)`
  width: 100px;
  ${orBelow(BreakPoint.LG, 'width: 80px;')}
`;

const SearchBookTitle = styled.h3`
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.36em;
  a:active {
    text-decoration-line: underline;
  }
  ${lineClamp(2)}
`;

const SearchBookMetaList = styled.ul`
  display: flex;
  margin-bottom: 6px;
  ${orBelow(BreakPoint.LG, 'flex-direction: column; margin-bottom: 4px;')};
`;

const SearchBookMetaItem = styled.li`
  margin-bottom: 4px;
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    `
      margin-bottom: 0;
      :not(:last-of-type)::after {
        content: '|';
        color: ${slateGray20};
        margin: 0 8px;
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

const starColors = {
  orange: orange40,
  gray: slateGray20,
};

const StyledStar = styled(Star, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'fill',
})<{ color: 'orange' | 'gray' }>`
  margin-right: 2px;
  fill: ${(props) => starColors[props.color]};
`;
const authorStyle = css`
  color: ${slateGray60};
  font-size: 14px;
`;
const normalFieldStyle = css`
  color: ${slateGray50};
  font-size: 13px;
`;
const ratingStyle = css`
  color: ${orange40};
  font-size: 13px;
  font-weight: bold;
`;

const ratingCountStyle = css`
  color: ${slateGray40};
  font-size: 12px;
`;

const fieldStyles = {
  author: authorStyle,
  normal: normalFieldStyle,
  rating: ratingStyle,
  rating_count: ratingCountStyle,
};

const SearchBookMetaField = styled.span<{
  type: 'author' | 'normal' | 'rating' | 'rating_count';
}>`
  line-height: 1.36em;
  a:active {
    text-decoration-line: underline;
  }
  ${(props) => fieldStyles[props.type]}
`;

const ThumbnailAnchor = styled.a`
  flex: none;
`;

const BookDesc = styled.p`
  max-width: 836px;
  font-size: 13px;
  margin-bottom: 6px;
  color: ${slateGray60};
  line-height: 1.4em;
  word-break: keep-all;
  ${orBelow(BreakPoint.LG, 'display: none;')}
`;

function StarCount(props: { count: number }) {
  return (
    <SearchBookMetaField type="rating_count">
      (
      {props.count.toLocaleString('ko-KR')}
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
  line-height: 18px;
`;
const PriceTitle = styled.dt`
  margin-right: 4px;
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

const SearchBookMetaWrapper = styled.div`
   display: flex;
   flex-direction: column;
   margin-left: 16px;
   > dl {
    margin-bottom: 4px;
  }
   width: 100%;
`;

function PriceLabel(props: {
  title: string;
  price: number;
  discount?: number;
  regularPrice: number;
}) {
  const {
    title,
    price,
    discount = 0,
    regularPrice,
  } = props;
  return (
    <PriceItem>
      <PriceTitle>{title}</PriceTitle>
      <dd>
        <Price>{price === 0 ? '무료' : `${price.toLocaleString('ko-KR')}원`}</Price>
        {' '}
        {discount > 0 && (
          <>
            <Discount>
              (
              {Math.ceil(discount)}
              %↓)
            </Discount>
            {' '}
            <OriginalPrice>
              {regularPrice.toLocaleString('ko-KR')}
              원
            </OriginalPrice>
          </>
        )}
      </dd>
    </PriceItem>
  );
}

export function PriceInfo(props: {
  searchApiResult: SearchTypes.SearchBookDetail;
  bookApiResult: BookApi.ClientBook;
  genre: string;
}) {
  const { searchApiResult, bookApiResult, genre } = props;
  if (!props.bookApiResult) {
    return null;
  }
  const {
    property: { is_trial },
    price_info,
  } = bookApiResult;
  const { price, series_prices_info } = searchApiResult;

  const seriesPriceInfo: Record<string, SearchTypes.SeriesPriceInfo> = {};
  series_prices_info.forEach((info) => {
    seriesPriceInfo[info.type] = info;
  });
  // 체험판 부터 거른다.
  if (is_trial) {
    return <PriceLabel title="구매" price={0} discount={0} regularPrice={0} />;
  }
  // 진정한 무료 책
  if (!seriesPriceInfo.normal && price === 0 && price_info?.buy?.price === 0) {
    return <PriceLabel title="구매" price={0} discount={0} regularPrice={0} />;
  }
  if (price_info && price !== 0) {
    return (
      <>
        {price_info.rent && (
          <PriceLabel
            title="대여"
            price={
              price_info.rent.price === 0 && seriesPriceInfo.rent
                ? seriesPriceInfo.rent.min_nonzero_price
                : price_info.rent.price
            }
            discount={
              price_info.rent.discount_percentage === 100
                ? 0
                : price_info.rent.discount_percentage
            }
            regularPrice={price_info.rent.regular_price}
          />
        )}
        <PriceLabel
          title="구매"
          price={
            seriesPriceInfo.normal && genre !== 'general'
              ? Math.min(price, seriesPriceInfo.normal.min_nonzero_price)
              : price
          }
          discount={price_info.buy ? price_info.buy.discount_percentage : 0}
          regularPrice={price_info.buy?.regular_price ?? 0}
        />
      </>
    );
  }
  if (seriesPriceInfo && price === 0) {
    return (
      <>
        {seriesPriceInfo.rent && (
          <PriceLabel
            title="대여"
            price={seriesPriceInfo.rent.min_nonzero_price}
            discount={0}
            regularPrice={price_info?.rent?.regular_price ?? 0}
          />
        )}
        {seriesPriceInfo.normal && (
          <PriceLabel
            title="구매"
            price={
              seriesPriceInfo.normal.min_price !== 0
                ? Math.min(
                  seriesPriceInfo.normal.min_nonzero_price,
                  seriesPriceInfo.normal.min_price,
                )
                : seriesPriceInfo.normal.min_nonzero_price
            }
            regularPrice={price_info?.buy?.regular_price ?? 0}
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

type RenderCategoryNameProps = Pick<
  SearchTypes.SearchBookDetail,
  | 'category_name'
  | 'parent_category_name'
  | 'parent_category_name2'
>;

function RenderCategoryName(props: RenderCategoryNameProps) {
  const {
    category_name,
    parent_category_name,
    parent_category_name2,
  } = props;

  if (!parent_category_name && !parent_category_name2) {
    return <span>{category_name}</span>;
  }
  if (parent_category_name && !parent_category_name2) {
    return <span>{parent_category_name}</span>;
  }
  if (!parent_category_name && parent_category_name2) {
    return <span>{parent_category_name2}</span>;
  }
  if (parent_category_name && parent_category_name === parent_category_name2) {
    return <span>{parent_category_name}</span>;
  }

  return (
    <span>
      {parent_category_name}
      {', '}
      {parent_category_name2}
    </span>
  );
}

const SkeletonBook = styled.div`
  background: linear-gradient(327.23deg, #F8F9FB 1.42%, #F1F1F3 49.17%, #F8F9FB 100%);
  flex: none;
  width: 100px;
  height: 140px;
  ${orBelow(BreakPoint.LG, 'width: 80px; height: 110px')}
`;

const SkeletonBar = styled.div<{width: string}>`
  background: linear-gradient(327.23deg, #F8F9FB 1.42%, #F1F1F3 49.17%, #F8F9FB 100%);
  width: ${(props) => props.width};
  height: 20px;
  margin-bottom: 8px;
`;

function RenderAuthors(props: { authors: AuthorsInfo[]; fallback: string }) {
  const { authors, fallback } = props;
  if (authors.length === 0) {
    return (
      <a href={`/search?${fallback}`}>{fallback}</a>
    );
  }
  if (authors.length === 1) {
    return (
      <a href={`/author/${authors[0].author_id}`}>{authors[0].name}</a>
    );
  }
  return (
    <>
      <a href={`/author/${authors[0].author_id}`}>{authors[0].name}</a>
      {', '}
      <a href={`/author/${authors[1].author_id}`}>{authors[1].name}</a>
      {authors.length > 2 && ` 외 ${authors.length - 2}명`}
    </>
  );
}

export function SearchLandscapeBook(props: SearchLandscapeBookProps) {
  const { item, title } = props;
  const book = useBookSelector(item.b_id);
  if (book === null) {
    return (
      <>
        <SkeletonBook />
        <SearchBookMetaWrapper>
          <SkeletonBar width="100%" />
          <SkeletonBar width="130px" />
        </SearchBookMetaWrapper>
      </>
    );
  }
  if (book.is_deleted) {
    return null;
  }
  const categoryInfo = {
    category: item.category,
    category_name: item.category_name,
    parent_category: item.parent_category,
    parent_category2: item.parent_category2,
    parent_category_name: item.parent_category_name,
    parent_category_name2: item.parent_category_name2,
  };
  const rawDesc = book.clientBookFields?.desc;
  const clearDesc = rawDesc ? constructSearchDesc(rawDesc) : '';
  // 대여 배지 표기 여부가 장르에 따라 바뀌기 때문에 장르를 모아둠
  const genres = book.categories.map((category) => category.sub_genre) ?? ['general'];
  let translator: AuthorsInfo | undefined;
  const authors: AuthorsInfo[] = [];
  item.authors_info.forEach((author) => {
    if (author.role === AuthorRole.TRANSLATOR) {
      translator = author;
    } else {
      authors.push(author);
    }
  });
  return (
    <>
      <ThumbnailAnchor href={`/books/${item.b_id}`}>
        <StyledThumbnailWithBadge
          bId={item.b_id}
          genre={genres[0] ?? ''}
          slug="search-result"
          sizes="(min-width: 999px) 100px, 80px"
          title={title}
        />
      </ThumbnailAnchor>
      <SearchBookMetaWrapper>
        <SearchBookTitle>
          <a href={`/books/${item.b_id}`}>
            {getEscapedNode(computeSearchBookTitle(item))}
          </a>
        </SearchBookTitle>
        <SearchBookMetaList>
          <SearchBookMetaItem>
            <SearchBookMetaField type="author">
              <RenderAuthors authors={authors} fallback={item.author} />
            </SearchBookMetaField>
          </SearchBookMetaItem>
          {translator && (
            <SearchBookMetaItem>
              <SearchBookMetaField type="normal">
                <a href={`/author/${translator.author_id}`}>
                  {translator.name}
                  {' '}
                  역
                </a>
              </SearchBookMetaField>
            </SearchBookMetaItem>
          )}
          <SearchBookMetaItem>
            {item.buyer_rating_score > 0 ? (
              <>
                <StyledStar color="orange" />
                <SearchBookMetaField type="rating">
                  {item.buyer_rating_score.toFixed(1)}
                  점
                  {' '}
                </SearchBookMetaField>
              </>
            ) : (
              <StyledStar color="gray" />
            )}
            <StarCount count={item.buyer_rating_count} />
          </SearchBookMetaItem>
          <SearchBookMetaItem>
            <SearchBookMetaField type="normal">
              <Link href={`/search?q=${encodeURIComponent(`출판사:${item.publisher}`)}`}>
                <a>
                  {item.highlight.publisher
                    ? getEscapedNode(item.highlight.publisher)
                    : item.publisher}
                </a>
              </Link>
            </SearchBookMetaField>
          </SearchBookMetaItem>
          <SearchBookMetaItem>
            <SearchBookMetaField type="normal">
              <RenderCategoryName {...categoryInfo} />
            </SearchBookMetaField>
          </SearchBookMetaItem>
          {item.book_count > 1 && book.categories[0].is_series_category && (
            <SearchBookMetaItem>
              <SearchBookMetaField type="normal">
                {`총 ${book.series?.price_info?.buy?.total_book_count || item.book_count}${book.series?.property.unit || '권'}`}
              </SearchBookMetaField>
              {item.series_prices_info.length > 0 && book.series?.property.is_serial_complete && (
                <SeriesCompleted>완결</SeriesCompleted>
              )}
            </SearchBookMetaItem>
          )}
        </SearchBookMetaList>
        <a href={`/books/${item.b_id}`}>
          <BookDesc>
            {clearDesc.length > 170 ? `${clearDesc.slice(0, 170)}...` : clearDesc}
          </BookDesc>
        </a>
        <PriceInfo
          searchApiResult={item}
          bookApiResult={book}
          genre={genres[0] ?? ''}
        />
      </SearchBookMetaWrapper>
    </>
  );
}
