import * as React from 'react';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { ConnectedInitializeProps } from 'src/types/common';
import GlobalNavigationBar from 'src/components/GNB';
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
  public static getInitialProps(initialProps: ConnectedInitializeProps) {
    if (initialProps.req) {
      return {
        ...initialProps.query,
        is_login: initialProps?.query?.is_login === 'true' ? 'true' : 'false',
      };
    }
    return { ...initialProps.query };
  }

  constructor(props: GNBProps) {
    super(props);
    this.state = {
      theme: props.theme,
      isMounted: false,
    };
  }

  public componentDidMount(): void {
    const { props } = this;
    this.setState({
      isMounted: true,
      theme: props.theme,
    });
  }

  public render() {
    const { theme, isMounted } = this.state;
    const { pathname, type, is_login } = this.props;
    return (
      <ThemeProvider theme={!theme ? defaultTheme : darkTheme}>
        <PartialSeparator name="GNB" wrapped={!isMounted}>
          <GlobalNavigationBar
            id="gnb"
            pathname={pathname}
            isPartials
            isLoginForPartials={is_login}
            type={type}
            searchKeyword=""
          />
          {pathname === '/category/list' && (
            <GenreTab isPartials currentGenre="category" />
          )}

          {['/v2/Detail'].includes(pathname ?? '') && (
            <GenreTab isPartials currentGenre="" />
          )}

          {pathname?.startsWith('/books') && (
            <GenreTab isPartials currentGenre="" />
          )}

          {pathname?.startsWith('/event') && (
            <GenreTab isPartials currentGenre="" />
          )}
        </PartialSeparator>
      </ThemeProvider>
    );
  }
}
