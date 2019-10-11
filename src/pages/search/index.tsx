import * as React from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';

interface SearchProps {
  q?: string;
}

export default class Search extends React.Component<SearchProps> {
  public static async getInitialProps(props: ConnectedInitializeProps) {
    return { q: props.query.q };
  }

  public render() {
    return (
      <>
        <Head>
          <title>리디북스 - 검색</title>
        </Head>
        <div>검색 결과 {this.props.q}</div>
      </>
    );
  }
}
