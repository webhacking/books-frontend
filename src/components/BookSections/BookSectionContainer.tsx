import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { BookItem } from 'src/types/sections';

const fontStyle = css`
  font-size: 21px;
  font-weight: normal;
  line-height: 26px;
  color: #000000;
  word-break: keep-all;
`;

const titleCSS = css`
  ${between(
    BreakPoint.MD + 1,
    BreakPoint.LG,
    css`
      padding-left: 20px;
      padding-right: 20px;
    `,
  )};
  ${orBelow(
    BreakPoint.MD,
    css`
      padding-left: 16px;
      padding-right: 16px;
    `,
  )};
  padding-left: 24px;
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
// Fixme isn't same ? SectionBookTitle
export const RankingBookTitle = styled.h2`
  ${fontStyle};
  max-width: 1000px;
  margin: 0 auto;
  margin-bottom: 20px;
  padding-top: 6px;
  ${titleCSS};
`;

export const SectionTitle = styled.h2`
  ${fontStyle};
  margin-bottom: 14px;
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
