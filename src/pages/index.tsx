/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import styled from '@emotion/styled';

// @ts-ignore
import { Book } from '@ridi/web-ui/dist/index.node';
import { css } from '@emotion/core';

// @ts-ignore
import { Link } from 'server/routes';
import Head from 'next-server/head';
import { ConnectedInitializeProps } from 'src/types/common';

// emotion test
const Div = styled.div`
  color: cornsilk;
`;

export default class Home extends React.Component {
  public static async getInitialProps(props: ConnectedInitializeProps<{ genre: string }>) {
    return { genre: props.query.genre };
  }
  public render() {
    return (
      <>
        <Head>
          <title>리디북스</title>
        </Head>
        <div>
          <Link route={'/about/1242000770'}>
            <button>To Book Page</button>
          </Link>
          <Div>Home. Store Responsive Web Infra Test.</Div>
          <Book.Thumbnail
            thumbnailWidth={240}
            css={css`
              border: 4px dashed blueviolet;
            `}
            thumbnailUrl={'https://misc.ridibooks.com/cover/1242000770/xxlarge'}
          />
        </div>
      </>
    );
  }
}
