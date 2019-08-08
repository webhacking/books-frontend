import { ErrorProps } from 'next/error';
import { NextPageContext } from 'next';
import * as React from 'react';
import { NextError } from 'src/constants/nextError';

import { notifySentry } from 'src/utils/sentry';
import { css } from '@emotion/core';

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
    return (
      <div
        css={css`
          width: 100%;
          display: flex;
          justify-content: center;
        `}>
        <button
          css={css`
            color: #808991;
            background: #fff;
            border: 1px solid #d1d5d9;
            box-shadow: 0 1px 1px 0 rgba(209, 213, 217, 0.3);
            display: inline-block;
            width: 140px;
            padding: 14px 0;
            margin: 0 2px;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            outline: 0;
            box-sizing: border-box;
            border-radius: 4px;
          `}
          onClick={() => window.history.back()}>
          이전페이지
        </button>
        <button
          css={css`
            display: inline-block;
            width: 140px;
            padding: 14px 0;
            margin: 0 2px;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            outline: 0;
            box-sizing: border-box;
            border-radius: 4px;
            color: #ffffff;
            background: #808991;
            border: 1px solid #798086;
            box-shadow: 0 1px 1px 0 rgba(209, 213, 217, 0.3);
          `}>
          <a className="Error_Button GrayButton" href="/">
            홈으로 돌아가기
          </a>
        </button>
      </div>
    );
  }
}
