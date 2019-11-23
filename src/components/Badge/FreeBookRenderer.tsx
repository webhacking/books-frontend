import React from 'react';
import { css } from '@emotion/core';

interface FreeBookRendererProps {
  freeBookCount?: number;
}

// 무료책 권수 썸네일에 표시하는 컴포넌트
const FreeBookRenderer: React.FC<FreeBookRendererProps> = props => {
  console.log(props.freeBookCount);
  if (props.freeBookCount && props.freeBookCount > 0) {
    return (
      <div
        css={[
          css`
            position: absolute;
            bottom: 0;
            right: 0;
            height: 26px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-right: 0;
            border-bottom: 0;
            opacity: 0.9;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 3px 0 0 0;
            padding: 7px 6px 5px 6px;
          `,
        ]}>
        <span
          css={css`
            color: white;
            font-weight: bold;
            font-size: 12px;
            z-index: 3;
            line-height: 12px;
          `}>
          {`${props.freeBookCount}화 무료`}
        </span>
      </div>
    );
  }
  return null;
};

export default FreeBookRenderer;
