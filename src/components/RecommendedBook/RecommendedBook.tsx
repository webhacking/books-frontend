import React from 'react';
import { css } from '@emotion/core';
import RecommendedBookList from 'src/components/RecommendedBook/RecommendedBookList';
import styled from '@emotion/styled';
import { lineClamp, scrollBarHidden } from 'src/styles';
// import NewBadge from 'src/svgs/NewBadge.svg';
import AtSelectIcon from 'src/svgs/Book1.svg';
import RecommendedBookCarousel from 'src/components/RecommendedBook/RecommendedBookCarousel';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { DisplayType, HotRelease, TodayRecommendation } from 'src/types/sections';
import * as BookApi from 'src/types/book';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import useIsTablet from 'src/hooks/useIsTablet';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';
import { authorsRenderer } from 'src/components/BookMeta/BookMeta';
import recommendedBookBackground from 'src/assets/image/recommended_book_background@desktop.png';

const backgroundImageCSS = css`
  background: url(${recommendedBookBackground})
    center center no-repeat #17202e;
  background-size: contain;
  ${orBelow(
    BreakPoint.MD,
    css`
      background-size: cover;
    `,
  )};
`;

const hotReleaseRecommendedBookWrapperCSS = css`
  padding-top: 40px;
  ${orBelow(
    999,
    css`
      padding-top: 36px;
    `,
  )};

  margin-bottom: 0;
`;
const recommendedBookWrapperCSS = css`
  padding-top: 40px;
  padding-bottom: 50px;

  ${orBelow(
    999,
    css`
      padding-bottom: 40px;
    `,
  )}
`;

export const hotReleaseBookListCSS = css`
  max-width: 1000px;
`;
export const recommendedBookListCSS = css`
`;

export const BookList = styled.ul`
  overflow: auto;
  ${scrollBarHidden};

  margin: 6px auto 0;
  padding-top: 7px;
  padding-left: 7px;
  display: flex;
  justify-content: start;
  flex-wrap: nowrap;

  @media (min-width: 1000px) {
    justify-content: center;
  }
`;

export const bookMetaWrapperCSS = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const BookTitle = styled.h2`
  color: white;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.33em;
  max-height: 2.66em;
  margin-bottom: 4px;
  ${lineClamp(2)};
`;

export const BookAuthor = styled.span`
  font-size: 14px;
  line-height: 1.36em;
  max-height: 1.36em;
  color: #808991;
  margin-bottom: 5px;
  ${lineClamp(1)};
`;

const hotReleaseTitleCSS = css`
  max-width: 950px;
  margin: 0 auto 27px;
  display: flex;
  align-items: center;
  font-weight: normal;

  ${orBelow(
    BreakPoint.LG,
    css`
      padding-left: 16px;
    `,
  )};

  line-height: 21px;
  font-size: 21px;
  color: white;
`;

interface BookMetaProps {
  book: BookApi.Book;
  showSelect?: boolean;
}

// eslint-disable-next-line
export const BookMeta: React.FC<BookMetaProps> = React.memo(props => {
  const authors = props.book?.authors.filter((author) => [
    'author',
    'comic_author',
    'story_writer',
    'illustrator',
    'original_author',
  ].includes(author.role),
    ) ?? [];
  return (
    <div css={bookMetaWrapperCSS}>
      <a
        css={css`
          display: inline-block;
        `}
        href={`/books/${props.book.id}`}
      >
        <BookTitle aria-label={props.book?.title?.main || ''}>
          {bookTitleGenerator(props.book)}
        </BookTitle>
      </a>
      {props.book.authors && <BookAuthor>{authorsRenderer(authors)}</BookAuthor>}
      {props.book?.clientBookFields.isAvailableSelect && (
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
          aria-label="리디 셀렉트 이용 가능 도서"
        >
          <AtSelectIcon
            css={css`
              width: 14px;
              fill: #22b8cf;
              height: 12px;
              margin-right: 6px;
            `}
          />
          <span
            css={css`
              font-size: 13px;
              font-weight: bold;
              color: #22b8cf;
            `}
          >
            리디셀렉트
          </span>
        </div>
      )}
    </div>
  );
});

type RecommendedBookType = TodayRecommendation[] | HotRelease[];

export const sentenceStyle = css`
  line-height: 18px;
  text-align: center;
  font-weight: bold;
  white-space: nowrap;
  font-size: 0.84em;

  width: 140px;
  ${orBelow(
    BreakPoint.LG,
    css`
      width: 130px;
    `,
  )};
`;

interface RecommendedBookProps {
  items: RecommendedBookType;
  title: string;
  type: DisplayType.HotRelease | DisplayType.TodayRecommendation;
  theme: 'white' | 'dark';
  slug: string;
  genre: string;
}

const RecommendedBook: React.FC<RecommendedBookProps> = (props) => {
  const { theme, slug, genre } = props;
  const [books] = useBookDetailSelector(props.items);
  const isTablet = useIsTablet();
  return (
    <section
      css={[
        props.type === DisplayType.HotRelease
          ? hotReleaseRecommendedBookWrapperCSS
          : recommendedBookWrapperCSS,
        theme === 'dark' && backgroundImageCSS,
        theme === 'white'
          && css`
            ${orBelow(
            999,
            css`
              padding-bottom: 16px;
              padding-top: 16px;
            `,
          )}
          `,
      ]}
    >
      <h2
        css={[
          hotReleaseTitleCSS,
          theme === 'white'
            && css`
              color: black;
            `,
        ]}
        aria-label={props.title}
      >
        <span
          css={css`
            margin-right: 8px;
          `}
        >
          {props.title}
        </span>
      </h2>
      <div>
        {isTablet ? (
          <RecommendedBookList
            type={props.type}
            slug={slug}
            items={books as HotRelease[]}
            theme={theme}
            genre={genre}
          />
        ) : (
          <RecommendedBookCarousel
            type={props.type}
            slug={slug}
            genre={genre}
            items={books as HotRelease[]}
            theme={theme}
          />
        )}
      </div>
    </section>
  );
};

export default RecommendedBook;
