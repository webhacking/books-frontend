import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import withRedux from 'next-redux-wrapper';
import makeStore, { StoreRootState } from 'src/store/config';
// import { ConnectedRouter } from 'connected-next-router';
import { notifySentry, initializeSentry } from 'src/utils/sentry';
import { Global } from '@emotion/core';
import { defaultTheme, resetStyles } from 'src/styles';
import GNB from 'src/components/GNB';
import { ThemeProvider } from 'emotion-theming';
import Footer from 'src/components/Footer';
import styled from '@emotion/styled';
import { BrowserLocationWithRouter } from 'src/components/Context';
import * as React from 'react';
// Todo move css import code
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PartialSeparator } from 'src/components/Misc';

interface StoreAppProps {
  store: Store<StoreRootState>;
  // tslint:disable-next-line
  pageProps: any;
  isPartials?: boolean;
  // tslint:disable-next-line
  query: any;
  ctxPathname?: string;
}

// interface StoreAppState {
//   // tslint:disable-next-line
//   isUpdateAvailable?: Promise<any> | null;
//   refreshing?: boolean;
//   isMounted: boolean;
// }

const Contents = styled.main`
  margin: 0 auto;
`;

class StoreApp extends App<StoreAppProps> {
  public static async getInitialProps({ ctx, Component, ...rest }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    const isPartials = !!ctx.pathname.match(/\/partials\//);
    return {
      pageProps,
      isPartials,
      query: ctx.query,
      ctxPathname: rest.router ? rest.router.asPath : '/',
    };
  }
  public componentDidMount(): void {
    if (!this.props.isPartials) {
      initializeSentry();
      // @ts-ignore
      const isUpdateAvailable = new Promise(resolve => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker
            .register(`/service-worker.js`)
            // @ts-ignore
            .then((registration: ServiceWorkerRegistration) => {
              // registration.onupdatefound = () => {
              //   const installingWorker = registration.installing;
              //   if (installingWorker) {
              //     installingWorker.onstatechange = () => {
              //       switch (installingWorker.state) {
              //         case 'installed': {
              //           console.log('installed from _app.tsx');
              //           if (navigator.serviceWorker.controller) {
              //             resolve(registration);
              //           } else {
              //             resolve(false);
              //           }
              //         }
              //       }
              //     };
              //   }
              // };
              console.log('service worker registration successful');
            })
            .catch((err: Error) => {
              console.warn('service worker registration failed', err.message);
              notifySentry(err);
            });
        }
      });
    }
    this.setState({
      isMounted: true,
    });
  }

  public render() {
    const { Component, ctxPathname, query, pageProps, isPartials, store } = this.props;
    if (isPartials) {
      return (
        <Container>
          {/*<PartialSeparator name={'GLOBAL_STYLE_RESET'} wrapped={!this.state.isMounted}>*/}
          <PartialSeparator name={'GLOBAL_STYLE_RESET'} wrapped={true}>
            <Global styles={resetStyles} />
          </PartialSeparator>
          {/* Todo Apply Layout */}
          <Component {...pageProps} />
        </Container>
      );
    } else {
      return (
        <Container>
          <Global styles={resetStyles} />
          <BrowserLocationWithRouter isPartials={false} pathname={ctxPathname || '/'}>
            <Provider store={store}>
              {/* Todo Apply Layout */}
              <ThemeProvider theme={defaultTheme}>
                <GNB searchKeyword={query.search || query.q} isPartials={false} />
                <Contents>
                  <Component {...pageProps} />
                </Contents>
                <Footer />
              </ThemeProvider>
            </Provider>
          </BrowserLocationWithRouter>
        </Container>
      );
    }
  }
}
// @ts-ignore
export default withRedux(makeStore, { debug: false })(StoreApp);
