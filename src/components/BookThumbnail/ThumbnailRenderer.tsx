import React, { useState } from 'react';
import * as BookApi from 'src/types/book';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import styled from '@emotion/styled';
import { useViewportIntersection } from 'src/hooks/useViewportIntersection';
import { sendDisplayEvent } from 'src/hooks/useEventTracker';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';


import coverAdult from 'src/assets/image/cover_adult.png';
// import coverLazyload from 'src/assets/image/cover_lazyload.png';

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
  sizes: string;
  bookDecorators?: React.ReactNode;
}

const SIZE_PARAMS = [
  { width: 50, path: 'small' },
  { width: 90, path: 'small' },
  { width: 120, path: 'small?dpi=xhdpi' },
  { width: 165, path: 'large' },
  { width: 180, path: 'small?dpi=xxhdpi' },
  { width: 220, path: 'large?dpi=xhdpi' },
  { width: 225, path: 'xlarge' },
  { width: 300, path: 'xlarge?dpi=xhdpi' },
  { width: 330, path: 'large?dpi=xxhdpi' },
  { width: 450, path: 'xlarge?dpi=xxhdpi' },
  { width: 480, path: 'xxlarge' },
  { width: 640, path: 'xxlarge?dpi=xhdpi' },
  { width: 960, path: 'xxlarge?dpi=xxhdpi' },
];

const computeThumbnailUrl = (
  isAdultOnly: boolean,
  isIntersection: boolean,
  isVerifiedAdult: boolean | null,
  bId: string,
  imageSize?: string,
  book?: BookApi.Book,
) => {
  if (!isIntersection) {
    return { src: undefined, srcset: undefined };
  }
  if (isAdultOnly && !isVerifiedAdult) {
    return { src: coverAdult, srcset: undefined };
  }

  let baseCoverUrl = new URL(`/cover/${bId}/`, IMG_RIDI_CDN_URL);
  if (book?.series) {
    if (!book.series.property.is_completed && book.series.property.opened_last_volume_id.length !== 0) {
      baseCoverUrl = new URL(
        `/cover/${book.series.property.opened_last_volume_id}/`,
        IMG_RIDI_CDN_URL,
      );
    }
  }

  const src = new URL(
    imageSize ? `${imageSize}?dpi=xhdpi` : 'large?dpi=xhdpi',
    baseCoverUrl,
  ).toString();
  const srcset = SIZE_PARAMS.map(({ width, path }) => (
    `${new URL(path, baseCoverUrl).toString()} ${width}w`
  )).join(', ');
  return { src, srcset };
};

const ThumbnailWrapper = styled.div`
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

const Thumbnail = styled.img<{ active?: boolean }>`
  ${(props) => !props.active && `
    padding-bottom: 142%;
    height: 0;
    background-image: linear-gradient(147deg, #e6e8eb, #edeff2 55%, #e6e8eb);
  `}
`;
const ThumbnailNoImg = Thumbnail.withComponent('div');

// 썸네일을 보여줄 수 있는 상태 ( intersecting 되거나 fetch 종료 ) 일 때도 체크
// loggedUser 가 성인 인증 상태일 경우는 정상 렌더링
// 아닌 경우는 성인 도서 Placeholder 표지
const ThumbnailRenderer: React.FC<ThumbnailRendererProps> = React.memo((props) => {
  const {
    book, imgSize, sizes, children, slug, order,
  } = props;
  const bId = book.b_id;
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const handleVisibleRef = React.useRef<boolean>(false);
  const handleVisible = React.useCallback((visible) => {
    setVisible(visible);
    if (!handleVisibleRef.current && visible) {
      sendDisplayEvent({ slug, id: bId, order });
      handleVisibleRef.current = true;
    }
  }, [slug, bId, order]);
  const ref = useViewportIntersection<HTMLDivElement>(handleVisible);
  const is_adult_only = book.detail?.property?.is_adult_only ?? false;

  const { src: imageUrl, srcset: imageUrlSet } = computeThumbnailUrl(
    is_adult_only,
    isVisible,
    loggedUser?.is_verified_adult,
    book?.detail?.thumbnailId ?? book.b_id,
    imgSize,
    book.detail,
  );
  const imageOnLoad = () => {
    setImageLoaded(true);
  };

  const title = bookTitleGenerator(book.detail);

  return (
    <ThumbnailWrapper ref={ref}>
      {isVisible ? (
        <Thumbnail
          active={isImageLoaded}
          className={props.className}
          src={imageUrl}
          srcSet={imageUrlSet}
          sizes={sizes}
          alt={title}
          onLoad={imageOnLoad}
        />
      ) : (
        <ThumbnailNoImg
          className={props.className}
          role="img"
          aria-label={title}
        />
      )}
      {children}
    </ThumbnailWrapper>
  );
});
export default ThumbnailRenderer;
