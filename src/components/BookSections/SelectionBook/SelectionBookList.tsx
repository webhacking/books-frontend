import React, { useCallback, useContext, useRef } from 'react';
import { displayNoneForTouchDevice, flexRowStart, scrollBarHidden } from 'src/styles';
import { SelectionBookItem } from 'src/components/BookSections/SelectionBook/SelectionBook';
import { css } from '@emotion/core';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { DisplayType, MdBook } from 'src/types/sections';
import { DeviceTypeContext } from 'src/components/Context/DeviceType';
import { useExcludeRecommendation } from 'src/hooks/useExcludeRecommedation';
import { useMultipleIntersectionObserver } from 'src/hooks/useMultipleIntersectionObserver';
import { useEventTracker } from 'src/hooks/useEveneTracker';

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
  const [tracker] = useEventTracker();
  const [requestExclude, requestCancel] = useExcludeRecommendation();

  const sendEvent = useCallback(
    (intersectionItems: IntersectionObserverEntry[]) => {
      const trackingItems = { section: slug, items: [] };
      intersectionItems.forEach(item => {
        const bId = item.target.getAttribute('data-book-id');
        const order = item.target.getAttribute('data-order');
        trackingItems.items.push({
          id: bId,
          idx: order,
          ts: Date.now(),
        });
      });
      if (trackingItems.items.length > 0) {
        tracker.sendEvent('display', trackingItems);
      }
    },
    [slug, tracker],
  );
  useMultipleIntersectionObserver(ref, slug, sendEvent);

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
