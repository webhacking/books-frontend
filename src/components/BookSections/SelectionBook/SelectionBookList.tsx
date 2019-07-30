import * as React from 'react';
import { flexRowStart, scrollBarHidden } from 'src/styles';
import { BookScheme } from 'src/types/book';
import { SelectionBookItem } from 'src/components/BookSections/SelectionBook/SelectionBook';
import { css } from '@emotion/core';

const itemCSS = css`
  display: flex;
  flex-direction: column;
  :first-of-type {
    padding-left: 20px;
  }
  margin-right: 20px;
  :last-of-type {
    padding-right: 20px;
  }
  box-sizing: content-box;

  @media (max-width: 833px) {
    :last-of-type {
      padding-right: 16px;
    }
    :first-of-type {
      padding-left: 16px;
    }
  }
  align-items: flex-start;
`;

interface SelectionBookListProps {
  items: BookScheme[];
  isAIRecommendation: boolean;
}

const SelectionBookList: React.FC<SelectionBookListProps> = props => (
  <ul
    css={css`
      ${flexRowStart};
      padding-bottom: 48px;
      box-sizing: content-box;
      overflow: auto;
      ${scrollBarHidden};
    `}>
    {props.items.map((item, index) => (
      <li key={index} css={itemCSS}>
        <SelectionBookItem
          isAIRecommendation={props.isAIRecommendation}
          book={item}
          width={120}
        />
      </li>
    ))}
  </ul>
);

export default SelectionBookList;
