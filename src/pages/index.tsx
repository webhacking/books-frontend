import * as React from 'react';
import Head from 'next-server/head';
import { ConnectedInitializeProps } from 'src/types/common';

interface HomeProps {
  genre?: string;
}

export default class Home extends React.Component<HomeProps> {
  public static async getInitialProps(props: ConnectedInitializeProps<{ genre: string }>) {
    return { genre: props.query.genre };
  }
  public render() {
    return (
      <>
        <Head>
          <title>리디북스</title>
        </Head>
        <div>Home</div>
      </>
    );
  }
}
