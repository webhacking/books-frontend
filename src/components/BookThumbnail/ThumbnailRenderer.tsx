import React from 'react';
import { Book } from '@ridi/web-ui/dist/index.node';
import * as BookApi from 'src/types/book';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import AdultBadge from 'src/svgs/AdultBadge.svg';
import getConfig from 'next/config';
import { css } from '@emotion/core';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';
const { publicRuntimeConfig } = getConfig();

interface ThumbnailRendererProps {
  book: {
    b_id: string;
    detail?: BookApi.Book;
  };
  imgSize: 'xxlarge' | 'large' | 'small' | 'medium';
  isIntersecting?: boolean;
  width?: number;
}

const computeThumbnailUrl = (
  isAdultOnly: boolean,
  isIntersection: boolean,
  isVerifiedAdult: boolean | null,
  bId: string,
  imageSize?: string,
) => {
  if (!isIntersection) {
    return new URL(
      '/static/image/cover_lazyload.png',
      publicRuntimeConfig.STATIC_CDN_URL,
    ).toString();
  }
  if (isAdultOnly && !isVerifiedAdult) {
    return new URL(
      '/static/image/cover_adult.png',
      publicRuntimeConfig.STATIC_CDN_URL,
    ).toString();
  }
  return new URL(
    imageSize ? `/cover/${bId}/${imageSize}` : `/cover/${bId}/xxlarge`,
    'https://misc.ridibooks.com',
  ).toString();
};

// 썸네일을 보여줄 수 있는 상태 ( intersecting 되거나 fetch 종료 ) 일 때도 체크
// loggedUser 가 성인 인증 상태일 경우는 정상 렌더링
// 아닌 경우는 성인 도서 Placeholder 표지
const ThumbnailRenderer: React.FC<ThumbnailRendererProps> = props => {
  const { book, isIntersecting, imgSize, width, children } = props;
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const { is_adult_only } = book.detail?.property;
  const imageUrl = computeThumbnailUrl(
    is_adult_only,
    isIntersecting,
    loggedUser?.is_verified_adult,
    book.b_id,
    imgSize,
  );
  return (
    <Book.Thumbnail
      thumbnailWidth={width}
      thumbnailTitle={bookTitleGenerator(book.detail)}
      thumbnailUrl={imageUrl}>
      {children}
      {book.detail?.property.is_adult_only && (
        <AdultBadge
          css={css`
            display: block;
            position: absolute;
            right: 3px;
            top: 3px;
            width: 20px;
            height: 20px;
          `}
        />
      )}
    </Book.Thumbnail>
  );
};

export default ThumbnailRenderer;
