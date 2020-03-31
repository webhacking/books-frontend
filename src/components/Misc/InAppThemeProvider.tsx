import React from 'react';
import Cookies from 'universal-cookie';
import { IncomingHttpHeaders } from 'http';
import { ThemeProvider } from 'emotion-theming';
import { Global, css } from '@emotion/core';
import {
  defaultTheme, darkTheme, resetStyles, RIDITheme,
} from 'src/styles';

const inappStyle = (theme: RIDITheme) => [resetStyles, css`
  html {
    background-color: ${theme.backgroundColor};
  }
`];

export type Theme = 'dark' | '';
export const getAppTheme = ({ cookie }: IncomingHttpHeaders): Theme => {
  const cookies = new Cookies(cookie);
  const theme = cookies.get('ridi_app_theme');
  if (theme === 'dark') {
    return theme;
  }
  return '';
};
const InAppThemeProvider: React.FC<{ theme: Theme }> = ({ children, theme }) => (
  <ThemeProvider theme={theme === 'dark' ? darkTheme : defaultTheme}>
    <Global styles={inappStyle} />
    {children}
  </ThemeProvider>
);

export default InAppThemeProvider;
