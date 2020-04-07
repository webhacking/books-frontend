import styled from '@emotion/styled';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

export const PortraitBook = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;

  ${orBelow(
    BreakPoint.LG,
    `
      min-width: 100px;
      width: 100px;
    `,
  )}
`;

export const RecommendedPortraitBook = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;

  ${orBelow(
    BreakPoint.LG,
    `
      min-width: 100px;
      width: 100px;
    `,
  )}
`;
