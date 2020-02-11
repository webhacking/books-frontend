import React, { useCallback } from 'react';

export const useMultipleIntersectionObserver = (
  parentRef: React.RefObject<HTMLElement>,
  childClassName: string,
  // @ts-ignore
  callBack?: any,
  // @ts-ignore
  isMounted = true,
) => {
  const interSectionCallBack = useCallback(
    (entries, observer) => {
      const items = [];
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting === true) {
          items.push(entry);
          observer.unobserve(entry.target);
        }
      });
      callBack(items);
    },
    [callBack],
  );

  React.useEffect(() => {
    // missing forEach on NodeList for IE11
    if (window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (let i = 0; i < this.length; i++) {
          callback.call(thisArg, this[i], i, this);
        }
      };
    }

    // @ts-ignore
    let items: NodeListOf<any> | any[] = [];
    const observer = new IntersectionObserver(interSectionCallBack, {
      rootMargin: '0px',
      root: null, // viewport 에 보이는지 확인할 예정이기 때문에 null 임
      threshold: 0.45,
    });

    setTimeout(() => {
      items = parentRef.current
        ? parentRef.current.querySelectorAll(`.${childClassName}`)
        : [];
      items.forEach((item) => {
        observer.observe(item);
      });
    }, 2000);

    // }

    return () => {
      items.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [childClassName, interSectionCallBack, parentRef]);
};
