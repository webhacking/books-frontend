import * as React from 'react';
import Slider, { Settings } from 'react-slick';

const LoadableCarousel: React.RefForwardingComponent<
  Settings,
  { forwardedRef: React.RefObject<Slider> }
> = ({ forwardedRef, ...rest }) => (
  <Slider ref={forwardedRef} {...rest}>
    {rest.children}
  </Slider>
);

export default LoadableCarousel;
