import { ErrorProps } from 'next/error';
import { NextPageContext } from 'next';
import * as React from 'react';
import { NextError } from 'src/constants/nextError';
import { notifySentry } from 'src/utils/sentry';

export default class ErrorPage extends React.Component<ErrorProps> {
  public static getInitialProps(context: NextPageContext) {
    const { res, req, err } = context;
    if (res && res.statusCode) {
      return { statusCode: res.statusCode };
    }
    if (err) {
      // Todo Sentry send error
      notifySentry(err, req);
      return { statusCode: NextError.INTERNAL };
    }
    return { statusCode: NextError.NOT_FOUND };
  }

  public render() {
    return !!this.props.statusCode ? this.props.statusCode : 'Error';
  }
}
