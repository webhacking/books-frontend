/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';

// @ts-ignore
import { Book } from '@ridi/web-ui/dist/index.node';
import { css } from '@emotion/core';
import { Link } from 'server/routes';

export default class About extends React.Component<{ id: string }> {
  public static async getInitialProps(init: { query: string }) {
    return init.query;
  }
  public render() {
    const bookId = parseInt(this.props.id, 10) + 1;
    return (
      <div>
        <Link route={`/about/${parseInt(this.props.id, 10) + 1}`}>
          <button>Next Book Page</button>
        </Link>
        <Link route={'/'}>
          <button>To Home Page</button>
        </Link>
        <Book.Thumbnail
          thumbnailWidth={240}
          css={css`
            border: 4px dashed green;
          `}
          thumbnailUrl={`https://misc.ridibooks.com/cover/${bookId}/xxlarge`}
        />
      </div>
    );
  }
}
