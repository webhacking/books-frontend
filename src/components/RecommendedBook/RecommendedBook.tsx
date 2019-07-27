import React, { useEffect, useState, useRef } from 'react';
import { WindowWidthQuery } from 'libreact/lib/WindowWidthQuery';
import { View } from 'libreact/lib/View';
import { css } from '@emotion/core';
// @ts-ignore
import { Genre } from 'src/constants/genres';
import getConfig from 'next-server/config';
import RecommendedBookList from 'src/components/RecommendedBook/RecommendedBookList';
import styled from '@emotion/styled';
import { Book } from '@ridi/web-ui/dist/index.node';
import { flexRowStart, lineClamp } from 'src/styles';
import NewBadge from 'src/svgs/NewBadge.svg';
import AtSelectIcon from 'src/svgs/Book1.svg';
import RecommendedBookCarousel from 'src/components/RecommendedBook/RecommendedBookCarousel';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
const { publicRuntimeConfig } = getConfig();

const backgroundImageCSS = css`
  background: url(${`${publicRuntimeConfig.STATIC_CDN_URL}/static/image/recommended_book_background@desktop.png`})
    center center no-repeat #17202e;
  background-size: contain;
  @media (max-width: 833px) {
    background-size: cover;
  }
`;

const hotReleaseRecommendedBookWrapperCSS = css`
  ${backgroundImageCSS};
  @media (max-width: 999px) {
    height: 409px;
  }
  padding-top: 36px;
  height: 458px;
`;
const recommendedBookWrapperCSS = css`
  ${backgroundImageCSS};
  @media (max-width: 999px) {
    height: 353px;
  }
  height: 406px;
  padding-top: 54px;
`;

export const hotReleaseBookListCSS = css`
  @media (max-width: 999px) {
    height: 322px;
  }
  height: 372px;
  max-width: 1000px;
  padding-left: 3px;
`;
export const recommendedBookListCSS = css`
  @media (max-width: 999px) {
    height: 300px;
  }
  height: 406px;
  padding-left: 3px;
`;

export const BookList = styled.ul`
  overflow: auto;
  margin: 0 auto;
  @media (max-width: 999px) {
    ${flexRowStart};
  }
  display: flex;
  justify-content: center;
  -webkit-overflow-scrolling: touch;
`;

export const bookMetaWrapperCSS = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const BookTitle = styled.h3`
  color: white;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.33;
  letter-spacing: -0.4px;
  margin-bottom: 4px;
  ${lineClamp(2)};
`;

export const BookAuthor = styled.span`
  font-size: 14px;
  line-height: 1.36;
  letter-spacing: -0.4px;
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
  @media (max-width: 999px) {
    padding-left: 16px;
  }

  height: 21px;
  line-height: 21px;
  font-size: 21px;
  letter-spacing: -0.2px;
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
            letter-spacing: -0.3px;
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
  // @ts-ignore
  const [currentGenre, setGenre] = useState(props.genre);
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
