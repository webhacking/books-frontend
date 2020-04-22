import React from 'react';
import styled from '@emotion/styled';

import { SectionTitle, SectionTitleLink } from 'src/components/BookSections/SectionTitle';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import useIsTablet from 'src/hooks/useIsTablet';
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
  padding: 24px 0;
  -webkit-overflow-scrolling: touch;

  ${orBelow(999, 'padding: 16px 0;')}
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

  let sectionHref = extra?.detail_link;
  if (!sectionHref && type === DisplayType.HomeMdSelection) {
    sectionHref = `/selection/${selectionId}`;
  }

  return (
    <SectionWrapper>
      <SectionTitle>
        <SectionTitleLink title={title} href={sectionHref} />
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
