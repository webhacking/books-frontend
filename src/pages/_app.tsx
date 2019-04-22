import App, { AppComponentProps, Container, DefaultAppIProps, NextAppContext } from 'next/app';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import withRedux from 'next-redux-wrapper';
import makeStore, { StoreRootState } from 'src/store/config';
import { ConnectedRouter } from 'connected-next-router';
import { notifySentry, initializeSentry } from 'src/utils/sentry';
import { Global } from '@emotion/core';
import { defaultTheme, resetStyles } from 'src/styles';
import GNB from 'src/components/GNB';
import { ThemeProvider } from 'emotion-theming';
import Footer from 'src/components/Footer';

interface StoreAppProps extends AppComponentProps {
  store: Store<StoreRootState>;
  // tslint:disable-next-line
  pageProps: any;
  isPartials?: boolean;
}

interface StoreAppState {
  // tslint:disable-next-line
  isUpdateAvailable: Promise<any> | null;
  refreshing: boolean;
}

class StoreApp extends App<StoreAppProps, StoreAppState> {
  constructor(props: StoreAppProps) {
    super(props);
  }

  public static async getInitialProps({
    ctx,
    Component,
  }: NextAppContext): Promise<DefaultAppIProps & { isPartials?: boolean }> {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    const isPartials = !!ctx.pathname.match(/\/partials\//);

    return { pageProps, isPartials };
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
    const { Component, pageProps, isPartials, store } = this.props;
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
          <Provider store={store}>
            {/* Todo Apply Layout */}
            <ThemeProvider theme={defaultTheme}>
              <ConnectedRouter>
                <GNB />
                <Component {...pageProps} />
                <Footer />
              </ConnectedRouter>
            </ThemeProvider>
          </Provider>
        </Container>
      );
    }
  }
}
// @ts-ignore
export default withRedux(makeStore, { debug: false })(StoreApp);
