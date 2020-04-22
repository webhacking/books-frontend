import * as React from 'react';

export const useIntersectionObserver = (
  target: React.RefObject<HTMLElement>,
  rootMargin = '0px',
) => {
  const [isIntersecting, setIntersecting] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting !== isIntersecting) {
          setIntersecting(entry.isIntersecting);
        }
      },
      {
        rootMargin,
        // @ts-ignore
        root: null,
      },
    );
    let copied: HTMLElement | null = null;
    if (target?.current) {
      observer.observe(target.current);
      copied = target.current;
    }

    return () => {
      if (copied) {
        observer.unobserve(copied);
      }
    };
  }, []);

  return isIntersecting;
};
