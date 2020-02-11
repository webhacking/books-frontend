import * as React from 'react';
import { css } from '@emotion/core';
import { NO_STAR_RATING_URL, STAR_RATING_URL } from 'src/constants/icons';

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

const StarRating: React.FC<StarRatingProps> = (props) => (
  <span css={wrapperCSS}>
    <span
      css={css`
        position: relative;
      `}
    >
      <img
        src={NO_STAR_RATING_URL}
        css={css`
          width: 50px;
          height: 10px;
          margin-right: 2px;
        `}
        alt="NO_STAR_RATING"
      />
      <span
        css={css`
          width: ${Math.floor((props.rating / 5) * 50)}px;
          left: 0;
          top: 0;
          position: absolute;
          height: 100%;
          background-color: transparent;
          overflow: hidden;
        `}
      >
        <img
          src={STAR_RATING_URL}
          css={css`
            width: 50px;
            height: 10px;
          `}
          alt="STAR_RATING"
        />
      </span>
    </span>
    {props.totalReviewer && <span css={totalReviewerCSS}>{props.totalReviewer}</span>}
  </span>
);

export default StarRating;
