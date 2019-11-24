import * as React from 'react';
import { css, SerializedStyles } from '@emotion/core';
import { lineClamp } from 'src/styles';
import StarRating from 'src/components/StarRating/StarRating';
import Tag from 'src/components/Tag/Tag';
import * as BookApi from 'src/types/book';
import { StarRating as StarRatingType } from 'src/types/sections';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const bookTitleCSS = css`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.33em;
  color: #000000;
  max-height: 2.7em;
  margin-bottom: 4.5px;
`;

const bookMetaCSS = css`
  display: flex;
  flex-direction: column;
  padding-left: 7px;
`;

const authorCSS = css`
  height: 19px;
  font-size: 14px;
  line-height: 1.36;
  color: #808991;
  margin-bottom: 2px;
  ${lineClamp(1)};
`;

interface BookMetaProps {
  book: BookApi.Book;
  titleLineClamp?: number;
  showRating: boolean;
  showSomeDeal?: boolean;
  isAIRecommendation?: boolean;
  showTag: boolean;
  width?: string;
  wrapperCSS?: SerializedStyles;
  ratingInfo?: StarRatingType;
}

interface RenderBookTagProps {
  isNovel: boolean;
  isComic: boolean;
}

const RenderBookTag: React.FC<RenderBookTagProps> = props => {
  const { isComic, isNovel } = props;
  if (isComic) {
    return <Tag.Comic />;
  }
  if (isNovel) {
    return <Tag.Novel />;
  }
  return null;
};

const BookMeta: React.FC<BookMetaProps> = props => {
  const {
    book: {
      authors_ordered,
      property: { is_somedeal, is_novel },
      file: { is_comic, is_comic_hd },
    },
    // isAIRecommendation,
    showTag,
    titleLineClamp,
    showSomeDeal,
    showRating,
    wrapperCSS,
    ratingInfo,
  } = props;

  return (
    <>
      <div
        css={[
          bookMetaCSS,
          props.width
            ? css`
                width: ${props.width};
              `
            : css`
                width: 100%;
              `,
          wrapperCSS,
        ]}>
        {/* Fixme available anchor */}
        <a
          css={css`
            display: inline-block;
          `}
          href={new URL(
            `/books/${props.book.id}`,
            publicRuntimeConfig.STORE_HOST,
          ).toString()}>
          <h2
            css={css`
              ${bookTitleCSS};
              ${lineClamp(titleLineClamp || 2)}
            `}>
            {bookTitleGenerator(props.book)}
          </h2>
        </a>
        {/* Todo Author Anchor Generator */}
        <span css={authorCSS}>{authors_ordered[0].name}</span>
        {showRating && ratingInfo && (
          <>
            <span
              css={css`
                margin-bottom: 6px;
              `}>
              <StarRating
                totalReviewer={ratingInfo.buyer_rating_count}
                rating={ratingInfo.buyer_rating_score || 0}
              />
            </span>
          </>
        )}
        <>
          <span
            css={css`
              display: flex;
            `}>
            {showTag && (
              <RenderBookTag isComic={is_comic_hd || is_comic} isNovel={is_novel} />
            )}
            {showSomeDeal && is_somedeal && <Tag.SomeDeal />}
          </span>
        </>
      </div>
    </>
  );
};

export default BookMeta;
