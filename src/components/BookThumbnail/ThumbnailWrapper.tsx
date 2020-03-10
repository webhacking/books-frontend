import styled from '@emotion/styled';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { css } from '@emotion/core';

export const ThumbnailWrapper = styled.div`
  width: 140px;
  height: 216px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 8px;
  flex-shrink: 0;
  ${orBelow(
    BreakPoint.LG,
    css`
      width: 100px;
      height: 184px;
    `,
  )};

  img {
    max-height: calc(140px * 1.618 - 10px);
    ${orBelow(
    BreakPoint.LG,
    css`
        max-height: calc(120px * 1.618 - 10px);
      `,
  )};
  }
`;
