import styled from '@emotion/styled';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { css } from '@emotion/core';

export const ThumbnailWrapper = styled.div`
  max-height: 234.9px; // 배지 관련
  height: 234.9px; // 배지 관련 216 + 7
  display: flex;
  align-items: flex-end;
  min-width: 140px;
  margin-bottom: 8px;
  flex-shrink: 0;
  position: relative;
  left: 7px; // 배지 관련
  ${orBelow(
    BreakPoint.LG,
    css`
      min-width: 120px;
      max-height: 202px; //  배지 관련 184 + 7
      height: 202px; //  배지 관련 184 + 7
    `,
  )};
  img {
    ${orBelow(
      BreakPoint.LG,
      css`
        max-height: calc(127px * 1.618 - 10px); // 120 + 7
      `,
    )};
    max-height: calc(147px * 1.618 - 10px); // 140 + 7
  }
`;
