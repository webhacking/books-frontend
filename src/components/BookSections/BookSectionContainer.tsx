import * as React from 'react';
import { Fragment } from 'react';
import RankingBookList from './RankingBook/RankingBookList';
import { BookScheme } from 'src/types/book';
import SelectionBook from 'src/components/BookSections/SelectionBook/SelectionBook';
import styled from '@emotion/styled';

export const RankingBookTitle = styled.h3`
  max-width: 1000px;
  margin: 0 auto;
  height: 21px;
  font-size: 21px;
  font-weight: normal;
  line-height: 1;
  letter-spacing: -0.23px;
  color: #000000;
  margin-bottom: 15px;
  padding-top: 6px;
  padding-left: 24px;
  @media (min-width: 834px) and (max-width: 999px) {
    padding-left: 20px;
  }
  @media (max-width: 833px) {
    padding-left: 16px;
  }
`;

export const SectionTitle = styled.h3`
  height: 21px;
  font-size: 21px;
  font-weight: normal;
  line-height: 1;
  letter-spacing: -0.23px;
  color: #000000;
  margin-bottom: 21px;
  @media (max-width: 833px) {
    padding-left: 16px;
  }
  @media (min-width: 834px) and (max-width: 999px) {
    padding-left: 20px;
  }
  padding-left: 24px;
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
          type={(section.option as RankingOption)!.type || 'big'}
          title={section.title}
        />
      );
    }
    if (section.type === 'selection') {
      return (
        <SelectionBook
          option={section.option as SelectionOption}
          items={section.items}
          title={section.title}
        />
      );
    }
    return null;
  };
  return (
    <>
      {props.sections.map((section, index) => {
        return <Fragment key={index}>{renderSection(section)}</Fragment>;
      })}
    </>
  );
};

export default BookSectionContainer;
