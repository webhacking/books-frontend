import React, { useEffect } from 'react';
import * as SearchTypes from 'src/types/searchResults';
import styled from '@emotion/styled';
import { slateGray20, slateGray40 } from '@ridi/colors';
import ScrollContainer from 'src/components/ScrollContainer';
import { scrollBarHidden } from 'src/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SearchCategoryProps {
  categories: SearchTypes.Aggregation[];
  currentCategory: string;
}

const CategoryList = styled.ul`
  display: flex;
  max-width: 952px;
  border-bottom: 1px solid ${slateGray20};
  overflow-x: auto;
  height: 45px;
  ${scrollBarHidden}
`;

const CategoryItem = styled.li<{ active: boolean }>`
  flex: none;
  display: flex;
  justify-content: space-between;
  :not(:first-of-type) {
    margin-left: 10px;
  }
  box-shadow: ${(props) => (props.active ? `inset 0px -3px 0px ${slateGray40}` : 'none')};

  cursor: pointer;
`;

const CategoryAnchor = styled.a`
  padding: 15px 4px;
`;

function SearchCategoryTab(props: SearchCategoryProps) {
  const { currentCategory = '전체', categories } = props;
  const router = useRouter();
  const searchParam = new URLSearchParams(router?.query as Record<string, any>);
  searchParam.delete('category');

  return (
    <CategoryList>
      {categories.map((category) => (
        <CategoryItem
          key={category.category_id}
          active={currentCategory === category.category_name}
        >
          <Link
            href={`/search?${searchParam.toString()}&category=${encodeURIComponent(
              category.category_name,
            )}#${category.category_id}`}
          >
            <CategoryAnchor
              id={category.category_id.toString()}
            >
              {`${category.category_name} (${category.doc_count})`}
            </CategoryAnchor>
          </Link>
        </CategoryItem>
      ))}
    </CategoryList>
  );
}

export default React.memo(SearchCategoryTab);
