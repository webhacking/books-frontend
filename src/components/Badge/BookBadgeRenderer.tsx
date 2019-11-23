import React from 'react';
import RidiWaitFree from 'src/svgs/RidiWaitFree.svg';
import { css, SerializedStyles } from '@emotion/core';
interface BookBadgeRendererProps {
  isWaitFree?: boolean;
  wrapperCSS?: SerializedStyles;
}

const BookBadgeRenderer: React.FC<BookBadgeRendererProps> = props => {
  const { isWaitFree, wrapperCSS } = props;
  if (isWaitFree) {
    return (
      <div
        css={[
          css`
            width: 34px;
            height: 34px;
            border-radius: 34px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            background: #1f8ce6;
            display: flex;
            align-items: center;
            justify-content: center;
          `,
          wrapperCSS,
        ]}>
        <RidiWaitFree />
        <span className={'a11y'}>리디 기다리면 무료</span>
      </div>
    );
  }
  return null;
};

export default BookBadgeRenderer;
