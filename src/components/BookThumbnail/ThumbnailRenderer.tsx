import React, { useEffect, useRef, useState } from 'react';
import * as BookApi from 'src/types/book';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import { css } from '@emotion/core';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';
import { SerializedStyles } from '@emotion/serialize';

export const IMG_RIDI_CDN_URL = 'https://img.ridicdn.net';

interface ThumbnailRendererProps {
  book: {
    b_id: string;
    detail?: BookApi.Book;
  };
  imgSize: 'xxlarge' | 'xlarge' | 'large' | 'small' | 'medium';
  isIntersecting?: boolean;
  slug?: string;
  order?: number;
  className?: string;
  responsiveWidth: Array<SerializedStyles>;
  bookDecorators?: React.ReactNode;
}
const ADULT_COVER_URL = new URL(
  '/static/image/cover_adult.png',
  publicRuntimeConfig.STATIC_CDN_URL,
).toString();
const PLACEHOLDER_COVER_URL = new URL(
  '/static/image/cover_lazyload.png',
  publicRuntimeConfig.STATIC_CDN_URL,
).toString();

const computeThumbnailUrl = (
  isAdultOnly: boolean,
  // @ts-ignore
  isIntersection: boolean,
  isVerifiedAdult: boolean | null,
  bId: string,
  imageSize?: string,
  book?: BookApi.Book,
) => {
  // if (!isIntersection) {
  //   return PLACEHOLDER_COVER_URL;
  // }
  if (isAdultOnly && !isVerifiedAdult) {
    return ADULT_COVER_URL;
  }

  if (book?.series) {
    if (book.series.property.is_completed) {
      return new URL(
        imageSize
          ? `/cover/${bId}/${imageSize}?dpi=xhdpi`
          : `/cover/${bId}/large?dpi=xhdpi`,
        IMG_RIDI_CDN_URL,
      ).toString();
    }
    if (book?.series.property.opened_last_volume_id.length !== 0) {
      return new URL(
        imageSize
          ? `/cover/${book.series.property.opened_last_volume_id}/${imageSize}?dpi=xhdpi`
          : `/cover/${book.series.property.opened_last_volume_id}/large?dpi=xhdpi`,
        IMG_RIDI_CDN_URL,
      ).toString();
    }
  }

  return new URL(
    imageSize ? `/cover/${bId}/${imageSize}?dpi=xhdpi` : `/cover/${bId}/large?dpi=xhdpi`,
    IMG_RIDI_CDN_URL,
  ).toString();
};

const thumbnailWrapperCSS = css`
  position: relative;
  line-height: 0;
  max-height: inherit;
  
  &::after {
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
    linear-gradient(to right,rgba(0, 0, 0, .2) 0,
      rgba(0, 0, 0, 0) 5%,
      rgba(0, 0, 0, 0) 95%,
      rgba(0, 0, 0, .2) 100%
    );
    border: solid 1px rgba(0, 0, 0, .1);
    content: '';
  },
`;

// 썸네일을 보여줄 수 있는 상태 ( intersecting 되거나 fetch 종료 ) 일 때도 체크
// loggedUser 가 성인 인증 상태일 경우는 정상 렌더링
// 아닌 경우는 성인 도서 Placeholder 표지
const ThumbnailRenderer: React.FC<ThumbnailRendererProps> = React.memo(props => {
  // @ts-ignore
  const { book, isIntersecting, imgSize, responsiveWidth, children, slug, order } = props;
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const is_adult_only = book.detail?.property?.is_adult_only ?? false;
  const imgRef = useRef<HTMLImageElement>(null);

  const imageUrl = computeThumbnailUrl(
    is_adult_only,
    isIntersecting,
    loggedUser?.is_verified_adult,
    book?.detail?.thumbnailId ?? book.b_id,
    imgSize,
    book.detail,
  );
  const imageOnLoad = () => {
    setImageLoaded(true);
  };

  const title = bookTitleGenerator(book.detail);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.src = imageUrl;
    }
  }, []);
  return (
    <div
      css={[thumbnailWrapperCSS]}
      className={props.className || ''}
      data-order={order}
      data-book-id={book.b_id}>
      <img
        ref={imgRef}
        css={[
          responsiveWidth,
          isIntersecting || isImageLoaded
            ? css`
                padding-bottom: 0;
                background-image: inherit;
                height: inherit;
              `
            : css`
                padding-bottom: 142%;
                height: 0;
                background-image: linear-gradient(147deg, #e6e8eb, #edeff2 55%, #e6e8eb);
              `,
        ]}
        src={imageUrl}
        alt={title}
        onLoad={imageOnLoad}
      />
      {children}
    </div>
  );
});
export default ThumbnailRenderer;
