import App, { AppComponentProps, Container, DefaultAppIProps, NextAppContext } from 'next/app';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import withRedux from 'next-redux-wrapper';
import makeStore, { StoreRootState } from 'src/store/config';
import { ConnectedRouter } from 'connected-next-router';

interface StoreAppProps extends AppComponentProps {
  store: Store<StoreRootState>;
}

class StoreApp extends App<StoreAppProps> {
  public static async getInitialProps({ ctx, Component }: NextAppContext): Promise<DefaultAppIProps> {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }
  public componentDidMount(): void {
    if ('serviceWorker' in navigator) {
      // Unregistration
      // navigator.serviceWorker.getRegistrations().then(r => {
      //   for (const registration of r) {
      //     registration.unregister();
      //   }
      // });

      navigator.serviceWorker
        .register('/service-worker.js')
        // @ts-ignore
        .then((registration: ServiceWorkerRegistration) => {
          console.log('service worker registration successful');
        })
        .catch((err: Error) => {
          console.warn('service worker registration failed', err.message);
        });
    }
  }

  public render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <ConnectedRouter>
            <Component {...pageProps} />
          </ConnectedRouter>
        </Provider>
      </Container>
    );
  }
}
// @ts-ignore
export default withRedux(makeStore, { debug: false })(StoreApp);
