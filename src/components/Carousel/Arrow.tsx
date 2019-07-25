import * as React from 'react';
import CarouselArrowDark from 'src/svgs/CarouselArrowDark.svg';
import CarouselArrowWhite from 'src/svgs/CarouselArrowWhite.svg';
import { css, SerializedStyles } from '@emotion/core';
import { clearOutline } from 'src/styles';

interface ArrowProps {
  side?: 'left' | 'right';
  color?: 'white' | 'dark';
  wrapperStyle?: SerializedStyles;
  arrowStyle?: SerializedStyles;
  width?: string;
  height?: string;
  fill?: string;
}

const defaultArrowCSS = css`
  :hover {
    opacity: 0.6;
  }
  transition: opacity 0.1s;
  cursor: pointer;
`;

const leftRotate = css`
  transform-origin: center;
  transform: rotateX(180deg) translate(3%, 0) rotate(180deg);
`;

const Arrow: React.FC<ArrowProps> = props => {
  const { color, side, arrowStyle } = props;
  return (
    <div
      css={css`
        ${props.wrapperStyle};
        ${clearOutline}
      `}
      tabIndex={1}>
      {color === 'dark' ? (
        <CarouselArrowDark
          css={css`
            ${side === 'left' ? leftRotate : ''};
            ${arrowStyle || defaultArrowCSS};
          `}
        />
      ) : (
        <CarouselArrowWhite
          css={css`
            ${side === 'left' ? leftRotate : ''};
            ${arrowStyle || defaultArrowCSS};
          `}
        />
      )}
    </div>
  );
};

export default Arrow;
