import * as React from 'react';
import { css } from '@emotion/core';
import { lineClamp } from 'src/styles';
// import StarRating from 'src/components/StarRating/StarRating';
import Tag from 'src/components/Tag/Tag';
import * as BookApi from 'src/types/book';

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
  width?: string;
}

const BookMeta: React.FC<BookMetaProps> = props => {
  const {
    book: {
      title,
      authors_ordered,
      series,
      property: { is_somedeal, is_novel },
    },
    // isAIRecommendation,
    titleLineClamp,
    showSomeDeal,
    showRating,
  } = props;

  // Todo split code
  // is_comic 은 어디있나?
  const renderTag = () => {
    if (is_novel) {
      return <Tag.Novel />;
    }
    // if (tagName === 'comic') {
    //   return <Tag.Comic />;
    // }
    return null;
  };
  return (
    <>
      <div
        css={css`
          ${bookMetaCSS};
          ${props.width ? `width:${props.width}` : 'width: 100%;'};
        `}>
        {/* Fixme available anchor */}
        <a
          css={css`
            display: inline-block;
          `}
          href="#author">
          <h2
            css={css`
              ${bookTitleCSS};
              ${lineClamp(titleLineClamp || 2)}
            `}>
            {series?.property.title ?? title.main}
          </h2>
        </a>
        {/* Todo Author Anchor Generator */}
        <span css={authorCSS}>{authors_ordered[0].name}</span>
        {showRating && (
          <>
            {/* <span */}
            {/*  css={css`*/}
            {/*    margin-bottom: 6px;*/}
            {/*  `}>*/}
            {/*  <StarRating totalReviewer={totalReviewer} rating={avgRating || 0} />*/}
            {/* </span> */}
          </>
        )}
        <>
          <span
            css={css`
              display: flex;
            `}>
            {renderTag()}
            {showSomeDeal && is_somedeal && <Tag.SomeDeal />}
          </span>
        </>
      </div>
    </>
  );
};

export default BookMeta;
