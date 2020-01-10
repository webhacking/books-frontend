import React from 'react';
import { Book } from '@ridi/web-ui/dist/index.node';
import * as BookApi from 'src/types/book';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import AdultBadge from 'src/svgs/AdultBadge.svg';
import { css } from '@emotion/core';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';

export const IMG_RIDI_CDN_URL = 'https://img.ridicdn.net';

interface ThumbnailRendererProps {
  book: {
    b_id: string;
    detail?: BookApi.Book;
  };
  imgSize: 'xxlarge' | 'xlarge' | 'large' | 'small' | 'medium';
  isIntersecting?: boolean;
  width?: number;
  slug?: string;
  order?: number;
  className?: string;
}

const computeThumbnailUrl = (
  isAdultOnly: boolean,
  // @ts-ignore
  isIntersection: boolean,
  isVerifiedAdult: boolean | null,
  bId: string,
  imageSize?: string,
  book?: BookApi.Book,
) => {
  // if (bId.length === 0) {
  //   return new URL(
  //     '/static/image/cover_lazyload.png',
  //     publicRuntimeConfig.STATIC_CDN_URL,
  //   ).toString();
  // }
  // if (!isIntersection) {
  //   return new URL(
  //     '/static/image/cover_lazyload.png',
  //     publicRuntimeConfig.STATIC_CDN_URL,
  //   ).toString();
  // }
  if (isAdultOnly && !isVerifiedAdult) {
    return new URL(
      '/static/image/cover_adult.png',
      publicRuntimeConfig.STATIC_CDN_URL,
    ).toString();
  }

  if (book?.series) {
    if (book.series.property.is_completed) {
      return new URL(
        imageSize ? `/cover/${bId}/${imageSize}` : `/cover/${bId}/xlarge`,
        IMG_RIDI_CDN_URL,
      ).toString();
    }
    if (book?.series.property.opened_last_volume_id.length !== 0) {
      return new URL(
        imageSize
          ? `/cover/${book.series.property.opened_last_volume_id}/${imageSize}`
          : `/cover/${book.series.property.opened_last_volume_id}/xlarge`,
        IMG_RIDI_CDN_URL,
      ).toString();
    }
  }

  return new URL(
    imageSize ? `/cover/${bId}/${imageSize}` : `/cover/${bId}/xlarge`,
    IMG_RIDI_CDN_URL,
  ).toString();
};

// 썸네일을 보여줄 수 있는 상태 ( intersecting 되거나 fetch 종료 ) 일 때도 체크
// loggedUser 가 성인 인증 상태일 경우는 정상 렌더링
// 아닌 경우는 성인 도서 Placeholder 표지
const ThumbnailRenderer: React.FC<ThumbnailRendererProps> = React.memo(
  props => {
    // @ts-ignore
    const { book, isIntersecting, imgSize, width, children, slug, order } = props;
    const { loggedUser } = useSelector((state: RootState) => state.account);
    const is_adult_only = book.detail?.property?.is_adult_only ?? false;
    const imageUrl = computeThumbnailUrl(
      is_adult_only,
      isIntersecting,
      loggedUser?.is_verified_adult,
      book?.detail?.thumbnailId ?? book.b_id,
      imgSize,
      book.detail,
    );
    return (
      <div
        css={css`
          img {
            transition: opacity 2s ease-in-out;
          }
        `}
        className={props.className || ''}
        data-order={order}
        data-book-id={book.b_id}>
        <Book.Thumbnail
          thumbnailWidth={width}
          thumbnailTitle={bookTitleGenerator(book.detail)}
          thumbnailUrl={imageUrl}>
          {children}
          {book.detail?.property?.is_adult_only && (
            <>
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
              <span className={'a11y'} aria-label={'성인 전용 도서'}>
                성인 전용 도서
              </span>
            </>
          )}
        </Book.Thumbnail>
      </div>
    );
  },
  (prev, next) => {
    if (prev.book.b_id !== next.book.b_id) {
      return false;
    }
    if (prev.book.detail !== next.book.detail) {
      return false;
    }
    if (prev.isIntersecting !== next.isIntersecting) {
      return false;
    }
    return prev.imgSize === next.imgSize;
  },
);

export default ThumbnailRenderer;
