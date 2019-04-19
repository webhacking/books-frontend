import { css } from '@emotion/core';

export const resetSpacing = css`
  margin: 0;
  padding: 0;
`;

export default css`
  html {
    ${css([resetSpacing])};
  }
  body {
    ${css([resetSpacing])};
  }
`;
