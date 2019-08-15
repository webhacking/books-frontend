import CarouselArrowDark from 'src/svgs/CarouselArrowDark.svg';
import CarouselArrowWhite from 'src/svgs/CarouselArrowWhite.svg';
import { css, SerializedStyles } from '@emotion/core';
import React, { FormEvent } from 'react';
import { clearOutline } from 'src/styles';

interface ArrowProps {
  side?: 'left' | 'right';
  color?: 'white' | 'dark';
  wrapperStyle?: SerializedStyles;
  arrowStyle?: SerializedStyles;
  width?: string;
  height?: string;
  fill?: string;
  label: string;
  onClickHandler?: (e: FormEvent) => void;
}

const defaultOpacity = css`
  :hover {
    opacity: 0.6;
  }
  transition: opacity 0.1s;
  cursor: pointer;
  @media (hover: none) {
    :hover {
      opacity: 1;
    }
  }
`;

const leftRotate = css`
  transform-origin: center;
  transform: rotateX(180deg) translate(3%, 0) rotate(180deg);
`;

const Arrow: React.FC<ArrowProps> = props => {
  const { color, side, arrowStyle, onClickHandler } = props;
  return (
    <button
      type={'submit'}
      // tabIndex={0}
      onClick={onClickHandler}
      css={css`
        ${clearOutline};
        ${defaultOpacity}
        ${props.wrapperStyle};
      `}>
      {color === 'dark' ? (
        <CarouselArrowDark
          css={css`
            ${side === 'left' ? leftRotate : ''};
            ${arrowStyle || ''};
          `}
        />
      ) : (
        <CarouselArrowWhite
          css={css`
            ${side === 'left' ? leftRotate : ''};
            ${arrowStyle || ''};
          `}
        />
      )}
      <span className={'a11y'}>{props.label}</span>
    </button>
  );
};

export default Arrow;
