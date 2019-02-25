import App, { AppComponentProps, Container } from 'next/app';

export default class StoreApp extends App<AppComponentProps> {
  public componentDidMount(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')

        /* tslint:disable */
        // @ts-ignore
        .then((registration: any) => {
          console.log('service worker registration successful');
        })
        .catch(err => {
          console.warn('service worker registration failed', err.message);
        });
    }
  }

  public render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
