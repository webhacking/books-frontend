import * as React from 'react';
import { css, SerializedStyles } from '@emotion/core';
import { lineClamp } from 'src/styles';
import StarRating from 'src/components/StarRating/StarRating';
import Tag from 'src/components/Tag/Tag';
import * as BookApi from 'src/types/book';
import { StarRating as StarRatingType } from 'src/types/sections';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';
import { orBelow } from 'src/utils/mediaQuery';
import { slateGray60 } from '@ridi/colors';

const bookTitleCSS = css`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.33em;
  color: #000000;
  max-height: 2.7em;
  margin-bottom: 4.5px;
  ${orBelow(
    999,
    css`
      font-size: 14px;
    `,
  )}
`;

const bookMetaCSS = css`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  transition: opacity 0.2s ease-in-out;
`;

const authorCSS = css`
  height: 19px;
  font-size: 14px;
  line-height: 1.36;
  color: ${slateGray60};
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
  className?: string;
  ratingInfo?: StarRatingType;
}

interface RenderBookTagProps {
  isNovel: boolean;
  isComic: boolean;
}

const RenderBookTag: React.FC<RenderBookTagProps> = (props) => {
  const { isComic, isNovel } = props;
  if (isComic) {
    return <Tag.Comic />;
  }
  if (isNovel) {
    return <Tag.Novel />;
  }
  return null;
};

function AuthorAnchor(props: { author: BookApi.Author }) {
  const { id, name } = props.author;
  return (
    <a
      href={
        id
          ? `/author/${id}`
          : `/search?q=${encodeURIComponent(name)}`
      }
      aria-label={id ? name : '작가 검색'}
    >
      {name}
    </a>
  );
}

export function Authors(props: { authors: BookApi.Author[] }) {
  const { authors } = props;
  const len = authors.length;
  if (len === 0) {
    return null;
  }
  if (len === 1) {
    return <AuthorAnchor author={authors[0]} />;
  }
  if (len === 2) {
    return (
      <>
        <AuthorAnchor author={authors[0]} />
        {', '}
        <AuthorAnchor author={authors[1]} />
      </>
    );
  }

  // len > 2
  return (
    <>
      <AuthorAnchor key="0" author={authors[0]} />
      {', '}
      <AuthorAnchor key="1" author={authors[1]} />
      {` 외 ${len - 2}명`}
    </>
  );
}

// eslint-disable-next-line complexity
const BookMeta: React.FC<BookMetaProps> = React.memo((props) => {
  if (props.book.is_deleted) {
    return null;
  }
  const {
    book: {
      authors,
      property: { is_somedeal, is_novel },
      file: { is_comic, is_comic_hd },
    },
    // isAIRecommendation,
    showTag,
    titleLineClamp,
    showSomeDeal,
    showRating,
    className,
    ratingInfo,
  } = props;

  const mergedAuthors = authors.filter(
    (author) => ['author', 'comic_author', 'story_writer', 'illustrator', 'original_author'].includes(author.role),
  );

  return (
    <div
      className={className}
      css={[
        bookMetaCSS,
        props.width
          ? css`width: ${props.width};`
          : css`width: 100%;`,
      ]}
    >
      {/* Fixme available anchor */}
      <a
        css={css`display: inline-block;`}
        href={`/books/${props.book.id}`}
      >
        <h2
          css={[
            bookTitleCSS,
            lineClamp(titleLineClamp || 2),
          ]}
          aria-label={props.book.title.main}
          dangerouslySetInnerHTML={{ __html: bookTitleGenerator(props.book) }}
        />
      </a>
      {/* Todo Author Anchor Generator */}
      <span css={authorCSS}>
        <Authors authors={mergedAuthors} />
      </span>
      {showRating && ratingInfo && (
        <span>
          <StarRating
            totalReviewer={ratingInfo.buyer_rating_count}
            rating={ratingInfo.buyer_rating_score || 0}
          />
        </span>
      )}
      {(showTag || (showSomeDeal && is_somedeal)) && (
        <span css={css`display: flex; margin-top: 6px;`}>
          {showTag && (
            <RenderBookTag isComic={is_comic_hd || is_comic} isNovel={is_novel} />
          )}
          {showSomeDeal && is_somedeal && <Tag.SomeDeal />}
        </span>
      )}
    </div>
  );
});

export default BookMeta;
