import * as React from 'react';
import CarouselArrowDark from 'src/svgs/CarouselArrowDark.svg';
import CarouselArrowWhite from 'src/svgs/CarouselArrowWhite.svg';
import { css, SerializedStyles } from '@emotion/core';
import { clearOutline } from 'src/styles';

interface ArrowProps {
  side?: 'left' | 'right';
  color?: 'white' | 'dark';
  wrapperStyle?: SerializedStyles;
  width?: string;
  height?: string;
  fill?: string;
}

const arrowCSS = css`
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
  const { color, side } = props;
  return (
    <div
      css={css`
        ${props.wrapperStyle};
        ${clearOutline}
      `}
      tabIndex={1}>
      {color === 'dark' ? (
        <>
          {side === 'left' ? (
            <CarouselArrowDark
              css={css`
                ${leftRotate};
                ${arrowCSS};
              `}
            />
          ) : (
            <CarouselArrowDark css={arrowCSS} />
          )}
        </>
      ) : (
        <>
          {side === 'left' ? (
            <CarouselArrowWhite
              css={css`
                ${leftRotate};
                ${arrowCSS};
              `}
            />
          ) : (
            <CarouselArrowWhite css={arrowCSS} />
          )}
        </>
      )}
    </div>
  );
};

export default Arrow;
