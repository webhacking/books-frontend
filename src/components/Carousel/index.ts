const THUMBNAIL_MAX_HEIGHT = 216 / 2;

// Todo Refactor
export const getArrowVerticalCenterPosition = (
  offset = 10,
) => `${THUMBNAIL_MAX_HEIGHT - offset}px`;
