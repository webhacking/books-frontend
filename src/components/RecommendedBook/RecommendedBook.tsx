import * as React from 'react';
import { useEffect, useState } from 'react';
import { WindowWidthQuery } from 'libreact/lib/WindowWidthQuery';
import { View } from 'libreact/lib/View';
import { css } from '@emotion/core';
// @ts-ignore
import { Genre } from 'src/constants/genres';
import getConfig from 'next-server/config';
import RecommendedBookList from 'src/components/RecommendedBook/RecommendedBookList';
import styled from '@emotion/styled';
import { Book } from '@ridi/web-ui/dist/index.node';
import { flexRowStart } from 'src/styles';
import NewBadge from 'src/svgs/NewBadge.svg';
import AtSelectIcon from 'src/svgs/Book1.svg';
import RecommendedBookCarousel from 'src/components/RecommendedBook/RecommendedBookCarousel';
const { publicRuntimeConfig } = getConfig();

const hotReleaseRecommendedBookWrapperCSS = css`
  padding-top: 36px;
  @media (max-width: 833px) {
    background: url(${`${
        publicRuntimeConfig.STATIC_CDN_URL
      }/static/image/recommended_book_background@mobile.png`})
      center center no-repeat #17202e;
    background-size: cover;
  }
  @media (max-width: 999px) {
    height: 409px;
  }
  height: 458px;
  background: url(${`${
      publicRuntimeConfig.STATIC_CDN_URL
    }/static/image/recommended_book_background@desktop.png`})
    center center no-repeat #17202e;
  background-size: cover;
`;
const recommendedBookWrapperCSS = css`
  @media (max-width: 833px) {
    background: url(${`${
        publicRuntimeConfig.STATIC_CDN_URL
      }/static/image/recommended_book_background@mobile.png`})
      center center no-repeat #17202e;
    background-size: cover;
  }
  @media (max-width: 999px) {
    height: 353px;
  }
  height: 406px;
  background: url(${`${
      publicRuntimeConfig.STATIC_CDN_URL
    }/static/image/recommended_book_background@desktop.png`})
    center center no-repeat #17202e;
  background-size: cover;
  padding-top: 54px;
`;

export const ThumbnailWrapper = styled.div`
  max-height: 216px;
  display: flex;
  align-items: flex-end;
  min-width: 140px;
  margin-bottom: 8px;
  @media (max-width: 999px) {
    min-width: 120px;
    max-height: 184px;
  }
  img {
    @media (max-width: 999px) {
      max-height: calc(120px * 1.618 - 10px);
    }
    max-height: calc(140px * 1.618 - 10px);
  }
  height: 100%;
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

export const BookItem = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;

  :first-of-type {
    padding-left: 20px;
  }
  :last-of-type {
    padding-right: 20px;
  }
  :not(:last-of-type) {
    margin-right: 24px;
  }

  @media (max-width: 999px) {
    min-width: 120px;
    width: 120px;
    :first-of-type {
      padding-left: 16px;
    }
    :last-of-type {
      padding-right: 16px;
    }
    :not(:last-of-type) {
      margin-right: 20px;
    }
  }
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
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  white-space: normal;
  word-break: keep-all;
`;

export const BookAuthor = styled.span`
  font-size: 14px;
  line-height: 1.36;
  letter-spacing: -0.4px;
  color: #808991;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  white-space: normal;
  word-break: keep-all;
  margin-bottom: 5px;
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

export const BookMeta: React.FC<BookMetaProps> = props => {
  return (
    <div css={bookMetaWrapperCSS}>
      <BookTitle>{props.book.title || ''}</BookTitle>
      <BookAuthor>{props.book.author || ''}</BookAuthor>
      {props.book.serviceAtSelect && (
        <div
          css={css`
            display: flex;
            //justify-content: center;
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
  );
};

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
  const [isMounted, setMounted] = useState(false);
  // @ts-ignore
  const [currentGenre, setGenre] = useState(props.genre);
  useEffect(() => {
    setMounted(true);
    setGenre(props.genre);
    // console.log('mount?', currentGenre, props.genre);

    // Todo 장르가 달라져서 마운트 된다면 Fetch
  });
  return (
    <section
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
      {!isMounted ? (
        <BookList
          css={props.type === 'hot_release' ? hotReleaseBookListCSS : recommendedBookListCSS}>
          {props.items.slice(0, 6).map((book, index) => {
            return (
              <BookItem key={index}>
                <ThumbnailWrapper>
                  <Book.Thumbnail
                    thumbnailUrl={`https://misc.ridibooks.com/cover/${book.id}/xxlarge`}
                  />
                </ThumbnailWrapper>
                <BookMeta book={book} />
              </BookItem>
            );
          })}
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
