import React, { useRef } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { SectionTitle } from 'src/components/BookSections/BookSectionContainer';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import useIsTablet from 'src/hooks/useIsTablet';
import ArrowV from 'src/svgs/ArrowV.svg';
import {
  DisplayType, MdBook, SectionExtra, AIRecommendationBook,
} from 'src/types/sections';
import { orBelow } from 'src/utils/mediaQuery';

import SelectionBookCarousel from './SelectionBookCarousel';
import SelectionBookList from './SelectionBookList';
import { SelectionBookListProps } from './types';

const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 24px;
  padding-bottom: 24px;
  ${orBelow(
    999,
    `
      padding-top: 16px;
      padding-bottom: 16px;
    `,
  )};
  -webkit-overflow-scrolling: touch;
`;

interface SelectionBookOwnProps {
  title: string;
  categoryId?: number;
  extra?: SectionExtra;
  selectionId?: number;
}

type SelectionBookProps = SelectionBookOwnProps & SelectionBookListProps;

const SelectionBook: React.FC<SelectionBookProps> = (props) => {
  const {
    genre, type, slug, title, extra, selectionId,
  } = props;

  let _typecheckHack: typeof props.type extends DisplayType.AiRecommendation ? AIRecommendationBook : MdBook;
  const [books] = useBookDetailSelector(props.items as (typeof _typecheckHack)[]);
  const isTablet = useIsTablet();
  const listProps = {
    genre,
    slug,
    type,
    items: books as any,
  };

  // Todo
  // const handleExceptAIRecommendation = (bId: string) => {
  //
  // }
  const targetRef = useRef(null);
  return (
    <SectionWrapper ref={targetRef}>
      <SectionTitle aria-label={title}>
        {extra?.detail_link || (type === DisplayType.HomeMdSelection && selectionId) ? (
          // Todo Refactor
          <a
            css={css`
              display: flex;
            `}
            href={extra?.detail_link ?? `/selection/${selectionId}`}
          >
            <span>{title}</span>
            <span
              css={css`
                margin-left: 7.8px;
              `}
            >
              <ArrowV />
            </span>
          </a>
        ) : (
          <span>{title}</span>
        )}
      </SectionTitle>
      <div>
        {isTablet ? (
          <SelectionBookList {...listProps} />
        ) : (
          <SelectionBookCarousel {...listProps} />
        )}
      </div>
    </SectionWrapper>
  );
};

export default React.memo(SelectionBook);
