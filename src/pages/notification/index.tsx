import * as React from 'react';
import Head from 'next-server/head';
import { ConnectedInitializeProps } from 'src/types/common';

interface NotificationPageProps {
  q?: string;
}

export default class NotificationPage extends React.Component<NotificationPageProps> {
  public static async getInitialProps(props: ConnectedInitializeProps) {
    return { q: props.query.q };
  }
  public render() {
    return (
      <>
        <Head>
          <title>리디북스 - 알림센터</title>
        </Head>
        <div>알림센터</div>
      </>
    );
  }
}
