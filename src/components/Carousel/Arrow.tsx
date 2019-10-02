import ArrowV from 'src/svgs/ArrowV.svg';
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
      opacity: 0.95;
    }
  }
  opacity: 0.95;
`;

const leftRotate = css`
  transform-origin: center;
  transform: rotateX(180deg) translate(-2%, 0) rotate(180deg);
`;

const Arrow: React.FC<ArrowProps> = props => {
  const { color, side, arrowStyle, onClickHandler } = props;
  const handleClick = e => {
    e.preventDefault();
    onClickHandler(e);
  };
  const mergedStyle = [
    side === 'left' ? leftRotate : null,
    arrowStyle,
    css`
      fill: ${color === 'dark' ? '#b8bfc4' : '#808991'};
    `,
  ];
  return (
    <button
      type={'submit'}
      onClick={handleClick}
      css={[
        clearOutline,
        defaultOpacity,
        props.wrapperStyle,
        css`
          background: ${color === 'dark' ? '#384252' : 'white'};
          width: 40px;
          height: 40px;
          border-radius: 40px;
          box-shadow: 0 0.8px 3px rgba(0, 0, 0, 0.33);
        `,
      ]}>
      <ArrowV css={mergedStyle} />

      <span className={'a11y'}>{props.label}</span>
    </button>
  );
};

export default Arrow;
