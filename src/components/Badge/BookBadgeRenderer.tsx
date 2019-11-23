import React from 'react';
import RidiWaitFree from 'src/svgs/RidiWaitFree.svg';
import { css, SerializedStyles } from '@emotion/core';
import { DisplayType } from 'src/types/sections';
interface BookBadgeRendererProps {
  isWaitFree?: boolean;
  discountPercentage?: number;
  wrapperCSS?: SerializedStyles;
  type: DisplayType;
}

const BookBadgeRenderer: React.FC<BookBadgeRendererProps> = props => {
  const { isWaitFree, wrapperCSS, discountPercentage } = props;
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
  if (discountPercentage && discountPercentage >= 10) {
    return (
      <div
        css={[
          css`
            width: 34px;
            height: 34px;
            border-radius: 34px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            background: #70808f;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            color: white;
          `,
          wrapperCSS,
        ]}>
        <span
          css={css`
            font-size: 16px;
            mix-blend-mode: normal;
            font-weight: bold;
            line-height: 14px;
            opacity: 0.99;
          `}>
          {discountPercentage}
        </span>
        <span
          css={css`
            top: 1.6px;
            transform: scale(0.92);
            font-weight: bold;
            margin-left: 0.7px;
            font-size: 11px;
            position: relative;
            line-height: 9px;
          `}>
          %
        </span>
        <span className={'a11y'}>{`${discountPercentage} 할인`}</span>
      </div>
    );
  }
  return null;
};

export default BookBadgeRenderer;
