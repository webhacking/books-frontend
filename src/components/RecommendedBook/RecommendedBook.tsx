import React, { useEffect, useState, useRef } from 'react';
import { WindowWidthQuery } from 'libreact/lib/WindowWidthQuery';
import { View } from 'libreact/lib/View';
import { css } from '@emotion/core';
import { Genre } from 'src/constants/genres';
import getConfig from 'next/config';
import RecommendedBookList from 'src/components/RecommendedBook/RecommendedBookList';
import styled from '@emotion/styled';
import { Book } from '@ridi/web-ui/dist/index.node';
import { flexRowStart, lineClamp, scrollBarHidden } from 'src/styles';
import NewBadge from 'src/svgs/NewBadge.svg';
import AtSelectIcon from 'src/svgs/Book1.svg';
import RecommendedBookCarousel from 'src/components/RecommendedBook/RecommendedBookCarousel';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
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
  ${backgroundImageCSS};
  padding-top: 36px;
  margin-bottom: 48px;
`;
const recommendedBookWrapperCSS = css`
  ${backgroundImageCSS};
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
  ${orBelow(BreakPoint.LG, flexRowStart)};
  display: flex;
  justify-content: center;
  padding-bottom: 36px;
`;

export const bookMetaWrapperCSS = css`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  book: BookScheme;
}

export const BookMeta: React.FC<BookMetaProps> = React.memo(props => (
  <div css={bookMetaWrapperCSS}>
    <BookTitle>{props.book.title || ''}</BookTitle>
    <BookAuthor>{props.book.author || ''}</BookAuthor>
    {props.book.serviceAtSelect && (
      <div
        css={css`
          display: flex;
          align-items: center;
        `}>
        <AtSelectIcon
          css={css`
            width: 14px;
            height: 12px;
            margin-right: 6px;
          `}
        />
        <span
          css={css`
            font-size: 13px;
            font-weight: bold;
            color: #8e97ff;
          `}>
          리디셀렉트
        </span>
      </div>
    )}
  </div>
));

export interface BookScheme {
  id: string;
  title: string;
  author: string;
  serviceAtSelect: boolean;
}

interface RecommendedBookProps {
  items: BookScheme[];
  genre: Genre;
  type: 'hot_release' | 'single_book_recommendation';
}

const RecommendedBook: React.FC<RecommendedBookProps> = props => {
  const [, setGenre] = useState(props.genre);
  useEffect(() => {
    setGenre(props.genre);
    // Todo 장르가 달라져서 마운트 된다면 Fetch
  }, [props.genre]);

  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef, '50px');
  return (
    <section
      ref={targetRef}
      css={
        props.type === 'hot_release'
          ? hotReleaseRecommendedBookWrapperCSS
          : recommendedBookWrapperCSS
      }>
      {/* Todo split hot release title */}
      {props.type === 'hot_release' && (
        <p css={hotReleaseTitleCSS}>
          <span
            css={css`
              margin-right: 8px;
            `}>
            집 앞 서점에 방금 나온 신간!
          </span>
          <NewBadge
            css={css`
              width: 36px;
              height: 20px;
            `}
          />
        </p>
      )}
      {!isIntersecting ? (
        <BookList
          css={
            props.type === 'hot_release' ? hotReleaseBookListCSS : recommendedBookListCSS
          }>
          {props.items.slice(0, 6).map((book, index) => (
            <PortraitBook key={index}>
              <ThumbnailWrapper>
                <Book.Thumbnail
                  thumbnailUrl={
                    'https://static.ridibooks.com/books/dist/images/book_cover/cover_lazyload.png'
                    // : `https://misc.ridibooks.com/cover/${book.id}/xxlarge`
                  }
                />
              </ThumbnailWrapper>
              <BookMeta book={book} />
            </PortraitBook>
          ))}
        </BookList>
      ) : (
        <WindowWidthQuery>
          <View maxWidth={1000}>
            <RecommendedBookList type={props.type} items={props.items} />
          </View>
          <View>
            <RecommendedBookCarousel type={props.type} items={props.items} />
          </View>
        </WindowWidthQuery>
      )}
    </section>
  );
};

export default RecommendedBook;
