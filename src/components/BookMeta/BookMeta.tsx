import * as React from 'react';
import { css } from '@emotion/core';
import { lineClamp } from 'src/styles';
import StarRating from 'src/components/StarRating/StarRating';
import Tag from 'src/components/Tag/Tag';
import { BookScheme } from 'src/types/book';

const bookTitleCSS = css`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.33;
  letter-spacing: -0.43px;
  color: #000000;
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
  letter-spacing: -0.4px;
  color: #808991;
  margin-bottom: 2px;
  ${lineClamp(1)};
`;

interface BookMetaProps {
  book: BookScheme;
  titleLineClamp?: number;
  showRating: boolean;
  showSomeDeal?: boolean;
  isAIRecommendation?: boolean;
  width?: string;
}

const BookMeta: React.FC<BookMetaProps> = props => {
  const {
    book: { totalReviewer, isSomeDeal, tag, title, author, avgRating },
    // isAIRecommendation,
    showSomeDeal,
    titleLineClamp,

    showRating,
  } = props;

  // tslint:disable-next-line:no-shadowed-variable
  const renderTag = (tagName: string) => {
    if (tagName === 'novel') {
      return <Tag.Novel />;
    }
    if (tagName === 'comic') {
      return <Tag.Comic />;
    }
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
            {title}
          </h2>
        </a>
        {/* Todo Author Anchor Generator */}
        <span css={authorCSS}>{author}</span>
        {showRating && (
          <>
            <span
              css={css`
                margin-bottom: 6px;
              `}>
              <StarRating totalReviewer={totalReviewer} rating={avgRating || 0} />
            </span>
            <span
              css={css`
                display: flex;
              `}>
              {tag && renderTag(tag)}
              {showSomeDeal && isSomeDeal && <Tag.SomeDeal />}
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default BookMeta;
