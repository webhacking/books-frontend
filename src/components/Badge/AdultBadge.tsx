import { ADULT_BADGE_URL } from 'src/constants/icons';
import { css } from '@emotion/core';
import React from 'react';

export const AdultBadge: React.FC = () => (
  <img
    src={ADULT_BADGE_URL}
    alt={'성인 전용 도서'}
    css={css`
      display: block;
      position: absolute;
      right: 3px;
      top: 3px;
      width: 20px !important;
      height: 20px !important;
    `}
  />
);
