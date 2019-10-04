import React, { useRef } from 'react';
import { Book } from '@ridi/web-ui/dist/index.node';
import {
  BookList,
  BookMeta,
  BookScheme,
  hotReleaseBookListCSS,
  recommendedBookListCSS,
} from 'src/components/RecommendedBook/RecommendedBook';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { css } from '@emotion/core';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { useScrollSlider } from 'src/hooks/useScrollSlider';

interface RecommendedBookListProps {
  items: BookScheme[];
  type: 'hot_release' | 'single_book_recommendation';
}

const RecommendedBookList: React.FC<RecommendedBookListProps> = props => {
  const ref = useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref);

  return (
    <div
      css={css`
        position: relative;
      `}>
      <BookList
        ref={ref}
        css={
          props.type === 'hot_release' ? hotReleaseBookListCSS : recommendedBookListCSS
        }>
        {props.items.map((book, index) => (
          <PortraitBook key={index}>
            <ThumbnailWrapper>
              <Book.Thumbnail
                adultBadge={true}
                thumbnailWidth={120}
                thumbnailUrl={`https://misc.ridibooks.com/cover/${book.id}/xxlarge`}
              />
            </ThumbnailWrapper>
            <BookMeta book={book} />
          </PortraitBook>
        ))}
      </BookList>
      <form
        css={css`
          @media (hover: none) {
            display: none;
          }
        `}>
        <Arrow
          onClickHandler={moveLeft}
          label={'이전'}
          color={'dark'}
          side={'left'}
          wrapperStyle={[
            css`
              left: 5px;
              position: absolute;
              transition: opacity 0.2s;
              top: calc(${getArrowVerticalCenterPosition(ref, '30px')});
            `,
            !isOnTheLeft && arrowTransition,
          ]}
        />
        <Arrow
          label={'다음'}
          onClickHandler={moveRight}
          color={'dark'}
          side={'right'}
          wrapperStyle={[
            css`
              right: 5px;
              position: absolute;
              transition: opacity 0.2s;
              top: calc(${getArrowVerticalCenterPosition(ref, '30px')});
            `,
            !isOnTheRight && arrowTransition,
          ]}
        />
      </form>
    </div>
  );
};

export default RecommendedBookList;
