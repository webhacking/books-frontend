import * as React from 'react';
import StarRatingIcon from 'src/svgs/StarRating.svg';
import { css } from '@emotion/core';

interface StarRatingProps {
  rating: number | null;
  totalReviewer?: number;
}

const wrapperCSS = css`
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  color: #999999;
  line-height: 1.09;
`;

const totalReviewerCSS = css`
  height: 10px;
  font-size: 11px;
  line-height: 1.09;
  color: #999999;
`;

const StarRating: React.FC<StarRatingProps> = props => (
  <span css={wrapperCSS}>
    <span
      css={css`
        position: relative;
      `}>
      <StarRatingIcon
        css={css`
          width: 50px;
          height: 10px;
          fill: black;
          opacity: 0.2;
          margin-right: 2px;
          background-color: transparent;
        `}
      />
      <span
        css={css`
          width: ${Math.floor((props.rating / 5) * 50)}px;
          left: 0;
          position: absolute;
          height: 100%;
          background-color: transparent;
          overflow: hidden;
        `}>
        <StarRatingIcon
          css={css`
            width: 50px;
            height: 10px;
            background-color: transparent;
          `}
        />
      </span>
    </span>
    {props.totalReviewer && <span css={totalReviewerCSS}>{props.totalReviewer}</span>}
  </span>
);

export default StarRating;
