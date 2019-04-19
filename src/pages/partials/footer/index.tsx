/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import * as React from 'react';
import axios from 'axios';
import { ConnectedInitializeProps } from 'src/types/common';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';

const FooterWrapper = styled.div`
  width: 100vw;
  height: 200px;
  color: black;
  font-size: 3rem;
`;

interface FooterProps {
  email?: string;
  theme?: string;
}

interface FooterState {
  result?: {
    email: string;
  };
}
export default class Footer extends React.Component<FooterProps, FooterState> {
  public static async getInitialProps(
    initialProps: ConnectedInitializeProps<{ gnbType: string; theme: string }>,
  ) {
    const result = await axios.get('https://randomuser.me/api/');
    return { ...initialProps.query, email: result.data.results[0].email };
  }
  public state: FooterState = {
    result: undefined,
  };
  public render() {
    return (
      <ThemeProvider theme={!this.props.theme ? defaultTheme : darkTheme}>
        <FooterWrapper css={theme => ({ backgroundColor: theme.primaryColor })}>
          I'm a Footer
          {this.props.email && this.props.email}
        </FooterWrapper>
      </ThemeProvider>
    );
  }
}
