import { css } from '@emotion/core';
import fonts from './fonts';

export const inheritFont = css`
  color: inherit;
  letter-spacing: inherit;
  font-family: inherit;
`;

export const resetAppearance = css`
  appearance: none;
  background: none;
  box-shadow: none;
  border: 0;
`;

export const resetSpacing = css`
  margin: 0;
  padding: 0;
`;

export const a11y = css`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  border: 0;
  clip: rect(0, 0, 0, 0);
`;

export const fontFamily = [
  'Helvetica Neue',
  'Apple SD Gothic Neo',
  'arial',
  '"나눔고딕"',
  'Nanum Gothic',
  '"돋움"',
  'Dotum',
  'Tahoma',
  'Geneva',
  'sans-serif',
].join(', ');

export const resetFont = css`
  color: black;
  font-family: ${fontFamily};
  font-weight: 400;
  letter-spacing: -0.4px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const resetStyles = css`
  html {
    ${css([resetSpacing, resetFont])};
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  body {
    ${css([resetSpacing])};
  }
  hr {
    ${css([resetSpacing])};
  }
  p {
    ${css([resetSpacing])};
  }
  button {
    cursor: pointer;
    ${css([inheritFont, resetAppearance, resetSpacing])};
  }
  ul {
    list-style-type: none;
    ${css([resetSpacing])};
  }
  li {
    line-height: initial;
  }

  a {
    ${inheritFont};
    &:link,
    &:visited {
      text-decoration: none;
      color: white;
    }
    cursor: pointer;
  }
  * {
    .a11y {
      ${css([a11y])};
    }
  }
  ${fonts};
`;
