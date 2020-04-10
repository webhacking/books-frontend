import React, { useEffect, useState } from 'react';
import { css } from '@emotion/core';

import ScrollContainer from 'src/components/ScrollContainer';
import { flexRowStart } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

import SelectionBookItem from './SelectionBookItem';
import { SelectionBookListProps } from './types';

const listCSS = css`
  margin-left: 13px; // 20px - 7px
  padding-top: 7px;
  padding-left: 7px;
  box-sizing: content-box;
  overflow: auto;
  overflow-y: hidden;

  ${orBelow(BreakPoint.MD, 'margin-left: 9px;')} // 16px - 7px
`;

const itemCSS = css`
  display: flex;
  flex: none;
  flex-direction: column;
  margin-right: 20px;
  box-sizing: content-box;

  ${orBelow(
    BreakPoint.MD,
    'margin-right: 12px;',
  )};
  align-items: flex-start;
`;

const arrowVerticalStyle = css`
  padding-top: 98px;
  @media (max-width: ${BreakPoint.LG}px) {
    padding-top: 69px;
  }
`;

const SelectionBookList: React.FC<SelectionBookListProps> = React.memo((props) => {
  const { genre, type, slug } = props;
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    window.setImmediate(() => setMounted(true));
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <ScrollContainer
      css={css`
        margin-top: 6px;
        position: relative;
      `}
      arrowStyle={arrowVerticalStyle}
    >
      <ul css={[flexRowStart, listCSS]}>
        {(props.items as any[])
          .filter((item) => item.detail)
          .map((item, index) => (
            <SelectionBookItem
              key={index}
              order={index}
              slug={slug}
              genre={genre}
              type={type}
              excluded={item.excluded ?? false}
              book={item}
              width={100}
              css={itemCSS}
            />
          ))}
      </ul>
    </ScrollContainer>
  );
});

export default SelectionBookList;
