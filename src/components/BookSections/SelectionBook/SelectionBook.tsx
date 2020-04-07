import React, { useRef } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import {
  SectionTitle,
  SelectionOption,
} from 'src/components/BookSections/BookSectionContainer';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import useIsTablet from 'src/hooks/useIsTablet';
import ArrowV from 'src/svgs/ArrowV.svg';
import { DisplayType, MdBook, SectionExtra } from 'src/types/sections';
import { orBelow } from 'src/utils/mediaQuery';

import SelectionBookCarousel from './SelectionBookCarousel';
import SelectionBookList from './SelectionBookList';

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

interface SelectionBookProps {
  items: MdBook[];
  title: string;
  option: SelectionOption;
  genre: string;
  type: DisplayType;
  categoryId?: number;
  extra?: SectionExtra;
  selectionId?: number;
  slug: string;
}

const SelectionBook: React.FC<SelectionBookProps> = (props) => {
  const {
    genre, type, slug, title, extra, selectionId,
  } = props;

  const [books, isFetching] = useBookDetailSelector(props.items) as [MdBook[], boolean];
  const isTablet = useIsTablet();

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
          <SelectionBookList
            slug={slug}
            type={type}
            genre={genre}
            isAIRecommendation={props.option.isAIRecommendation}
            items={books}
          />
        ) : (
          <SelectionBookCarousel
            type={type}
            slug={slug}
            genre={genre}
            isAIRecommendation={props.option.isAIRecommendation}
            items={books}
            bookFetching={isFetching}
          />
        )}
      </div>
    </SectionWrapper>
  );
};

export default React.memo(SelectionBook);
