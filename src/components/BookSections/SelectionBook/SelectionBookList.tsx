import React, { useRef } from 'react';
import { flexRowStart, scrollBarHidden } from 'src/styles';
import { BookScheme } from 'src/types/book';
import { SelectionBookItem } from 'src/components/BookSections/SelectionBook/SelectionBook';
import { css } from '@emotion/core';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import Arrow from 'src/components/Carousel/Arrow';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { useScrollSlider } from 'src/hooks/useScrollSlider';

const listCSS = css`
  padding-bottom: 48px;
  box-sizing: content-box;
  overflow: auto;
`;

const itemCSS = css`
  display: flex;
  flex-direction: column;
  :first-of-type {
    padding-left: 20px;
  }
  margin-right: 20px;
  :last-of-type {
    padding-right: 20px;
  }
  box-sizing: content-box;

  ${orBelow(
    BreakPoint.MD,
    css`
      :last-of-type {
        padding-right: 16px;
      }
      :first-of-type {
        padding-left: 16px;
      }
    `,
  )};
  align-items: flex-start;
`;

interface SelectionBookListProps {
  items: BookScheme[];
  isAIRecommendation: boolean;
}

const SelectionBookList: React.FC<SelectionBookListProps> = props => {
  const ref = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref);

  return (
    <div
      ref={wrapperRef}
      css={css`
        position: relative;
      `}>
      <ul ref={ref} css={[flexRowStart, scrollBarHidden, listCSS]}>
        {props.items.map((item, index) => (
          <li key={index} css={itemCSS}>
            <SelectionBookItem
              isAIRecommendation={props.isAIRecommendation}
              book={item}
              width={120}
            />
          </li>
        ))}
      </ul>
      <form
        css={css`
          height: 0;
          @media (hover: none) {
            display: none;
          }
        `}>
        {isOnTheLeft && (
          <Arrow
            label={'이전'}
            side={'left'}
            onClickHandler={moveLeft}
            wrapperStyle={css`
              position: absolute;
              left: 5px;
              top: calc(${getArrowVerticalCenterPosition(wrapperRef)});
            `}
          />
        )}
        {isOnTheRight && (
          <Arrow
            label={'다음'}
            side={'right'}
            onClickHandler={moveRight}
            wrapperStyle={css`
              position: absolute;
              right: 5px;
              top: calc(${getArrowVerticalCenterPosition(wrapperRef)});
            `}
          />
        )}
      </form>
    </div>
  );
};

export default SelectionBookList;
