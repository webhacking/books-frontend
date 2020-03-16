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
  wrapperCSS?: SerializedStyles;
  ratingInfo?: StarRatingType;
}

interface RenderBookTagProps {
  isNovel: boolean;
  isComic: boolean;
}

const RenderBookTag: React.FC<RenderBookTagProps> = (props) => {
  const { isComic, isNovel } = props;
  if (isComic) {
    return (
      <>
        <Tag.Comic />
        <span className="a11y" aria-label="만화">
          만화
        </span>
      </>
    );
  }
  if (isNovel) {
    return (
      <>
        <Tag.Novel />
        <span className="a11y" aria-label="소설">
          소설
        </span>
      </>
    );
  }
  return null;
};

export const authorsRenderer = (authors: BookApi.Author[]) => {
  if (authors.length === 1) {
    return (
      <a
        href={
          authors[0].id
            ? `/author/${authors[0].id}`
            : `/search?q=${encodeURIComponent(authors[0].name)}`
        }
        aria-label={authors[0].id ? authors[0].name : '작가 검색'}
      >
        {authors[0].name}
      </a>
    );
  }
  if (authors.length > 2) {
    return (
      <>
        {authors.slice(0, 2).map((author, index) => (
          <React.Fragment key={index}>
            <a
              href={
                author.id
                  ? `/author/${author.id}`
                  : `/search?q=${encodeURIComponent(author.name)}`
              }
              aria-label={author.id ? author.name : '작가 검색'}
            >
              {author.name}
            </a>
            {index !== 1 && ', '}
          </React.Fragment>
        ))}
        <span>
          {' '}
          외
          {authors.length - 2}
          명
        </span>
      </>
    );
  }
  if (authors.length === 2) {
    return (
      <>
        {authors.map((author, index) => (
          <React.Fragment key={index}>
            <a
              href={
                author.id
                  ? `/author/${author.id}`
                  : `/search?q=${encodeURIComponent(author.name)}`
              }
              aria-label={author.id ? author.name : '작가 검색'}
            >
              {author.name}
            </a>
            {index !== 1 && ', '}
          </React.Fragment>
        ))}
      </>
    );
  }
  return '';
};

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
    wrapperCSS,
    ratingInfo,
  } = props;

  const mergedAuthors = authors.filter((author) => ['author', 'comic_author', 'story_writer', 'illustrator', 'original_author'].includes(
    author.role,
  ));

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
        ]}
      >
        {/* Fixme available anchor */}
        <a
          css={css`
            display: inline-block;
          `}
          href={`/books/${props.book.id}`}
        >
          <h2
            css={css`
              ${bookTitleCSS};
              ${lineClamp(titleLineClamp || 2)}
            `}
            aria-label={props.book.title.main}
            dangerouslySetInnerHTML={{ __html: bookTitleGenerator(props.book) }}
          />
        </a>
        {/* Todo Author Anchor Generator */}
        <span
          css={[
            authorCSS,
            showSomeDeal
              && !is_somedeal
              && css`
                margin-bottom: 0;
              `,
            !showRating
              && css`
                margin-bottom: 0;
              `,
            showSomeDeal
              && is_somedeal
              && css`
                margin-bottom: 6px;
              `,
          ]}
        >
          {authorsRenderer(mergedAuthors)}
        </span>
        {showRating && ratingInfo && (
          <>
            <span
              css={[
                css`
                  margin-bottom: 6px;
                `,
                !showTag
                  && !showSomeDeal
                  && css`
                    margin-bottom: 0;
                  `,
              ]}
            >
              <StarRating
                totalReviewer={ratingInfo.buyer_rating_count}
                rating={ratingInfo.buyer_rating_score || 0}
              />
              <span
                className="a11y"
                aria-label={`총 리뷰어 ${
                  ratingInfo.buyer_rating_count
                }명. 구매자 평균 별점 ${ratingInfo.buyer_rating_score || 0}점.`}
              >
                {`총 리뷰어 ${
                  ratingInfo.buyer_rating_count
                }명. 구매자 평균 별점 ${ratingInfo.buyer_rating_score || 0}점.`}
              </span>
            </span>
          </>
        )}
        <>
          <span
            css={[
              css`
                display: flex;
              `,
              (!showRating || !ratingInfo)
                && css`
                  margin-top: 6px;
                `,
              showSomeDeal
                && is_somedeal
                && css`
                  margin-top: 0;
                `,
              !showTag
                && !showSomeDeal
                && !showRating
                && !ratingInfo
                && css`
                  margin-top: 0;
                `,
              showSomeDeal
                && !is_somedeal
                && css`
                  margin-top: 0;
                `,
            ]}
          >
            {showTag && (
              <RenderBookTag isComic={is_comic_hd || is_comic} isNovel={is_novel} />
            )}
            {showSomeDeal && is_somedeal && (
              <>
                <Tag.SomeDeal />
                <span className="a11y" aria-label="썸딜 도서">
                  썸딜 도서
                </span>
              </>
            )}
          </span>
        </>
      </div>
    </>
  );
});

export default BookMeta;
