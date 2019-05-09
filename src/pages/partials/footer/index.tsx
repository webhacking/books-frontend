import * as React from 'react';
import { ConnectedInitializeProps } from 'src/types/common';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { withAmp } from 'next/amp';
import Footer from 'src/components/Footer';
// import axios from 'axios';

interface FooterProps {
  theme?: string;
  // tslint:disable-next-line
  noticeItems?: any;
}

// Partials 로 볼러올 경우 공지사항을 Lazy 로드 하지 않고 미리 로드 후 렌더
// 이유: id="__next" DOM 안에 들어가지 않아 Lazy 로드 불가능
export class PartialFooter extends React.Component<FooterProps> {
  public static async getInitialProps(initialProps: ConnectedInitializeProps<{ theme: string }>) {
    // Fix me
    // will get notice items
    // const result = await axios.get('https://randomuser.me/api/');
    return { ...initialProps.query };
  }
  public render() {
    return (
      <ThemeProvider theme={!this.props.theme ? defaultTheme : darkTheme}>
        <Footer
          noticeItems={[
            { title: 'Do you have the time', url: 'url...' },
            { title: 'to listen to me whine', url: 'url...' },
            { title: 'About nothing and everything at all once', url: 'url...' },
          ]}
        />
      </ThemeProvider>
    );
  }
}

export default withAmp(PartialFooter);
