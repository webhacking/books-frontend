import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { BookItem } from 'src/types/sections';

const fontStyle = css`
  font-size: 19px;
  font-weight: normal;
  line-height: 26px;
  color: #000000;
  word-break: keep-all;
`;

const titleCSS = css`
  max-width: 950px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 16px;
  padding-top: 6px;
  ${between(
    BreakPoint.MD + 1,
    BreakPoint.LG,
    `
      padding-left: 20px;
      padding-right: 20px;
    `,
  )};
  ${orBelow(
    BreakPoint.MD,
    `
      padding-left: 16px;
      padding-right: 16px;
    `,
  )};
  display: flex;
  flex-direction: column;
  a {
    display: flex;
    color: black;
    :link,
    :active {
      color: black;
    }
  }
`;

export const RankingBookTitle = styled.h2`
  ${fontStyle};
  ${titleCSS};
  > a {
    display: flex;
    align-items: center;
    > * {
      flex: none;
    }
    > img {
      margin-left: 7.8px;
    }
  }
`;

export const SectionTitle = styled.h2`
  ${fontStyle};
  ${titleCSS};
`;

export interface RankingOption {
  type: 'big' | 'small';
  timer: boolean;
}

export interface SelectionOption {
  isAIRecommendation: boolean;
}

export interface BookSection {
  type: 'ranking' | 'selection';
  items: BookItem[];
  option?: RankingOption | SelectionOption;
  title: string;
  url?: string;
}
