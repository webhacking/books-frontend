import { css } from '@emotion/core';

export * from './reset';
export * from './themes';

export enum ZIndexLayer {
  LEVEL_10 = 10000,
  LEVEL_9 = 5000,
  LEVEL_8 = 2500,
  LEVEL_7 = 100,
  LEVEL_6 = 50,
  LEVEL_5 = 25,
  LEVEL_4 = 10,
  LEVEL_3 = 1,
  LEVEL_2 = 0,
  LEVEL_1 = -10000,
}

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
