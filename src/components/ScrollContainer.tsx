import React from 'react';
import { css, Interpolation } from '@emotion/core';
import styled from '@emotion/styled';

import Arrow from 'src/components/Carousel/Arrow';
import { useDeviceType } from 'src/hooks/useDeviceType';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { displayNoneForTouchDevice, scrollBarHidden } from 'src/styles';

const ControllerContainer = styled.div`
  position: relative;
`;

const SlidingContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  ${scrollBarHidden}
`;

const Marker = styled.div`
  flex: none;
  width: 1px;
`;

const Content = styled.div`
  flex: 1 0 auto;
`;

const SliderControllerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 4px;

  display: flex;
  justify-content: space-between;
  pointer-events: none;

  ${displayNoneForTouchDevice}
`;

const baseArrowStyle = css`
  transition: opacity 0.2s;
  pointer-events: auto;
`;

const arrowHiddenStyle = css`
  opacity: 0;
  pointer-events: none;
`;

const arrowCenterStyle = css`
  align-items: center;
`;

interface SliderControllerProps {
  theme?: 'white' | 'dark';
  leftArrowLabel: string;
  rightArrowLabel: string;
  showLeftArrow?: boolean;
  showRightArrow?: boolean;
  onLeftClick?(): void;
  onRightClick?(): void;
  className?: string;
  arrowType?: 'normal' | 'bold';
}

function SliderController(props: SliderControllerProps) {
  const { isMobile } = useDeviceType();
  if (isMobile) {
    return null;
  }

  const {
    theme,
    leftArrowLabel,
    rightArrowLabel,
    showLeftArrow,
    showRightArrow,
    onLeftClick,
    onRightClick,
    className,
    arrowType,
  } = props;
  return (
    <SliderControllerContainer className={className}>
      <Arrow
        onClickHandler={onLeftClick}
        label={leftArrowLabel}
        color={theme}
        side="left"
        wrapperStyle={[
          baseArrowStyle,
          !showLeftArrow && arrowHiddenStyle,
        ]}
        arrowType={arrowType}
      />
      <Arrow
        label={rightArrowLabel}
        onClickHandler={onRightClick}
        color={theme}
        side="right"
        wrapperStyle={[
          baseArrowStyle,
          !showRightArrow && arrowHiddenStyle,
        ]}
        arrowType={arrowType}
      />
    </SliderControllerContainer>
  );
}

interface Props {
  theme?: 'white' | 'dark';
  leftArrowLabel: string;
  rightArrowLabel: string;
  arrowStyle?: 'center' | Interpolation;
  className?: string;
  children?: React.ReactNode | ((focusElementRef: React.Ref<HTMLElement>) => React.ReactNode);
  arrowType?: 'normal' | 'bold';
}

export default function ScrollContainer(props: Props) {
  const {
    theme,
    leftArrowLabel,
    rightArrowLabel,
    arrowStyle = 'center',
    className,
    children,
    arrowType,
  } = props;
  const [scrollRef, moveLeft, moveRight, focusElement, isOnStart, isOnEnd, leftMarkerRef, rightMarkerRef] = useScrollSlider();
  const [focusedElement, setFocusedElement] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => {
    if (focusedElement != null) {
      focusElement(focusedElement);
    }
  }, [focusedElement]);
  const content = typeof children === 'function' ? children(setFocusedElement) : children;
  return (
    <ControllerContainer className={className}>
      <SlidingContainer ref={scrollRef as React.Ref<HTMLDivElement>}>
        <Marker ref={leftMarkerRef as React.Ref<HTMLDivElement>} />
        <Content>
          {content}
        </Content>
        <Marker ref={rightMarkerRef as React.Ref<HTMLDivElement>} />
      </SlidingContainer>
      <SliderController
        theme={theme}
        leftArrowLabel={leftArrowLabel}
        rightArrowLabel={rightArrowLabel}
        showLeftArrow={!isOnStart}
        showRightArrow={!isOnEnd}
        onLeftClick={moveLeft}
        onRightClick={moveRight}
        css={arrowStyle === 'center' ? arrowCenterStyle : arrowStyle}
        arrowType={arrowType}
      />
    </ControllerContainer>
  );
}

ScrollContainer.defaultProps = {
  leftArrowLabel: '이전',
  rightArrowLabel: '다음',
};
