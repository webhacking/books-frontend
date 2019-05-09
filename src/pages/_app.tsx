import App, { AppComponentProps, Container, DefaultAppIProps, NextAppContext } from 'next/app';
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
// import { useEffect } from 'react';

interface StoreAppProps extends AppComponentProps {
  store: Store<StoreRootState>;
  // tslint:disable-next-line
  pageProps: any;
  isPartials?: boolean;
  // tslint:disable-next-line
  query: any;
  ctxPathname?: string;
}

interface StoreAppState {
  // tslint:disable-next-line
  isUpdateAvailable: Promise<any> | null;
  refreshing: boolean;
}

const Contents = styled.div`
  overflow: auto;
  max-width: 1000px;
  margin: 0 auto;
`;

class StoreApp extends App<StoreAppProps, StoreAppState> {
  constructor(props: StoreAppProps) {
    super(props);
  }

  public static async getInitialProps({
    ctx,
    Component,
  }: NextAppContext): Promise<
    // tslint:disable-next-line
    DefaultAppIProps & { ctxPathname?: string; isPartials?: boolean; query: any }
  > {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    const isPartials = !!ctx.pathname.match(/\/partials\//);
    return {
      pageProps,
      isPartials,
      query: ctx.query,
      ctxPathname: ctx.pathname,
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
  }

  public render() {
    const { Component, ctxPathname, query, pageProps, isPartials, store } = this.props;
    if (isPartials) {
      return (
        <Container>
          <BrowserLocationWithRouter pathname={query.pathname || '/'}>
            {/* Todo Apply Layout */}
            <Global styles={resetStyles} />
            <Component {...pageProps} />
          </BrowserLocationWithRouter>
        </Container>
      );
    } else {
      return (
        <Container>
          <BrowserLocationWithRouter pathname={ctxPathname || '/'}>
            <Global styles={resetStyles} />
            {/*<LocationListener />*/}
            <Provider store={store}>
              {/* Todo Apply Layout */}
              <ThemeProvider theme={defaultTheme}>
                {/*<ConnectedRouter>*/}
                <GNB searchKeyword={query.search || query.q} isPartials={false} />
                <Contents>
                  <Component {...pageProps} />
                </Contents>
                <Footer />
                {/*</ConnectedRouter>*/}
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
