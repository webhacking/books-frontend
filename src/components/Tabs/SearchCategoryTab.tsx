import React from 'react';
import * as SearchTypes from 'src/types/searchResults';
import styled from '@emotion/styled';
import {
  slateGray20,
  slateGray40,
  slateGray50,
  slateGray60,
  slateGray90,
} from '@ridi/colors';
import { scrollBarHidden } from 'src/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

interface SearchCategoryProps {
  categories: SearchTypes.Aggregation[];
  currentCategoryId: number;
}

const CategoryList = styled.ul`
  display: flex;
  box-shadow: inset 0px -1px 0px ${slateGray20};
  height: 45px;

  ${orBelow(BreakPoint.MD, 'padding-left: 16px; padding-right: 16px;')};
`;

const CategoryItem = styled.li<{ active: boolean }>`
  flex: none;
  display: flex;
  justify-content: space-between;
  :not(:first-of-type) {
    margin-left: 10px;
  }
  ${(props) => (props.active && `box-shadow: inset 0px -3px 0px ${slateGray40};`)}

  cursor: pointer;

`;

const CategoryAnchor = styled.a`
  padding: 15px 4px;
`;

const CategoryName = styled.span<{ active: boolean }>`
  color: ${(props) => (props.active ? slateGray90 : slateGray60)};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;

const CategoryCount = styled(CategoryName)`
  opacity: 0.7;
  color: ${(props) => (props.active ? slateGray90 : slateGray50)};
`;

function Category(props: {
  currentCategoryId: number;
  category: SearchTypes.Aggregation;
  searchParam: URLSearchParams;
}) {
  const { currentCategoryId, category, searchParam } = props;
  const active = currentCategoryId === category.category_id;
  searchParam.delete('category_id');
  searchParam.append('category_id', category.category_id.toString());
  return (
    <CategoryItem active={active}>
      <Link
        href={`/search?${searchParam.toString()}#${category.category_id}`}
      >
        <CategoryAnchor id={category.category_id.toString()}>
          <CategoryName active={active}>{category.category_name}</CategoryName>
          {' '}
          <CategoryCount active={active}>
            (
            {category.doc_count}
            )
          </CategoryCount>
        </CategoryAnchor>
      </Link>
    </CategoryItem>
  );
}

function SearchCategoryTab(props: SearchCategoryProps) {
  const { currentCategoryId = 0, categories } = props;
  const router = useRouter();
  const searchParam = new URLSearchParams(router?.query as Record<string, any>);
  searchParam.delete('category');

  return (
    <CategoryList>
      {categories.map((category) => (
        <Category
          key={category.category_id}
          currentCategoryId={currentCategoryId}
          category={category}
          searchParam={searchParam}
        />
      ))}
    </CategoryList>
  );
}

export default SearchCategoryTab;
