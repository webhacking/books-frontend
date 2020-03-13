import styled from '@emotion/styled';
import React from 'react';

interface TransformOptions {
  slideToMove: number;
  slideCount: number;
  inactiveScale: number;
  slideMargin: number;
  touchDiff?: number;
}

function computeTransform(options: TransformOptions) {
  const {
    slideToMove: k,
    slideCount: n,
    inactiveScale: r,
    slideMargin: d,
    touchDiff,
  } = options;
  const commonDivider = 2 * n * r + 1;
  const percentage = (100 * r * k) / commonDivider;
  const pixels = (d * k) / commonDivider;
  const touch = touchDiff ?? 0;
  return `translateX(${-percentage}%) translateX(${-pixels}px) translateX(${touch}px)`;
}

const CarouselView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
`;

const CarouselList = styled.ul<{ slideMargin: number }>`
  flex: none;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  > li + li {
    margin-left: ${(props) => props.slideMargin}px;
  }
`;

export interface BigBannerCarouselProps {
  totalItems: number;
  currentIdx: number;
  itemMargin: number;
  inactiveScale: number;
  children: (props: { index: number; active: boolean; activeIndex: number }) => React.ReactNode;
  touchDiff?: number;
  className?: string;
}

export default function BigBannerCarousel(props: BigBannerCarouselProps) {
  const {
    className, children, totalItems: len, touchDiff, currentIdx, itemMargin, inactiveScale,
  } = props;
  const [previousIdx, setPreviousIdx] = React.useState(currentIdx);
  const [activeIdx, setActiveIdx] = React.useState(currentIdx);
  const [activeDiff, setActiveDiff] = React.useState(touchDiff);
  const [isMoving, setMoving] = React.useState(false);

  const handleTransitionDone = React.useCallback(
    (e: React.TransitionEvent<HTMLUListElement>) => {
      if (e.target !== e.currentTarget) {
        return;
      }
      e.stopPropagation();

      setPreviousIdx(activeIdx);
      setMoving(false);
    },
    [activeIdx],
  );

  React.useEffect(() => {
    setActiveIdx(currentIdx);
    setMoving(true);
  }, [currentIdx]);

  React.useEffect(() => {
    setActiveDiff(touchDiff);
  }, [touchDiff]);

  React.useEffect(() => {
    if (activeDiff != null) {
      setPreviousIdx(activeIdx);
      setMoving(false);
    }
  }, [activeDiff, activeIdx]);

  const idxArray = Array.from(
    { length: len },
    (_, idx) => (idx + previousIdx) % len,
  );

  const itemNodesSub = idxArray.map(
    (index) => children({ index, active: false, activeIndex: activeIdx }),
  );
  const itemNodes = idxArray.map(
    (index) => children({ index, active: index === activeIdx, activeIndex: activeIdx }),
  );
  let delta = activeIdx - previousIdx;
  if (Math.abs(delta) > Math.abs(delta + len)) {
    delta += len;
  }
  if (Math.abs(delta) > Math.abs(delta - len)) {
    delta -= len;
  }
  return (
    <CarouselView className={className}>
      <CarouselList
        slideMargin={itemMargin}
        style={{
          transition: isMoving ? 'transform 0.2s' : undefined,
          transform: computeTransform({
            slideToMove: delta,
            slideCount: len,
            touchDiff: activeDiff,
            inactiveScale,
            slideMargin: itemMargin,
          }),
        }}
        onTransitionEnd={handleTransitionDone}
      >
        {itemNodesSub}
        {itemNodes}
        {children({ index: previousIdx, active: false, activeIndex: activeIdx })}
      </CarouselList>
    </CarouselView>
  );
}

BigBannerCarousel.defaultProps = {
  itemMargin: 10,
  inactiveScale: 1,
};
