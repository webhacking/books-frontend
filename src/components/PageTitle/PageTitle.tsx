import * as React from 'react';
import { css } from '@emotion/core';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

const pageTitleCSS = css`
  font-size: 21px;
  color: #303538;
  font-weight: 700;
  padding: 15px 0;
  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 15px 24px;
    `,
  )};
  ${orBelow(
    BreakPoint.M,
    css`
      padding: 15px 16px;
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

const PageTitle: React.FC<PageTitleProps> = (props) => (
  <h2
    css={css`
      ${pageTitleCSS};
      ${props.mobileHidden ? mobileDisplayNone : ''};
    `}
  >
    {props.title}
  </h2>
);

export default PageTitle;
