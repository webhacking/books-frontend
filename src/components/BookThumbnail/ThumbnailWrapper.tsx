import styled from '@emotion/styled';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { css } from '@emotion/core';

export const ThumbnailWrapper = styled.div`
  max-height: 216px;
  height: 216px;
  display: flex;
  align-items: flex-end;
  min-width: 140px;
  margin-bottom: 8px;
  flex-shrink: 0;
  ${orBelow(
    BreakPoint.LG,
    css`
      min-width: 120px;
      max-height: 184px;
      height: 184px;
    `,
  )};
  img {
    ${orBelow(
      BreakPoint.LG,
      css`
        max-height: calc(120px * 1.618 - 10px);
      `,
    )};
    max-height: calc(140px * 1.618 - 10px);
  }
`;
