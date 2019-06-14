import * as React from 'react';
import { Svg } from '../Svg';
import { css, SerializedStyles } from '@emotion/core';

interface ArrowProps {
  side?: 'left' | 'right';
  wrapperStyle?: SerializedStyles;
  keyDown?: () => void;
  click?: () => void;
  width?: string;
  height?: string;
  fill?: string;
  opacity?: boolean;
}

const Arrow: React.FC<ArrowProps> = props => {
  return (
    <div css={props.wrapperStyle} tabIndex={1}>
      <Svg
        css={css`
          ${props.opacity ? 'fill-opacity: 0.7;' : ''};
          ${props.side === 'right'
            ? `transform-origin: center;
               transform: rotate(180deg) translate(3%, 0);`
            : ''};
        `}
        fill={props.fill || '#d1d5d9'}
        iconName={'LeftArrow'}
        width={props.width || '40px'}
        height={props.height || '40px'}
      />
    </div>
  );
};

export default Arrow;
