const THUMBNAIL_MAX_HEIGHT = 216 / 2;

// Todo Refactor
export const getArrowVerticalCenterPosition = (
  ref: React.RefObject<HTMLDivElement | HTMLElement>,
  offset = '10px',
) => {
  console.log(ref?.current?.getBoundingClientRect().height);
  if (ref.current) {
    return `${(THUMBNAIL_MAX_HEIGHT /
      Math.max(ref.current.getBoundingClientRect().height, 300)) *
      100}% - ${offset}`;
  }
  return offset;
};
