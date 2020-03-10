import styled from '@emotion/styled';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { css } from '@emotion/core';

export const PortraitBook = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;

  ${orBelow(
    BreakPoint.MD,
    css`
      min-width: 100px;
      width: 100px;
    `,
  )}
  ${between(
    834,
    999,
    css`
      min-width: 100px;
      width: 100px;
    `,
  )};
`;

export const RecommendedPortraitBook = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;

  ${orBelow(
    BreakPoint.LG,
    css`
      min-width: 100px;
      width: 100px;
    `,
  )}
`;
