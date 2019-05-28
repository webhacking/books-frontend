import * as React from 'react';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { ConnectedInitializeProps } from 'src/types/common';
import GNB from 'src/components/GNB';
import { PartialSeparator } from 'src/components/Misc';
import { BrowserLocationWithRouter } from 'src/components/Context';

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

  // 기존 서점의 search query params 이 'q'
  q?: string;
}
export default class PartialGNB extends React.Component<GNBProps, GNBState> {
  public static async getInitialProps(
    initialProps: ConnectedInitializeProps<{
      pathname: string;
      q: string;
      type: string;
      theme: string;
    }>,
  ) {
    return { ...initialProps.query };
  }

  public state: GNBState = {
    theme: this.props.theme,
    isMounted: false,
  };

  public componentDidMount(): void {
    this.setState({
      isMounted: true,
    });
  }

  public render() {
    return (
      <ThemeProvider theme={!this.state.theme ? defaultTheme : darkTheme}>
        <BrowserLocationWithRouter isPartials={true} pathname={this.props.pathname || ''}>
          <PartialSeparator name={'GNB'} wrapped={!this.state.isMounted}>
            <GNB
              id={'gnb'}
              isPartials={true}
              type={this.props.type}
              searchKeyword={this.props.q || ''}
            />
          </PartialSeparator>
        </BrowserLocationWithRouter>
      </ThemeProvider>
    );
  }
}
