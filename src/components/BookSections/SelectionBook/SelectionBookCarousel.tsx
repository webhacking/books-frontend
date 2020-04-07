import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Arrow from 'src/components/Carousel/Arrow';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import BooksCarousel from 'src/components/Carousel/BooksCarousel';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';
import { DisplayType, MdBook } from 'src/types/sections';

import SelectionBookItem from './SelectionBookItem';

const arrowWrapperCSS = css`
  position: absolute;
  top: calc(50% - 9px);
`;

const CarouselWrapper = styled.div`
  width: 1005px;
  max-width: 1005px;
  margin: 6px auto 0;
  position: relative;
  height: 100%;
`;

const BookItemWrapper = styled.li`
  display: flex;
  flex-direction: column;
  outline: none;
`;

export interface SelectionBookCarouselProps {
  items: MdBook[]; // Fixme Md 타입 말고 comics UserPreferredSection 타입이 API 결과로 오는데 이 부분 확인해야 함
  isAIRecommendation: boolean;
  genre: string;
  type: DisplayType;
  bookFetching?: boolean;
  slug?: string;
}

const SelectionBookCarousel: React.FC<SelectionBookCarouselProps> = (props) => {
  const {
    genre, type, isAIRecommendation, slug,
  } = props;

  const { items } = props;
  const books = React.useMemo(
    () => items.filter((book) => book.detail),
    [items],
  );
  const totalItems = books.length;

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const handleLeftArrow = React.useCallback(() => {
    setCurrentIdx((idx) => {
      const page = Math.ceil(idx / 6);
      if (page === 0) {
        return totalItems - 6;
      }
      return (page - 1) * 6;
    });
  }, [totalItems]);
  const handleRightArrow = React.useCallback(() => {
    setCurrentIdx((idx) => {
      if (idx + 6 === totalItems) {
        return 0;
      }
      if (idx + 12 > totalItems) {
        return totalItems - 6;
      }
      return idx + 6;
    });
  }, [totalItems]);

  return (
    <CarouselWrapper>
      <BooksCarousel
        totalItems={books.length}
        itemsInPage={6}
        currentIdx={currentIdx}
        itemWidth={140}
        itemMargin={22}
      >
        {({ index }) => (
          <BookItemWrapper key={index}>
            <SelectionBookItem
              order={index}
              genre={genre}
              slug={slug}
              isAIRecommendation={isAIRecommendation}
              excluded={books[index]?.excluded ?? false}
              book={books[index]}
              type={type}
              width={140}
            />
          </BookItemWrapper>
        )}
      </BooksCarousel>
      {props.items.length > 6 && (
        <form css={css`height: 0;`}>
          <Arrow
            label="이전"
            side="left"
            onClickHandler={handleLeftArrow}
            wrapperStyle={css`
              ${arrowWrapperCSS};
              ${greaterThanOrEqualTo(
              BreakPoint.XL + 1,
              'left: -29px;',
            )};
              left: 5px;
              top: ${getArrowVerticalCenterPosition()};
            `}
          />

          <Arrow
            label="다음"
            side="right"
            onClickHandler={handleRightArrow}
            wrapperStyle={css`
              ${arrowWrapperCSS};
              ${greaterThanOrEqualTo(
              BreakPoint.XL + 1,
              'right: -36px;',
            )};
              right: 5px;
              top: ${getArrowVerticalCenterPosition()};
            `}
          />
        </form>
      )}
    </CarouselWrapper>
  );
};

export default React.memo(SelectionBookCarousel);
