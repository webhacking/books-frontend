import * as React from 'react';

export const useIntersectionObserver = (
  target: React.RefObject<HTMLElement>,
  rootMargin = '0px',
) => {
  const [isIntersecting, setIntersecting] = React.useState(false);

  React.useEffect(() => {
    const root = document.querySelector('body');
    // @ts-ignore
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting !== isIntersecting) {
          setIntersecting(entry.isIntersecting);
        }
      },
      {
        rootMargin,
        // @ts-ignore
        root: root.current,
      },
    );
    if (target.current) {
      observer.observe(target.current);
    }
    return () => {
      // @ts-ignore
      observer.unobserve(target.current);
    };
  }, []);

  return isIntersecting;
};
