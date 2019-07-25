const THUMBNAIL_MAX_HEIGHT = 216 / 2;

export const getArrowVerticalCenterPosition = (
  ref: React.RefObject<HTMLDivElement | HTMLElement>,
  offset = '20px',
) => {
  if (ref.current) {
    console.log(ref.current.getBoundingClientRect());
    return `${(THUMBNAIL_MAX_HEIGHT / ref.current.getBoundingClientRect().height) *
      100}% - ${offset}`;
  }
  return offset;
};
