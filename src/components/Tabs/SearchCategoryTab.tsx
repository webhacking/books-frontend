import React, { useEffect, useMemo } from 'react';
import * as SearchTypes from 'src/types/searchResults';
import styled from '@emotion/styled';
import {
  slateGray20, slateGray40, slateGray60, slateGray90,
} from '@ridi/colors';
import ScrollContainer from 'src/components/ScrollContainer';
import { scrollBarHidden } from 'src/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { orBelow } from 'src/utils/mediaQuery';

interface SearchCategoryProps {
  categories: SearchTypes.Aggregation[];
  currentCategory: string;
}

const CategoryList = styled.ul`
  display: flex;
  max-width: 952px;
  box-shadow: inset 0px -1px 0px ${slateGray20};
  overflow-x: auto;
  height: 45px;

  ${orBelow(
    999,
    `
    max-width: 100%;
    padding-left: 16px;
  `,
  )};

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

  ${orBelow(
    999,
    `
    position: relative;
    :last-of-type:after {
      content: '';
      display: block;
      position: absolute;
      right: -16px;
      height: 100%;
      width: 16px;
    }
  `,
  )}
`;

const CategoryAnchor = styled.a`
  padding: 15px 4px;
`;

const CategoryName = styled.span<{ active: boolean }>`
  color: ${(props) => (props.active ? slateGray90 : slateGray60)};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? 'bold' : 500)};
`;

function Category(props: {
  currentCategory: string;
  category: SearchTypes.Aggregation;
  searchParam: URLSearchParams;
}) {
  const { currentCategory, category, searchParam } = props;
  const active = useMemo(() => currentCategory === category.category_name, [
    currentCategory,
    category.category_name,
  ]);
  return (
    <CategoryItem key={category.category_id} active={active}>
      <Link
        href={`/search?${searchParam.toString()}&category=${encodeURIComponent(
          category.category_name,
        )}#${category.category_id}`}
      >
        <CategoryAnchor id={category.category_id.toString()}>
          <CategoryName active={active}>{category.category_name}</CategoryName>
          {' '}
          <span>
            (
            {category.doc_count}
            )
          </span>
        </CategoryAnchor>
      </Link>
    </CategoryItem>
  );
}

const MemoizedCategoryItem = React.memo(Category);

function SearchCategoryTab(props: SearchCategoryProps) {
  const { currentCategory = '전체', categories } = props;
  const router = useRouter();
  const searchParam = new URLSearchParams(router?.query as Record<string, any>);
  searchParam.delete('category');

  return (
    <CategoryList>
      {categories.map((category) => (
        <MemoizedCategoryItem
          key={category.category_id}
          currentCategory={currentCategory}
          category={category}
          searchParam={searchParam}
        />
      ))}
    </CategoryList>
  );
}

export default React.memo(SearchCategoryTab);
