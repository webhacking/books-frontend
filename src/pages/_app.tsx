import App from 'next/app';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import withRedux from 'next-redux-wrapper';
import makeStore, { RootState } from 'src/store/config';
import { ConnectedRouter } from 'connected-next-router';
import { notifySentry, initializeSentry } from 'src/utils/sentry';
import { CacheProvider, Global } from '@emotion/core';
import { defaultTheme, resetStyles } from 'src/styles';
import GNB from 'src/components/GNB';
import { ThemeProvider } from 'emotion-theming';
import Footer from 'src/components/Footer';
import styled from '@emotion/styled';
import { BrowserLocationWithRouter } from 'src/components/Context';
import * as React from 'react';
// Todo move css import code
import 'slick-carousel/slick/slick.css';
import { PartialSeparator } from 'src/components/Misc';
import { cache } from 'emotion';
import createCache from '@emotion/cache';
// import { Tracker, DeviceType } from '@ridi/event-tracker';

interface StoreAppProps {
  store: Store<RootState>;
  // tslint:disable-next-line
  pageProps: any;
  isPartials?: boolean;
  // tslint:disable-next-line
  query: any;
  ctxPathname?: string;
}

const Contents = styled.main`
  margin: 0 auto;
`;

class StoreApp extends App<StoreAppProps> {
  // @ts-ignore
  public static async getInitialProps({ ctx, Component, ...rest }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    const isPartials = !!ctx.pathname.match(/\/partials\//u);
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
            .register('/service-worker.js')
            // @ts-ignore
            .then((registration: ServiceWorkerRegistration) => {
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
    const {
      Component,
      ctxPathname,
      query,
      pageProps,
      isPartials,
      store,
      // @ts-ignore
      nonce,
    } = this.props;

    if (pageProps.statusCode > 400) {
      return (
        <>
          <Global styles={resetStyles} />
          <Contents>
            <Component {...pageProps} />
          </Contents>
        </>
      );
    }
    if (isPartials) {
      return (
        <>
          <PartialSeparator name={'GLOBAL_STYLE_RESET'} wrapped={true}>
            <Global styles={resetStyles} />
          </PartialSeparator>
          {/* Todo Apply Layout */}
          <Component {...pageProps} />
        </>
      );
    }
    return (
      <CacheProvider value={createCache({ ...cache, nonce })}>
        <Global styles={resetStyles} />
        <BrowserLocationWithRouter isPartials={false} pathname={ctxPathname || '/'}>
          <Provider store={store}>
            <ConnectedRouter>
              {/* Todo Apply Layout */}
              <ThemeProvider theme={defaultTheme}>
                <GNB searchKeyword={query.search || query.q} isPartials={false} />
                <Contents>
                  <Component {...pageProps} />
                </Contents>
                <Footer />
              </ThemeProvider>
            </ConnectedRouter>
          </Provider>
        </BrowserLocationWithRouter>
      </CacheProvider>
    );
  }
}
// @ts-ignore
export default withRedux(makeStore, { debug: false })(StoreApp);
