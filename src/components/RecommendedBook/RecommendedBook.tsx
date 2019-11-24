import React, { useRef } from 'react';
import { WindowWidthQuery } from 'libreact/lib/WindowWidthQuery';
import { View } from 'libreact/lib/View';
import { css } from '@emotion/core';
import getConfig from 'next/config';
import RecommendedBookList from 'src/components/RecommendedBook/RecommendedBookList';
import styled from '@emotion/styled';
import { Book } from '@ridi/web-ui/dist/index.node';
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
`;

const hotReleaseRecommendedBookWrapperCSS = css`
  padding-top: 36px;
  margin-bottom: 48px;
`;
const recommendedBookWrapperCSS = css`
  padding-top: 36px;
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
      padding-left: 9px !important;
      margin-right: 8px;
      ${flexRowStart}
    `,
  )};
  display: flex;
  justify-content: center;
  padding-bottom: 36px;
`;

export const bookMetaWrapperCSS = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 7px;
`;

export const BookTitle = styled.h3`
  color: white;
  font-size: 15px;
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
  padding-left: 20px;

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
  margin-bottom: 30px;
`;

interface BookMetaProps {
  book: BookApi.Book;
  showSelect?: boolean;
}

// eslint-disable-next-line
export const BookMeta: React.FC<BookMetaProps> = React.memo(props => {
  return (
    <div css={bookMetaWrapperCSS}>
      <BookTitle>{bookTitleGenerator(props.book)}</BookTitle>
      {props.book.authors && props.book.authors.author && (
        <BookAuthor>{props.book.authors.author[0].name || ''}</BookAuthor>
      )}
      {props.book.isAvailableSelect && (
        <div
          css={css`
            display: flex;
            align-items: center;
          `}>
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

interface RecommendedBookProps {
  items: RecommendedBookType;
  title: string;
  type: DisplayType.HotRelease | DisplayType.TodayRecommendation;
  theme: 'white' | 'dark';
}

const RecommendedBook: React.FC<RecommendedBookProps> = props => {
  const { theme, type } = props;
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '50px');

  const [books, isFetching] = useBookDetailSelector(props.items);

  return (
    <section
      ref={targetRef}
      css={[
        props.type === DisplayType.HotRelease
          ? hotReleaseRecommendedBookWrapperCSS
          : recommendedBookWrapperCSS,
        theme === 'dark' && backgroundImageCSS,
      ]}>
      {/* Todo split hot release title */}
      <p
        css={[
          hotReleaseTitleCSS,
          theme === 'white' &&
            css`
              color: black;
            `,
        ]}>
        <span
          css={css`
            margin-right: 8px;
          `}>
          {props.title}
        </span>
      </p>
      {!isIntersecting || isFetching ? (
        <BookList
          css={[
            props.type === DisplayType.HotRelease
              ? hotReleaseBookListCSS
              : recommendedBookListCSS,
            css`
              padding-left: 0 !important;
            `,
          ]}>
          {/* // @ts-ignore */}
          {books.slice(0, 6).map((book, index) => (
            <PortraitBook
              css={css`
                padding-left: 0 !important;
              `}
              key={index}>
              <ThumbnailWrapper>
                <Book.Thumbnail
                  adultBadge={book.detail?.property.is_adult_only}
                  thumbnailUrl={
                    isIntersecting
                      ? 'https://static.ridibooks.com/books/dist/images/book_cover/cover_lazyload.png'
                      : `https://misc.ridibooks.com/cover/${book.detail?.thumbnailId ??
                          book.b_id}/xxlarge`
                  }
                />
              </ThumbnailWrapper>
              {book.detail && type === DisplayType.HotRelease && (
                <BookMeta book={book.detail} showSelect={true} />
              )}
              {book.detail && type === DisplayType.TodayRecommendation && (
                <div
                  css={[
                    css`
                      padding-left: 13px;
                      margin-top: 2px;
                      font-size: 13px;
                      line-height: 16px;
                      text-align: center;
                      font-weight: bold;
                      white-space: nowrap;
                      width: 140px;
                      display: flex;
                      justify-content: center;
                      ${orBelow(
                        BreakPoint.LG,
                        css`
   display: flex;
    width: 120px;
}`,
                      )};
                    `,
                    theme === 'dark' &&
                      css`
                        color: white;
                      `,
                  ]}>
                  <span
                    className={'test'}
                    dangerouslySetInnerHTML={{
                      __html: (book as HotRelease).sentence.replace(
                        /(?:\r\n|\r|\n)/g,
                        '<br />',
                      ),
                    }}
                  />
                </div>
              )}
            </PortraitBook>
          ))}
        </BookList>
      ) : (
        <WindowWidthQuery>
          <View maxWidth={1000}>
            <RecommendedBookList
              type={props.type}
              items={books as HotRelease[]}
              theme={theme}
            />
          </View>
          <View>
            <RecommendedBookCarousel
              type={props.type}
              items={books as HotRelease[]}
              theme={theme}
            />
          </View>
        </WindowWidthQuery>
      )}
    </section>
  );
};

export default RecommendedBook;
