import { DefaultErrorIProps } from 'next/error';
import { NextContext } from 'next';
import * as React from 'react';
import { NextError } from 'src/constants/nextError';
import { notifySentry } from 'src/utils/sentry';

interface ErrorProps {
  statusCode: number;
}

export default class ErrorPage extends React.Component<ErrorProps> {
  public static getInitialProps(
    context: NextContext,
  ): Promise<DefaultErrorIProps> | DefaultErrorIProps {
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
