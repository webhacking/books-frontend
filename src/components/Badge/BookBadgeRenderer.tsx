import React from 'react';
import { css, SerializedStyles } from '@emotion/core';
import { DisplayType } from 'src/types/sections';
import styled from '@emotion/styled';
import { RIDI_WAIT_FREE_ICON_URL } from 'src/constants/icons';

interface BookBadgeRendererProps {
  isWaitFree?: boolean;
  isRentable?: boolean;
  discountPercentage?: number;
  wrapperCSS?: SerializedStyles;
  type: DisplayType;
}

const Rentable = styled.span`
  position: relative;
  font-weight: bold;
  font-size: 13px;
  line-height: 14px;
  color: #ffffff;
  z-index: 2;
`;

const badgeBaseCSS = css`
  width: 34px;
  height: 34px;
  border-radius: 34px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const rentalColor = css`
  background: #1abc9c;
`;

const waitFreeColor = css`
  background: #1f8ce6;
`;

const percentageStyle = css`
  top: 1.6px;
  transform: scale(0.92);
  font-weight: bold;
  margin-left: 0.7px;
  font-size: 11px;
  position: relative;
  line-height: 9px;
`;

const discountBadgeStyle = css`
  position: relative;
  color: white;
  background: #70808f;
`;

const discountNumberStyle = css`
  font-size: 16px;
  mix-blend-mode: normal;
  font-weight: bold;
  line-height: 14px;
  opacity: 0.99;
`;

const waitFreeImageStyle = css`
  position: relative;
  left: 1px;
  z-index: 2;
`;

const BookBadgeRenderer: React.FC<BookBadgeRendererProps> = (props) => {
  const {
    isWaitFree, wrapperCSS, discountPercentage, isRentable,
  } = props;
  if (isRentable) {
    return (
      <div className="badge" css={[badgeBaseCSS, rentalColor, wrapperCSS]}>
        <Rentable>대여</Rentable>
      </div>
    );
  }
  if (isWaitFree) {
    return (
      <div className="badge" css={[badgeBaseCSS, waitFreeColor, wrapperCSS]}>
        <img
          src={RIDI_WAIT_FREE_ICON_URL}
          width={20}
          height={18}
          css={waitFreeImageStyle}
          alt="RIDI_WAIT_FREE_ICON"
        />
        <span className="a11y" aria-label="리디 기다리면 무료">
          리디 기다리면 무료
        </span>
      </div>
    );
  }
  if (discountPercentage && discountPercentage >= 10) {
    return (
      <div className="badge" css={[badgeBaseCSS, discountBadgeStyle, wrapperCSS]}>
        <span css={discountNumberStyle}>{discountPercentage}</span>
        <span css={percentageStyle}>%</span>
        <span className="a11y">{`${discountPercentage} 할인`}</span>
      </div>
    );
  }
  return null;
};

export default BookBadgeRenderer;
