import * as React from 'react';
import styled from '@emotion/styled';
import { BookScheme } from 'src/types/book';

const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
`;

interface SelectionBookProps {
  items: BookScheme[];
  title: string;
}

const SelectionBook: React.FC<SelectionBookProps> = props => {
  return (
    <SectionWrapper>
      {props.items.map((book, index) => {
        return <div key={index}>{book.title}</div>;
      })}
    </SectionWrapper>
  );
};

export default SelectionBook;
