import React from 'react';
import { css } from '@emotion/core';
import RecommendedBookList from 'src/components/RecommendedBook/RecommendedBookList';
import styled from '@emotion/styled';
import { lineClamp } from 'src/styles';
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

const SectionTitle = styled.h2`
  max-width: 1000px;
  margin: 0 auto;
  padding-left: 25px;
  padding-right: 8px;

  font-size: 19px;
  font-weight: normal;

  @media (max-width: ${BreakPoint.LG}px) {
    padding-left: 20px;
  }

  @media (max-width: ${BreakPoint.MD}px) {
    padding-left: 16px;
  }
`;

const RecommendedBookWrapper = styled.section<{ bg: 'white' | 'dark' }>`
  padding-top: ${({ bg }) => (bg === 'white' ? 16 : 36)}px;
  padding-bottom: ${({ bg }) => (bg === 'white' ? 16 : 36)}px;

  ${({ bg }) => bg === 'white' && `
    @media (min-width: 1000px) {
      padding-top: 24px;
      padding-bottom: 24px;
    }
  `}

  ${({ bg }) => bg === 'dark' && `
    background: url(${recommendedBookBackground})
      center center no-repeat #17202e;
    background-size: contain;
    @media (max-width: ${BreakPoint.MD}px) {
      background-size: cover;
    }
  `}

  > ${SectionTitle} {
    ${({ bg }) => bg === 'dark' && 'color: white;'}
  }
`;

export const BookList = styled.ul`
  flex: none;
  margin: 6px auto 0;
  padding-top: 7px;
  padding-left: 7px;
  display: flex;
  flex-wrap: nowrap;

  @media (min-width: 1000px) {
    justify-content: center;
  }
`;

export const bookMetaWrapperCSS = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 8px;
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
    <RecommendedBookWrapper bg={theme}>
      <SectionTitle>{props.title}</SectionTitle>
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
    </RecommendedBookWrapper>
  );
};

export default RecommendedBook;
