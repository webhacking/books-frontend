import React, { Fragment } from 'react';
import RankingBookList from './RankingBook/RankingBookList';
import { BookScheme } from 'src/types/book';
import SelectionBook from 'src/components/BookSections/SelectionBook/SelectionBook';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const fontStyle = css`
  font-size: 21px;
  font-weight: normal;
  line-height: 26px;
  color: #000000;
  word-break: keep-all;
`;

// Fixme isn't same ? SectionBookTitle
export const RankingBookTitle = styled.h3`
  ${fontStyle};
  max-width: 1000px;
  margin: 0 auto;
  margin-bottom: 15px;
  padding-top: 6px;
  padding-left: 24px;
  @media (min-width: 834px) and (max-width: 999px) {
    padding-left: 20px;
    padding-right: 20px;
  }
  @media (max-width: 833px) {
    padding-left: 16px;
    padding-right: 16px;
  }
  display: flex;
  a {
    display: flex;
    color: black;
    :link,
    :active {
      color: black;
    }
  }
`;

export const SectionTitle = styled.h3`
  ${fontStyle};
  margin-bottom: 21px;
  @media (max-width: 833px) {
    padding-left: 16px;
    padding-right: 16px;
  }
  @media (min-width: 834px) and (max-width: 999px) {
    padding-left: 20px;
    padding-right: 20px;
  }
  padding-left: 24px;
  display: flex;
  a {
    display: flex;
    color: black;
    :link,
    :active {
      color: black;
    }
  }
`;

export interface RankingOption {
  type: 'big' | 'small';
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
