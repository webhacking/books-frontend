import styled from '@emotion/styled';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { css } from '@emotion/core';

export const PortraitBook = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;

  :first-of-type {
    padding-left: 20px;
  }
  :last-of-type {
    padding-right: 20px;
  }
  :not(:last-of-type) {
    margin-right: 24px;
  }

  ${orBelow(
    BreakPoint.LG,
    css`
      min-width: 120px;
      width: 120px;
      :first-of-type {
        padding-left: 16px;
      }
      :last-of-type {
        padding-right: 16px;
      }
      :not(:last-of-type) {
        margin-right: 20px;
      }
    `,
  )}
`;
