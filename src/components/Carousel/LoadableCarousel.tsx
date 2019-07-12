import * as React from 'react';
import Slider, { Settings } from 'react-slick';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const LoadableCarousel: React.RefForwardingComponent<
  Settings,
  { forwardedRef: React.RefObject<Slider> }
> = ({ forwardedRef, ...rest }) => (
  <Slider ref={forwardedRef} {...rest}>
    {rest.children}
  </Slider>
);

const DynamicSlider = dynamic(() => import('src/components/Carousel/LoadableCarousel'), {
  ssr: false,
});

export const ForwardedRefComponent = React.forwardRef<Slider, Settings & { children: ReactNode }>(
  (props, ref: React.RefObject<Slider>) => {
    return <DynamicSlider {...props} forwardedRef={ref} />;
  },
);

// @ts-ignore
export default LoadableCarousel;
