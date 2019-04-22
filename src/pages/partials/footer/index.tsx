/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { ConnectedInitializeProps } from 'src/types/common';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import Footer from 'src/components/Footer';

interface FooterProps {
  theme?: string;
}

export default class PartialFooter extends React.Component<FooterProps> {
  public static async getInitialProps(initialProps: ConnectedInitializeProps<{ theme: string }>) {
    return { ...initialProps.query };
  }
  public render() {
    return (
      <ThemeProvider theme={!this.props.theme ? defaultTheme : darkTheme}>
        <Footer />
      </ThemeProvider>
    );
  }
}
