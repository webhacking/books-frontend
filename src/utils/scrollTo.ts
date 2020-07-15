import React from 'react';
// easing functions
// https://gist.github.com/gre/1650294
const easings: {[index: string]: Function} = {
  linear(t: number) {
    return t;
  },
  easeInQuad(t: number) {
    return t ** 2;
  },
  easeOutQuad(t: number) {
    return t * (2 - t);
  },
  easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t ** 2 : -1 + (4 - 2 * t) * t;
  },
  easeInCubic(t: number) {
    return t ** 3;
  },
  easeOutCubic(t: number) {
    return ((t - 1) ** 3) + 1;
  },
  easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart(t: number) {
    return t ** 4;
  },
  easeOutQuart(t: number) {
    return 1 - (t - 1) ** 4;
  },
  easeInOutQuart(t: number) {
    return t < 0.5 ? 8 * t ** 4 : 1 - 8 * (t - 1) ** 4;
  },
  easeInQuint(t: number) {
    return t ** 5;
  },
  easeOutQuint(t: number) {
    return 1 + (t - 1) ** 5;
  },
  easeInOutQuint(t: number) {
    return t < 0.5 ? 16 * t ** 5 : 1 + 16 * (t - 1) ** 5;
  },
};

const horizontalAnimateScroll = (
  element: React.MutableRefObject<HTMLElement | null>,
  moveTo: number,
  duration: number,
  refRafId: React.MutableRefObject<number | undefined>,
  easing = 'easeInOutQuad',
) => {
  if (!element.current) {
    return;
  }
  const startScrollPosition = element.current.scrollLeft;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const scrollToPosition = element.current.scrollLeft + moveTo <= 0
    ? 0
    : Math.round(element.current.scrollLeft + moveTo);

  if ('requestAnimationFrame' in window) {
    const scroll = () => {
      if (!element.current) {
        return;
      }
      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, (now - startTime) / duration);
      const timeFunction = easings[easing](time);

      if (element.current.scroll) {
        element.current.scroll(
          Math.ceil(
            timeFunction * (scrollToPosition - startScrollPosition) + startScrollPosition,
          ),
          0,
        );
      } else {
        element.current.scrollLeft = Math.ceil(
          timeFunction * (scrollToPosition - startScrollPosition) + startScrollPosition,
        );
      }

      const isRightScrollMax = moveTo > 0
        && element.current.scrollWidth
          === element.current.scrollLeft + element.current.clientWidth;
      const finished = element.current.scrollLeft === scrollToPosition || isRightScrollMax;

      if (finished) {
        return;
      }

      refRafId.current = requestAnimationFrame(scroll);
    };
    scroll();
  }
  if (element.current.scroll) {
    element.current.scroll(scrollToPosition, 0);
  } else {
    element.current.scrollLeft = scrollToPosition;
  }
};

export default horizontalAnimateScroll;
