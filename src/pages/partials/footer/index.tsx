import * as React from 'react';
import { ConnectedInitializeProps } from 'src/types/common';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { withAmp } from 'next/amp';
import Footer from 'src/components/Footer';
import { PartialSeparator } from 'src/components/Misc';
// import axios from 'axios';

interface FooterProps {
  theme?: string;
  // tslint:disable-next-line
  noticeItems?: any;
}

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
        <PartialSeparator name={'FOOTER'} wrapped={true}>
          <Footer
            noticeItems={[
              { title: 'Do you have the time', url: 'url...' },
              { title: 'to listen to me whine', url: 'url...' },
              { title: 'About nothing and everything at all once', url: 'url...' },
            ]}
          />
        </PartialSeparator>
      </ThemeProvider>
    );
  }
}

export default withAmp(PartialFooter);
