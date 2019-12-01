import React, { useEffect, useRef } from 'react';
import { Book } from '@ridi/web-ui/dist/index.node';
import * as BookApi from 'src/types/book';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import AdultBadge from 'src/svgs/AdultBadge.svg';
import getConfig from 'next/config';
import { css } from '@emotion/core';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';
const { publicRuntimeConfig } = getConfig();

export const IMG_RIDI_CDN_URL = 'https://img.ridicdn.net';

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
  if (bId.length === 0) {
    return new URL(
      '/static/image/cover_lazyload.png',
      publicRuntimeConfig.STATIC_CDN_URL,
    ).toString();
  }
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
    IMG_RIDI_CDN_URL,
  ).toString();
};

// 썸네일을 보여줄 수 있는 상태 ( intersecting 되거나 fetch 종료 ) 일 때도 체크
// loggedUser 가 성인 인증 상태일 경우는 정상 렌더링
// 아닌 경우는 성인 도서 Placeholder 표지
const ThumbnailRenderer: React.FC<ThumbnailRendererProps> = React.memo(
  props => {
    const { book, isIntersecting, imgSize, width, children } = props;
    const { loggedUser } = useSelector((state: RootState) => state.account);

    // Todo WIP 노출 여부
    const targetRef = useRef(null);
    const bookIsIntersecting = useIntersectionObserver(targetRef, '0px');

    const is_adult_only = book.detail?.property?.is_adult_only ?? false;
    const imageUrl = computeThumbnailUrl(
      is_adult_only,
      isIntersecting,
      loggedUser?.is_verified_adult,
      book.b_id,
      imgSize,
    );
    useEffect(() => {
      if (bookIsIntersecting) {
        // console.log(book.b_id);
        // Todo Impression
        // 디바운싱을 고려해볼것
      }
    }, [bookIsIntersecting]);
    return (
      <div ref={targetRef}>
        <Book.Thumbnail
          thumbnailWidth={width}
          thumbnailTitle={bookTitleGenerator(book.detail)}
          thumbnailUrl={imageUrl}>
          {children}
          {book.detail?.property?.is_adult_only && (
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
      </div>
    );
  },
  (prev, next) => {
    if (prev.book.b_id !== next.book.b_id) {
      return false;
    }
    if (prev.isIntersecting !== next.isIntersecting) {
      return false;
    }
    return prev.imgSize === next.imgSize;
  },
);

export default ThumbnailRenderer;
