import * as React from 'react';
import { css } from '@emotion/core';

const pageTitleCSS = css`
  letter-spacing: -0.29px;
  font-size: 18px;
  color: #333;
  font-weight: 700;
  @media (max-width: 999px) {
    font-size: 15px;
    font-weight: 600;
    background-color: #1f8ce6;
    color: #f9f9f9;
    padding: 10px 15px;
    border-top: 1px solid #0077d9;
    border-bottom: 1px solid #1f8ce6;
  }
`;

const mobileDisplayNone = css`
  @media (max-width: 999px) {
    display: none;
  }
`;

interface PageTitleProps {
  title: string;
  mobileHidden?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = props => {
  return (
    <h2
      css={css`
        ${pageTitleCSS};
        ${props.mobileHidden ? mobileDisplayNone : ''};
      `}>
      {props.title}
    </h2>
  );
};

export default PageTitle;
