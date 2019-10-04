import React, { Fragment } from 'react';
import RankingBookList from './RankingBook/RankingBookList';
import { BookScheme } from 'src/types/book';
import SelectionBook from 'src/components/BookSections/SelectionBook/SelectionBook';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';

const fontStyle = css`
  font-size: 21px;
  font-weight: normal;
  line-height: 26px;
  color: #000000;
  word-break: keep-all;
`;

const titleCSS = css`
  ${between(
    BreakPoint.MD + 1,
    BreakPoint.LG,
    css`
      padding-left: 20px;
      padding-right: 20px;
    `,
  )};
  ${orBelow(
    BreakPoint.MD,
    css`
      padding-left: 16px;
      padding-right: 16px;
    `,
  )};
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  a {
    display: flex;
    color: black;
    :link,
    :active {
      color: black;
    }
  }
`;
// Fixme isn't same ? SectionBookTitle
export const RankingBookTitle = styled.h3`
  ${fontStyle};
  max-width: 1000px;
  margin: 0 auto;
  margin-bottom: 20px;
  padding-top: 6px;
  ${titleCSS};
`;

export const SectionTitle = styled.h3`
  ${fontStyle};
  margin-bottom: 21px;
  ${titleCSS};
`;

export interface RankingOption {
  type: 'big' | 'small';
  timer: boolean;
}

export interface SelectionOption {
  isAIRecommendation: boolean;
}

export interface BookSection {
  type: 'ranking' | 'selection';
  items: BookScheme[];
  option?: RankingOption | SelectionOption;
  title: string;
  url?: string;
}

export interface BookSectionContainerProps {
  sections: BookSection[];
}

const BookSectionContainer: React.FC<BookSectionContainerProps> = props => {
  const renderSection = (section: BookSection) => {
    if (section.type === 'ranking') {
      // Todo 백엔드에서 Section 어떤 구조로 전송해주는지 확인
      return (
        <RankingBookList
          items={section.items}
          type={(section.option as RankingOption).type || 'big'}
          timer={(section.option as RankingOption).type === 'small' || false}
          title={section.title}
          url={section.url}
        />
      );
    }
    if (section.type === 'selection') {
      return (
        <SelectionBook
          option={section.option as SelectionOption}
          items={section.items}
          title={section.title}
          url={section.url}
        />
      );
    }
    return null;
  };
  return (
    <>
      {props.sections.map((section, index) => (
        <Fragment key={index}>{renderSection(section)}</Fragment>
      ))}
    </>
  );
};

export default BookSectionContainer;
