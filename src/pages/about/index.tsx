/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';

// @ts-ignore
import { Book } from '@ridi/web-ui/dist/index.node';
import { css } from '@emotion/core';
import { Link } from 'server/routes';
import { connect } from 'react-redux';
import { StoreRootState } from 'src/store/config';
import { appActions } from 'src/services';
import { AppState } from 'src/services/app/reducer';
import { ConnectedInitializeProps } from 'src/types/common';

interface AboutProps {
  id: string;
  app: AppState;
  dispatchTestAction: typeof appActions.initialize;
}

class About extends React.Component<AboutProps> {
  public static async getInitialProps(init: ConnectedInitializeProps<{ id: string }>) {
    return { id: init.query.id };
  }
  public componentDidMount() {
    this.props.dispatchTestAction({ version: 'test' });
  }

  public onClick() {
    // @ts-ignore
    this.ewef();
  }

  public render() {
    // throw new Error('error?');
    const bookId = parseInt(this.props.id, 10) + 1;
    return (
      <div>
        <button onClick={this.onClick}>let's get error!</button>
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

const mapStateToProps = (state: StoreRootState) => {
  return {
    app: state.app!,
  };
};

const mapDispatchToProps = {
  dispatchTestAction: appActions.initialize,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(About);
