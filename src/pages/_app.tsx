/** @jsx jsx */
import App, { AppComponentProps, Container, DefaultAppIProps, NextAppContext } from 'next/app';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import withRedux from 'next-redux-wrapper';
import makeStore, { StoreRootState } from 'src/store/config';
// import { ConnectedRouter } from 'connected-next-router';
import { notifySentry, initializeSentry } from 'src/utils/sentry';
import { Global, jsx } from '@emotion/core';
import { defaultTheme, resetStyles } from 'src/styles';
import GNB from 'src/components/GNB';
import { ThemeProvider } from 'emotion-theming';
import Footer from 'src/components/Footer';
import styled from '@emotion/styled';
// import { useEffect } from 'react';

interface StoreAppProps extends AppComponentProps {
  store: Store<StoreRootState>;
  // tslint:disable-next-line
  pageProps: any;
  isPartials?: boolean;
  // tslint:disable-next-line
  query: any;
}

interface StoreAppState {
  // tslint:disable-next-line
  isUpdateAvailable: Promise<any> | null;
  refreshing: boolean;
}
//
// const LocationListener = () => {
//   useEffect(() => {
//     const handleHashChange = (a, b, c) => {
//       console.log(a, b, c);
//     };
//     window.addEventListener('popstate', handleHashChange);
//     return () => {
//       window.removeEventListener('popstate', handleHashChange);
//     };
//   }, []);
//   return <></>;
// };

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
  }: // tslint:disable-next-line
  NextAppContext): Promise<DefaultAppIProps & { isPartials?: boolean; query: any }> {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    const isPartials = !!ctx.pathname.match(/\/partials\//);
    return { pageProps, isPartials, query: ctx.query };
  }
  // tslint:disable-next-line

  public componentDidMount(): void {
    // @ts-ignore
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
    const { Component, query, pageProps, isPartials, store } = this.props;
    // console.log(query);
    if (isPartials) {
      return (
        <Container>
          {/* Todo Apply Layout */}
          <Global styles={resetStyles} />
          <Component {...pageProps} />
        </Container>
      );
    } else {
      return (
        <Container>
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
        </Container>
      );
    }
  }
}
// @ts-ignore
export default withRedux(makeStore, { debug: false })(StoreApp);
