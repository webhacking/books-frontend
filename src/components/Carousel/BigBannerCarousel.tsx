import styled from '@emotion/styled';
import React from 'react';

interface TransformOptions {
  delta: number;
  count: number;
  touchDiff?: number;
  ratio: number;
  dist: number;
}

function computeTransform(options: TransformOptions) {
  const {
    delta, count, touchDiff, ratio, dist,
  } = options;
  const percentage = (100 * delta) / (2 * count - 2 + 1 / ratio);
  const pixels = (dist * delta) / (2 * count * ratio - 2 * ratio + 1);
  const touch = touchDiff ?? 0;
  return `translateX(${-percentage}%) translateX(${-pixels}px) translateX(${touch}px)`;
}

const CarouselView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
`;

const CarouselList = styled.ul<{ height: number; dist: number }>`
  flex: none;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: ${(props) => props.height}px;

  > * + * {
    margin-left: ${(props) => props.dist}px;
  }
`;

export interface BigBannerCarouselProps {
  totalItems: number;
  currentIdx: number;
  itemWidth: number;
  itemDist: number;
  inactiveItemRatio: number;
  children: (props: { index: number; activeIndex: number; itemWidth: number }) => React.ReactNode;
  touchDiff?: number;
}

export default function BigBannerCarousel(props: BigBannerCarouselProps) {
  const {
    children, totalItems: len, touchDiff, currentIdx, itemWidth, itemDist, inactiveItemRatio,
  } = props;
  const [previousIdx, setPreviousIdx] = React.useState(currentIdx);
  const [activeIdx, setActiveIdx] = React.useState(currentIdx);
  const [activeDiff, setActiveDiff] = React.useState(touchDiff);
  const [isMoving, setMoving] = React.useState(false);
  const itemHeight = (itemWidth * 2) / 3;

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

  const itemNodes = idxArray.map(
    (index) => children({ index, activeIndex: activeIdx, itemWidth }),
  );
  let delta = activeIdx - previousIdx;
  if (Math.abs(delta) > Math.abs(delta + len)) {
    delta += len;
  }
  if (Math.abs(delta) > Math.abs(delta - len)) {
    delta -= len;
  }
  return (
    <CarouselView>
      <CarouselList
        height={itemHeight}
        dist={itemDist}
        style={{
          transition: isMoving ? 'transform 0.2s' : undefined,
          transform: computeTransform({
            delta,
            count: len,
            touchDiff: activeDiff,
            ratio: inactiveItemRatio,
            dist: itemDist,
          }),
        }}
        onTransitionEnd={handleTransitionDone}
      >
        {itemNodes.slice(1)}
        {itemNodes}
      </CarouselList>
    </CarouselView>
  );
}

BigBannerCarousel.defaultProps = {
  itemDist: 10,
  inactiveItemRatio: 1,
};
