import React, { useRef } from 'react';
import { flexRowStart, scrollBarHidden } from 'src/styles';
import { SelectionBookItem } from 'src/components/BookSections/SelectionBook/SelectionBook';
import { css } from '@emotion/core';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { DisplayType, MdBook } from 'src/types/sections';

const listCSS = css`
  padding-bottom: 48px;
  box-sizing: content-box;
  overflow: auto;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-left: -4px;
      margin-right: 6px;
    `,
  )}
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
  items: MdBook[];
  isAIRecommendation: boolean;
  type: DisplayType;
  genre: string;
}

const SelectionBookList: React.FC<SelectionBookListProps> = props => {
  const ref = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref);
  const { genre, type } = props;

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
              genre={genre}
              type={type}
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
        <Arrow
          label={'이전'}
          side={'left'}
          onClickHandler={moveLeft}
          wrapperStyle={[
            css`
              position: absolute;
              left: 5px;
              transition: opacity 0.2s;
              top: calc(${getArrowVerticalCenterPosition(wrapperRef)});
            `,
            !isOnTheLeft && arrowTransition,
          ]}
        />

        <Arrow
          label={'다음'}
          side={'right'}
          onClickHandler={moveRight}
          wrapperStyle={[
            css`
              position: absolute;
              right: 5px;
              transition: opacity 0.2s;
              top: calc(${getArrowVerticalCenterPosition(wrapperRef)});
            `,
            !isOnTheRight && arrowTransition,
          ]}
        />
      </form>
    </div>
  );
};

export default SelectionBookList;
