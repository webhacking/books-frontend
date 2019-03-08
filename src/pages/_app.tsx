import App, { AppComponentProps, Container, DefaultAppIProps, NextAppContext } from 'next/app';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import withRedux from 'next-redux-wrapper';
import makeStore, { StoreRootState } from 'src/store/config';
import { ConnectedRouter } from 'connected-next-router';
import { initializeSentry } from 'src/utils/sentry';

interface StoreAppProps extends AppComponentProps {
  store: Store<StoreRootState>;
  // tslint:disable-next-line
  pageProps: any;
}

interface StoreAppState {
  // tslint:disable-next-line
  isUpdateAvailable: Promise<any> | null;
  refreshing: boolean;
}

class StoreApp extends App<StoreAppProps, StoreAppState> {
  constructor(props: StoreAppProps) {
    super(props);
    this.state = {
      isUpdateAvailable: null,
      refreshing: false,
    };
    initializeSentry();
  }

  public static async getInitialProps({
    ctx,
    Component,
  }: NextAppContext): Promise<DefaultAppIProps> {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }
  // tslint:disable-next-line

  public componentDidMount(): void {
    const isUpdateAvailable = new Promise(resolve => {
      if ('serviceWorker' in navigator) {
        // Unregistration
        // navigator.serviceWorker.getRegistrations().then(r => {
        //   for (const registration of r) {
        //     registration.unregister();
        //   }
        // });

        navigator.serviceWorker
          .register(`/service-worker.js`)
          // @ts-ignore
          .then((registration: ServiceWorkerRegistration) => {
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  switch (installingWorker.state) {
                    case 'installed': {
                      if (navigator.serviceWorker.controller) {
                        resolve(registration);
                      } else {
                        resolve(false);
                      }
                    }
                  }
                };
              }
            };
            console.log('service worker registration successful');
          })
          .catch((err: Error) => {
            console.warn('service worker registration failed', err.message);
          });
      }
    });

    this.setState({
      isUpdateAvailable,
    });
  }

  public componentDidUpdate(): void {
    if (this.state.isUpdateAvailable !== null) {
      this.state.isUpdateAvailable.then(isAvailable => {
        if (isAvailable) {
          // isAvailable.update();
          console.log('New Update Available!');
          if (!this.state.refreshing) {
            this.setState({
              refreshing: true,
            });
          }
        }
      });
    }
  }

  public render() {
    const { Component, pageProps, store } = this.props;
    const { refreshing } = this.state;
    return (
      <Container>
        <Provider store={store}>
          <ConnectedRouter>
            {/* Todo Apply Layout */}
            <div>
              {refreshing && (
                // tslint:disable-next-line
                <button onClick={() => window.location.reload()}>
                  New Update Available - Refresh
                </button>
              )}
              <Component {...pageProps} />
            </div>
          </ConnectedRouter>
        </Provider>
      </Container>
    );
  }
}
// @ts-ignore
export default withRedux(makeStore, { debug: false })(StoreApp);
