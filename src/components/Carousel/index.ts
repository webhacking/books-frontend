const THUMBNAIL_MAX_HEIGHT = 223 / 2;

export const getArrowVerticalCenterPosition = (
  ref: React.RefObject<HTMLDivElement | HTMLElement>,
  offset = '20px',
) => {
  if (ref.current) {
    return `${(THUMBNAIL_MAX_HEIGHT / ref.current.getBoundingClientRect().height) *
      100}% - ${offset}`;
  }
  return offset;
};
