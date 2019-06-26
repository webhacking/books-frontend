import * as React from 'react';
import { Fragment } from 'react';
import RankingBookList from './RankingBook/RankingBookList';
import { BookScheme } from 'src/types/book';
import SelectionBook from 'src/components/BookSections/SelectionBook/SelectionBook';

export interface RankingOption {
  type: 'big' | 'small';
}

export interface BookSection {
  type: 'ranking' | 'selection';
  items: BookScheme[];
  option?: RankingOption;
  title?: string;
}

export interface BookSectionContainerProps {
  sections: BookSection[];
}

const BookSectionContainer: React.FC<BookSectionContainerProps> = props => {
  const renderSection = (section: BookSection) => {
    if (section.type === 'ranking') {
      // Todo 백엔드에서 Section 어떤 구조로 전송해주는지 확인
      return <RankingBookList items={section.items} type={section.option!.type || 'big'} />;
    }
    if (section.type === 'selection') {
      return <SelectionBook items={section.items} title={'hello'} />;
    }
    return null;
  };
  return (
    <section>
      {props.sections.map((section, index) => {
        return <Fragment key={index}>{renderSection(section)}</Fragment>;
      })}
    </section>
  );
};

export default BookSectionContainer;
