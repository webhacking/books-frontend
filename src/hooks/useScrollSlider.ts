import React from 'react';
import { useScrollPosition } from './useScrollPosition';

// [ref, moveLeft, moveRight, isOnStart, isOnEnd, startMarkerRef, endMarkerRef]
export const useScrollSlider = (): [React.RefCallback<HTMLElement>, () => void, () => void, boolean, boolean, React.Ref<Element>, React.Ref<Element>] => {
  const [ref, isOnStart, isOnEnd, startMarkerRef, endMarkerRef, scrollBy] = useScrollPosition();

  const nodeRef = React.useRef<HTMLElement>();
  const callbackRef = React.useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
    ref(node);
  }, [ref]);

  // Todo 디자이너와 협의 후 다른 비율로 움직일지 확인
  const moveRight = React.useCallback(() => {
    if (nodeRef.current) {
      scrollBy(nodeRef.current.clientWidth);
    }
  }, [scrollBy]);

  const moveLeft = React.useCallback(() => {
    if (nodeRef.current) {
      scrollBy(-nodeRef.current.clientWidth);
    }
  }, [scrollBy]);

  return [callbackRef, moveLeft, moveRight, isOnStart, isOnEnd, startMarkerRef, endMarkerRef];
};
