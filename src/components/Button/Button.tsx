import { css } from '@emotion/core';
import * as React from 'react';
import { RIDITheme } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

interface ButtonProps {
  label: string | React.ReactNode;
  type: 'primary' | 'secondary';
}

const createCSS = (theme: RIDITheme, type: 'primary' | 'secondary') => css`
  box-sizing: border-box;
  background-color: ${theme.button[`${type}Background`]};
  border: 1px solid ${theme.button[`${type}BorderColor`]};
  border-radius: 3px;
  padding: 6px 16px;
  font-weight: bold;
  color: ${theme.button[`${type}FontColor`]};
  word-break: keep-all;
  font-size: 13px;
  height: 30px;

  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 6px 8px;
    `,
  )};
  :hover {
    opacity: 0.7;
  }
`;

export const Button: React.FC<ButtonProps> = props => (
  <button css={theme => [createCSS(theme, props.type)]}>{props.label}</button>
);
