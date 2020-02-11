import React from 'react';
import Slider, { Settings } from 'react-slick';

export interface SliderCarouselWrapperProps {
  forwardedRef?: React.RefObject<Slider>;
  children?: React.ReactNode;
}

const SliderCarouselWrapper = React.memo((
  props: Settings & SliderCarouselWrapperProps,
) => {
  const { forwardedRef, ...restProps } = props;
  return <Slider {...restProps} ref={forwardedRef} />;
});

export default SliderCarouselWrapper;
