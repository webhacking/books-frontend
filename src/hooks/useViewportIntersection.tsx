import React from 'react';

type Callback = (visible: boolean) => void;

interface Context {
  observer?: false | IntersectionObserver;
  getRegisterRef<T extends Element>(callback: Callback): React.Ref<T>;
}

const ViewportIntersectionContext = React.createContext<Context | null>(null);

type Props = Omit<IntersectionObserverInit, 'root'> & { children?: React.ReactNode };

export function ViewportIntersectionProvider(props: Props) {
  const { children, ...options } = props;
  const targets = React.useRef<Map<Element, Callback>>(new Map());
  let observerRef: React.MutableRefObject<Context>;
  const getRegisterRef = React.useCallback(
    (callback: Callback) => {
      let previousNode = null;
      const ref: <T extends Element>(node: T | null) => void = (node) => {
        const { observer } = observerRef.current;
        if (node == null && previousNode != null) {
          targets.current.delete(previousNode);
          if (observer) {
            observer.unobserve(previousNode);
          }
        } else {
          targets.current.set(node, callback);
          if (observer === false) {
            callback(true);
          } else {
            observer?.observe(node);
          }
        }
        previousNode = node;
      };
      return ref;
    },
    [],
  );
  observerRef = React.useRef<Context>({ getRegisterRef });

  React.useEffect(() => {
    if (typeof window.IntersectionObserver !== 'function') {
      observerRef.current.observer = false;
      targets.current.forEach((callback) => callback(true));
      return;
    }
    const io = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const intersecting = entry.isIntersecting || entry.intersectionRatio > 0;
          const node = entry.target;
          targets.current.get(node)?.(intersecting);
        });
      },
      options,
    );
    targets.current.forEach((_, key) => {
      io.observe(key);
    });
    observerRef.current.observer = io;
    return () => {
      io.disconnect();
      observerRef.current.observer = undefined;
    };
  }, []);

  return (
    <ViewportIntersectionContext.Provider value={observerRef.current}>
      {children}
    </ViewportIntersectionContext.Provider>
  );
}

/**
 * 뷰포트 영역의 IntersectionObserver에 엘리먼트를 등록하는 ref를 반환하는
 * 훅입니다.
 *
 * 상위에 ViewportIntersectionProvider가 있어야 합니다.
 *
 * @argument callback 엘리먼트가 뷰포트 영역에 들어오거나 나갈 때 실행될 함수
 * @returns 추적할 엘리먼트에 붙일 ref
 */
export function useViewportIntersection<T extends Element>(callback: Callback): React.Ref<T> {
  const ctx = React.useContext(ViewportIntersectionContext);
  const ref = React.useMemo(() => {
    if (ctx == null) {
      return null;
    }
    return ctx.getRegisterRef<T>(callback);
  }, [ctx, callback]);
  return ref;
}
