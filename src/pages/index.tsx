/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import styled from '@emotion/styled';

// @ts-ignore
import { Book } from '@ridi/web-ui/dist/index.node';
import { css } from '@emotion/core';

// @ts-ignore
import { Link } from 'server/routes';

// emotion test
const Div = styled.div`
  color: red;
`;

export default class Home extends React.Component {
  public render() {
    return (
      <div>
        <Link route={'/about/1242000770'}>
          <button>To Book Page</button>
        </Link>
        <Div>SW Test New Home</Div>
        <Book.Thumbnail
          thumbnailWidth={240}
          css={css`
            border: 4px dashed blueviolet;
          `}
          thumbnailUrl={'https://misc.ridibooks.com/cover/1242000770/xxlarge'}
        />
      </div>
    );
  }
}
