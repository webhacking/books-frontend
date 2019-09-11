import * as React from 'react';
import { css } from '@emotion/core';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

const pageTitleCSS = css`
  font-size: 18px;
  color: #333;
  font-weight: 700;
  ${orBelow(
    BreakPoint.LG,
    css`
      font-size: 15px;
      font-weight: 600;
      background-color: #1f8ce6;
      color: #f9f9f9;
      padding: 10px 15px;
      border-top: 1px solid #0077d9;
      border-bottom: 1px solid #1f8ce6;
    `,
  )};
`;

const mobileDisplayNone = css`
  ${orBelow(
    BreakPoint.LG,
    css`
      display: none;
    `,
  )};
`;

interface PageTitleProps {
  title: string;
  mobileHidden?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = props => (
  <h2
    css={css`
      ${pageTitleCSS};
      ${props.mobileHidden ? mobileDisplayNone : ''};
    `}>
    {props.title}
  </h2>
);

export default PageTitle;
