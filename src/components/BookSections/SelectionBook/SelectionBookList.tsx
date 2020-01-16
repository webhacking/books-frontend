import React, { useContext, useRef } from 'react';
import { displayNoneForTouchDevice, flexRowStart, scrollBarHidden } from 'src/styles';
import { SelectionBookItem } from 'src/components/BookSections/SelectionBook/SelectionBook';
import { css } from '@emotion/core';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { DisplayType, MdBook } from 'src/types/sections';
import { DeviceTypeContext } from 'src/components/Context/DeviceType';
import { useExcludeRecommendation } from 'src/hooks/useExcludeRecommedation';
import { useMultipleIntersectionObserver } from 'src/hooks/useMultipleIntersectionObserver';
import { useSendDisplayEvent } from 'src/hooks/useEventTracker';

export const listCSS = css`
  box-sizing: content-box;
  overflow: auto;
  overflow-y: hidden;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-left: -5px;
      //margin-right: 6px;
    `,
  )}
`;

export const itemCSS = css`
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
      margin-right: 12px;
      :last-of-type {
        padding-right: 24px;
      }
      :first-of-type {
        padding-left: 16px;
      }
    `,
  )};
  ${between(
    834,
    999,
    css`
      margin-right: 20px;
    `,
  )};
  align-items: flex-start;
`;

export const loadingItemCSS = css`
  display: flex;
  flex-direction: row;
  :first-of-type {
    padding-left: 18px;
  }
  margin-right: 20px;
  :last-of-type {
    padding-right: 19px;
  }
  box-sizing: content-box;

  ${orBelow(
    BreakPoint.MD,
    css`
      margin-right: 12px;
      :last-of-type {
        padding-right: 24px;
      }
      :first-of-type {
        padding-left: 13px;
      }
    `,
  )};
  ${between(
    834,
    999,
    css`
      :first-of-type {
        padding-left: 17px;
      }
      margin-right: 20px;
    `,
  )};
  align-items: flex-start;
`;

interface SelectionBookListProps {
  items: MdBook[];
  isAIRecommendation: boolean;
  type: DisplayType;
  genre: string;
  isIntersecting: boolean;
  slug: string;
}

const SelectionBookList: React.FC<SelectionBookListProps> = props => {
  const ref = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref);
  const { genre, type, isIntersecting, slug } = props;
  const deviceType = useContext(DeviceTypeContext);
  // @ts-ignore
  const [requestExclude, requestCancel] = useExcludeRecommendation();

  const sendDisplayEvent = useSendDisplayEvent(slug);
  useMultipleIntersectionObserver(ref, slug, sendDisplayEvent);

  return (
    <div
      ref={wrapperRef}
      css={css`
        margin-top: 6px;
        position: relative;
      `}>
      <ul ref={ref} css={[flexRowStart, scrollBarHidden, listCSS]}>
        {props.items
          .filter(item => item.detail)
          .map((item, index) => (
            <li key={index} css={itemCSS}>
              <SelectionBookItem
                order={index}
                slug={slug}
                isIntersecting={isIntersecting}
                genre={genre}
                type={type}
                isAIRecommendation={props.isAIRecommendation}
                aiRecommendationCallback={{
                  exclude: requestExclude,
                  excludeCancel: requestCancel,
                }}
                excluded={item.excluded ?? false}
                book={item}
                width={100}
              />
            </li>
          ))}
      </ul>
      {!['mobile', 'tablet'].includes(deviceType) && (
        <form
          css={[
            css`
              height: 0;
            `,
            displayNoneForTouchDevice,
          ]}>
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
      )}
    </div>
  );
};

export default SelectionBookList;
