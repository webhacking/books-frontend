/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
// import styled from '@emotion/styled';

// @ts-ignore
import { Book } from '@ridi/web-ui/dist/index.node';
// import { css } from '@emotion/core';

// @ts-ignore
// import { Link } from 'server/routes';
import Head from 'next-server/head';
import { ConnectedInitializeProps } from 'src/types/common';

interface SearchProps {
  q?: string;
}

export default class Search extends React.Component<SearchProps> {
  public static async getInitialProps(props: ConnectedInitializeProps<{ q: string }>) {
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
