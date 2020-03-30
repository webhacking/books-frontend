import React, { useEffect, useState } from 'react';
import { css } from '@emotion/core';

import ScrollContainer from 'src/components/ScrollContainer';
import { flexRowStart } from 'src/styles';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { DisplayType, MdBook } from 'src/types/sections';
import { useExcludeRecommendation } from 'src/hooks/useExcludeRecommedation';

import { SelectionBookItem } from './SelectionBook';

export const listCSS = css`
  padding-top: 7px;
  padding-left: 7px;
  box-sizing: content-box;
  overflow: auto;
  overflow-y: hidden;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-left: -5px;
      //margin-right: 6px;
    `,
  )}
`;

export const itemCSS = css`
  display: flex;
  flex: none;
  flex-direction: column;
  :first-of-type {
    padding-left: 20px;
  }
  margin-right: 20px;
  box-sizing: content-box;

  ${orBelow(
    BreakPoint.MD,
    css`
      margin-right: 12px;
      :first-of-type {
        padding-left: 16px;
      }
    `,
  )};
  ${between(
    834,
    999,
    css`
      margin-right: 20px;
    `,
  )};
  align-items: flex-start;
`;

export const loadingItemCSS = css`
  display: flex;
  flex-direction: row;
  :first-of-type {
    padding-left: 18px;
  }
  margin-right: 20px;
  box-sizing: content-box;

  ${orBelow(
    BreakPoint.MD,
    css`
      margin-right: 12px;
      :first-of-type {
        padding-left: 13px;
      }
    `,
  )};
  ${between(
    834,
    999,
    css`
      :first-of-type {
        padding-left: 17px;
      }
      margin-right: 20px;
    `,
  )};
  align-items: flex-start;
`;

const arrowVerticalStyle = css`
  padding-top: 98px;
  @media (max-width: ${BreakPoint.LG}px) {
    padding-top: 69px;
  }
`;

interface SelectionBookListProps {
  items: MdBook[];
  isAIRecommendation: boolean;
  type: DisplayType;
  genre: string;
  slug: string;
}

const SelectionBookList: React.FC<SelectionBookListProps> = React.memo((props) => {
  const { genre, type, slug } = props;
  const [requestExclude, requestCancel] = useExcludeRecommendation();
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
        {props.items
          .filter((item) => item.detail)
          .map((item, index) => (
            <li key={index} css={itemCSS}>
              <SelectionBookItem
                order={index}
                slug={slug}
                genre={genre}
                type={type}
                isAIRecommendation={props.isAIRecommendation}
                aiRecommendationCallback={{
                  exclude: requestExclude,
                  excludeCancel: requestCancel,
                }}
                excluded={item.excluded ?? false}
                book={item}
                width={100}
              />
            </li>
          ))}
      </ul>
    </ScrollContainer>
  );
});

export default SelectionBookList;
