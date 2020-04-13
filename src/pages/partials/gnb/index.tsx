import * as React from 'react';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { ConnectedInitializeProps } from 'src/types/common';
import GNB from 'src/components/GNB';
import { PartialSeparator } from 'src/components/Misc';
import { GenreTab } from 'src/components/Tabs';

interface GNBState {
  theme?: string | boolean;
  isMounted: boolean;
}

interface GNBProps {
  type?: string;
  theme?: string;
  search?: string;
  isLogin?: string;
  pathname?: string;
  is_login?: 'true' | 'false';

  // 기존 서점의 search query params 이 'q'
  q?: string;
}
export default class PartialGNB extends React.Component<GNBProps, GNBState> {
  public static async getInitialProps(initialProps: ConnectedInitializeProps) {
    if (initialProps.req) {
      return {
        ...initialProps.query,
        is_login: initialProps?.query?.is_login === 'true' ? 'true' : 'false',
      };
    }
    return { ...initialProps.query };
  }

  public state: GNBState = {
    // eslint-disable-next-line no-invalid-this
    theme: this.props.theme,
    isMounted: false,
  };

  public componentDidMount(): void {
    this.setState({
      isMounted: true,
      theme: this.props.theme,
    });
  }

  public render() {
    return (
      <ThemeProvider theme={!this.state.theme ? defaultTheme : darkTheme}>
        <PartialSeparator name="GNB" wrapped={!this.state.isMounted}>
          <GNB
            id="gnb"
            pathname={this.props.pathname}
            isPartials
            isLoginForPartials={this.props.is_login}
            type={this.props.type}
            searchKeyword=""
          />
          {this.props.pathname === '/category/list' && (
            <GenreTab isPartials currentGenre="category" />
          )}

          {['/v2/Detail'].includes(this.props.pathname ?? '') && (
            <GenreTab isPartials currentGenre="" />
          )}

          {this.props.pathname?.startsWith('/books') && (
            <GenreTab isPartials currentGenre="" />
          )}

          {this.props.pathname?.startsWith('/event') && (
            <GenreTab isPartials currentGenre="" />
          )}
        </PartialSeparator>
      </ThemeProvider>
    );
  }
}
