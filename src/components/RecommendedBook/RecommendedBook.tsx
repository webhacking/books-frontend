import React, { useRef } from 'react';
import { WindowWidthQuery } from 'libreact/lib/WindowWidthQuery';
import { View } from 'libreact/lib/View';
import { css } from '@emotion/core';
import getConfig from 'next/config';
import RecommendedBookList from 'src/components/RecommendedBook/RecommendedBookList';
import styled from '@emotion/styled';
import { flexRowStart, lineClamp, scrollBarHidden } from 'src/styles';
// import NewBadge from 'src/svgs/NewBadge.svg';
import AtSelectIcon from 'src/svgs/Book1.svg';
import RecommendedBookCarousel from 'src/components/RecommendedBook/RecommendedBookCarousel';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { DisplayType, HotRelease, TodayRecommendation } from 'src/types/sections';
import * as BookApi from 'src/types/book';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import { authorsRenderer } from 'src/components/BookMeta/BookMeta';

const { publicRuntimeConfig } = getConfig();

const backgroundImageCSS = css`
  background: url(${`${publicRuntimeConfig.STATIC_CDN_URL}/static/image/recommended_book_background@desktop.png`})
    center center no-repeat #17202e;
  background-size: contain;
  ${orBelow(
    BreakPoint.MD,
    css`
      background-size: cover;
    `,
  )};
  padding-top: 36px;
  padding-bottom: 36px;
`;

const hotReleaseRecommendedBookWrapperCSS = css`
  padding-top: 24px;
  margin-bottom: 0;
`;
const recommendedBookWrapperCSS = css`
  padding-top: 24px;
  padding-bottom: 24px;
`;

export const hotReleaseBookListCSS = css`
  max-width: 1000px;
  padding-left: 3px;
`;
export const recommendedBookListCSS = css`
  padding-left: 3px;
`;

export const BookList = styled.ul`
  overflow: auto;
  ${scrollBarHidden};
  margin: 0 auto;
  ${orBelow(
    BreakPoint.LG,
    css`
      ${flexRowStart}
    `,
  )};
  display: flex;
  justify-content: center;
  margin-top: 6px;
  //padding-bottom: 36px;
`;

export const bookMetaWrapperCSS = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 7px;
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
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding-left: 24px;
  font-weight: normal;

  ${orBelow(
    BreakPoint.LG,
    css`
      padding-left: 16px;
    `,
  )};

  height: 21px;
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
  const authors =
    props.book?.authors_ordered.filter(author =>
      [
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
        href={new URL(
          `/books/${props.book.id}`,
          publicRuntimeConfig.STORE_HOST,
        ).toString()}>
        <BookTitle aria-label={props.book?.title?.main || ''}>
          {bookTitleGenerator(props.book)}
        </BookTitle>
      </a>
      {props.book.authors_ordered && <BookAuthor>{authorsRenderer(authors)}</BookAuthor>}
      {props.book?.clientBookFields.isAvailableSelect && (
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
          aria-label={'리디 셀렉트 이용 가능 도서'}>
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
            `}>
            리디셀렉트
          </span>
        </div>
      )}
    </div>
  );
});

type RecommendedBookType = TodayRecommendation[] | HotRelease[];

interface RecommendedBookLoadingProps {
  type: DisplayType;
  books: RecommendedBookType;
  isIntersecting: boolean;
  theme: 'dark' | 'white';
}

const dummyBook = {
  b_id: '',
  rating: {
    buyer_rating_score: 0,
    buyer_rating_count: 0,
    total_rating_count: 0,
  },
  detail: null,
  type: '',
  order: 0,
  sentence: '',
};

export const sentenceStyle = css`
  line-height: 16px;
  text-align: center;
  font-weight: bold;
  white-space: nowrap;
  left: 7px;
  margin-top: 2px;
  font-size: 0.84em;

  width: 140px;
  ${orBelow(
    BreakPoint.LG,
    css`
      display: flex;
      width: 130px;
      justify-content: center;
      left: -10px;
    `,
  )};
`;

const RecommendedBookLoading: React.FC<RecommendedBookLoadingProps> = React.memo(
  props => {
    const { books, type, isIntersecting, theme } = props;
    const dummyBooks: HotRelease[] = books.length < 6 ? Array(6).fill(dummyBook) : books;
    return (
      <BookList
        css={[
          props.type === DisplayType.HotRelease
            ? hotReleaseBookListCSS
            : recommendedBookListCSS,
          css`
            padding-left: 0 !important;
          `,
          props.type === DisplayType.TodayRecommendation
            ? css`
                ${orBelow(
                  999,
                  css`
                    padding-left: 23px !important;
                  `,
                )}
              `
            : css`
                padding-left: 11px !important;
              `,
        ]}>
        {/* // @ts-ignore */}
        {dummyBooks.map((book, index) => (
          <PortraitBook
            css={[
              css`
                padding-left: 0 !important;
              `,
              props.type === DisplayType.HotRelease
                ? css`
                    ${orBelow(
                      999,
                      css`
                        margin-right: 12px !important;
                      `,
                    )}
                  `
                : css`
                    ${orBelow(
                      999,
                      css`
                        margin-right: 30px !important;
                      `,
                    )}
                  `,
            ]}
            key={index}>
            <ThumbnailWrapper>
              <ThumbnailRenderer
                book={{ b_id: book.b_id, detail: book.detail }}
                imgSize={'xlarge'}
                isIntersecting={isIntersecting}
              />
            </ThumbnailWrapper>
            {book.detail && type === DisplayType.HotRelease && (
              <BookMeta book={book.detail} showSelect={true} />
            )}
            {book.detail && type === DisplayType.TodayRecommendation && (
              <h4
                css={[
                  css`
                    padding-left: 0;
                    position: relative;
                    margin-top: 2px;
                    ${sentenceStyle};
                  `,
                  theme === 'dark' &&
                    css`
                      color: white;
                    `,
                ]}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: (book as HotRelease).sentence.replace(
                      /(?:\r\n|\r|\n)/g,
                      '<br />',
                    ),
                  }}
                />
              </h4>
            )}
          </PortraitBook>
        ))}
      </BookList>
    );
  },
);

interface RecommendedBookProps {
  items: RecommendedBookType;
  title: string;
  type: DisplayType.HotRelease | DisplayType.TodayRecommendation;
  theme: 'white' | 'dark';
  slug: string;
}

const RecommendedBook: React.FC<RecommendedBookProps> = props => {
  const { theme, type, slug } = props;
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '50px');

  const [books] = useBookDetailSelector(props.items);
  return (
    <section
      ref={targetRef}
      css={[
        props.type === DisplayType.HotRelease
          ? hotReleaseRecommendedBookWrapperCSS
          : recommendedBookWrapperCSS,
        theme === 'dark' && backgroundImageCSS,
        theme === 'white' && css``,
      ]}>
      <h2
        css={[
          hotReleaseTitleCSS,
          theme === 'white' &&
            css`
              color: black;
            `,
        ]}
        aria-label={props.title}>
        <span
          css={css`
            margin-right: 8px;
          `}>
          {props.title}
        </span>
      </h2>
      {!isIntersecting ? (
        <RecommendedBookLoading
          type={type}
          books={books.filter(book => book.detail).slice(0, 6) as HotRelease[]}
          isIntersecting={isIntersecting}
          theme={theme}
        />
      ) : (
        <WindowWidthQuery>
          <View maxWidth={1000}>
            <RecommendedBookList
              type={props.type}
              slug={slug}
              items={books as HotRelease[]}
              theme={theme}
              isIntersecting={isIntersecting}
            />
          </View>
          <View>
            <RecommendedBookCarousel
              type={props.type}
              slug={slug}
              items={books as HotRelease[]}
              theme={theme}
              isIntersecting={isIntersecting}
            />
          </View>
        </WindowWidthQuery>
      )}
    </section>
  );
};

export default RecommendedBook;
