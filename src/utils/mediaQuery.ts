import { css, SerializedStyles } from '@emotion/core';

export enum BreakPoint {
  XS = 299,
  SM = 374,
  M = 432,
  MD = 833,
  LG = 999,
  XL = 1279,
}

// 특정 width 이하
export const orBelow = (width: number, style: SerializedStyles) => css`
  @media (max-width: ${width}px) {
    ${style};
  }
`;

// min 이상부터 max 이하까지
export const between = (min: number, max: number, style: SerializedStyles) => css`
  @media (min-width: ${min}px) and (max-width: ${max}px) {
    ${style};
  }
`;

// 특정 width 이상
export const greaterThanOrEqualTo = (width: number, style: SerializedStyles) => css`
  @media (min-width: ${width}px) {
    ${style};
  }
`;
