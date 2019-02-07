import App, { AppComponentProps, Container } from 'next/app';

export default class StoreApp extends App<AppComponentProps> {
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
