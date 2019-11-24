import React from 'react';
import { css } from '@emotion/core';

interface SetBookRendererProps {
  setBookCount?: number;
}

const SetBookRenderer: React.FC<SetBookRendererProps> = props => {
  const { setBookCount } = props;
  if (!setBookCount) {
    return null;
  }
  return (
    <div
      css={css`
        position: absolute;
        width: calc(100% + 2px);
        bottom: 21%;
        left: -1px;
        height: 25px;
        background: white
          linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.0001) 7.37%,
            rgba(0, 0, 0, 0.0001) 92.26%,
            rgba(0, 0, 0, 0.2) 100%
          );
        border: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
      `}>
      <hr
        css={css`
          display: block;
          width: 100%;
          border: 0;
          position: relative;
          height: 2px;
          background: #1f8ce6;
          left: -1px;
        `}
      />
      <span
        css={css`
          font-size: 13px;
          line-height: 15px;
          text-align: center;
          letter-spacing: -0.373044px;
          color: #333333;
          padding: 0 6px;
          flex-shrink: 0;
          flex-grow: 0;
        `}>
        {`${Math.min(setBookCount, 999)}권 세트`}
      </span>
      <hr
        css={css`
          display: block;
          width: 100%;
          border: 0;
          position: relative;
          height: 2px;
          background: #1f8ce6;
          left: 1px;
        `}
      />
    </div>
  );
};

export default SetBookRenderer;
