import React from 'react';
import horizontalAnimateScroll from 'src/utils/scrollTo';

function useRefWithPrevious<T>(
  callback: (val: T | null, previous: T | null) => void,
  deps: any[],
): [React.RefCallback<T>, React.RefObject<T>] {
  const innerRef = React.useRef<T | null>(null);
  const callbackRef = React.useCallback((val: T | null) => {
    callback(val, innerRef.current);
    innerRef.current = val;
  }, deps);
  return [callbackRef, innerRef];
}

// [ref, isOnStart, isOnEnd, startMarkerRef, endMarkerRef, scrollBy]
export const useScrollPosition = (): [React.RefCallback<HTMLElement>, boolean, boolean, React.Ref<Element>, React.Ref<Element>, (leftValue: number) => void] => {
  // 둘 다 보인다고 가정
  const [isOnStart, setOnStart] = React.useState(true);
  const [isOnEnd, setOnEnd] = React.useState(true);

  const nodeRef = React.useRef<HTMLElement>();

  const rafId = React.useRef<number>();
  const scrollBy = React.useCallback(
    (left: number) => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (nodeRef.current) {
        try {
          horizontalAnimateScroll(nodeRef, left, 300, rafId);
        } catch (error) {
          // 사파리에서 scrollOptions 지원하지 않음
          // ref.current.scroll({ left: ref.current.scrollLeft + left, behavior: 'smooth' });
        }
      }
    },
    [],
  );

  const handleWheelEvent = React.useCallback(
    (event) => {
      if (Math.abs(event.deltaX) > 10 && rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    },
    [],
  );

  const ioRef = React.useRef<IntersectionObserver | false>();
  const markerRefCallback = (val: Element | null, previous: Element | null) => {
    if (!ioRef.current) {
      return;
    }
    if (previous != null) {
      ioRef.current.unobserve(previous);
    }
    if (val != null) {
      ioRef.current.observe(val);
    }
  };
  const [startMarkerRef, innerStartMarkerRef] = useRefWithPrevious<Element>(markerRefCallback, []);
  const [endMarkerRef, innerEndMarkerRef] = useRefWithPrevious<Element>(markerRefCallback, []);
  const callbackRef = React.useCallback((node: HTMLElement | null) => {
    if (nodeRef.current !== node) {
      nodeRef.current?.removeEventListener('wheel', handleWheelEvent);
      if (ioRef.current) {
        ioRef.current.disconnect();
        ioRef.current = undefined;
      }
    }
    if (node != null) {
      node.addEventListener('wheel', handleWheelEvent);
      if (typeof IntersectionObserver === 'function') {
        // root가 다르기 때문에 컨테이너 하나당 하나의 IntersectionObserver가 필요함
        ioRef.current = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const visible = Boolean(entry.isIntersecting || entry.intersectionRatio > 0);
            if (entry.target === innerStartMarkerRef.current) {
              setOnStart(visible);
            } else if (entry.target === innerEndMarkerRef.current) {
              setOnEnd(visible);
            }
          });
        }, { root: node });
        if (innerStartMarkerRef.current != null) {
          ioRef.current.observe(innerStartMarkerRef.current);
        }
        if (innerEndMarkerRef.current != null) {
          ioRef.current.observe(innerEndMarkerRef.current);
        }
      } else {
        ioRef.current = false;
      }
    }
    nodeRef.current = node;
  }, []);

  React.useEffect(() => () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
  }, []);

  return [callbackRef, isOnStart, isOnEnd, startMarkerRef, endMarkerRef, scrollBy];
};
