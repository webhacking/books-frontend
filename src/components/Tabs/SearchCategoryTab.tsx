import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
  slateGray20,
  slateGray40,
  slateGray60,
} from '@ridi/colors';
import Link from 'next/link';
import { useRouter } from 'next/router';

import ScrollContainer from 'src/components/ScrollContainer';
import * as SearchTypes from 'src/types/searchResults';
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
  cursor: pointer;
  ${(props) => (props.active && `box-shadow: inset 0px -3px 0px ${slateGray40};`)}
`;

const CategoryAnchor = styled.a`
  padding: 15px 4px;
  :active {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const CategoryName = styled.span<{ active: boolean }>`
  color: ${slateGray60};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  ${(props) => (!props.active && 'opacity: 0.7;')}
`;

const CategoryCount = styled(CategoryName)`
  font-size: 13px;
`;

function Category(props: {
  currentCategoryId: number;
  category: SearchTypes.Aggregation;
  searchParam: URLSearchParams;
  focusElementRef: React.Ref<HTMLElement>;
}) {
  const {
    currentCategoryId, category, searchParam, focusElementRef,
  } = props;
  const active = currentCategoryId === category.category_id;
  const copiedSearchParam = new URLSearchParams(searchParam);
  copiedSearchParam.set('category_id', category.category_id.toString());
  copiedSearchParam.delete('page');
  return (
    <CategoryItem
      ref={active ? focusElementRef as React.Ref<HTMLLIElement> : undefined}
      active={active}
    >
      <Link
        href={`/search?${copiedSearchParam.toString()}`}
      >
        <CategoryAnchor>
          <CategoryName active={active}>{category.category_name}</CategoryName>
          {' '}
          <CategoryCount active={active}>
            (
            {category.doc_count.toLocaleString('ko-KR')}
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
  searchParam.delete('category_id');

  return (
    <ScrollContainer
      arrowStyle={css`
        button {
          border-radius: 0;
          box-shadow: none;
          position: relative;
          top: 3px;
          width: 20px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.3) 27.6%,
            rgba(255, 255, 255, 0.3) 47.6%,
            #ffffff 53.65%
          );
        }
      `}
    >
      {(focusElementRef) => (
        <CategoryList>
          {categories.map((category) => (
            <Category
              key={category.category_id}
              focusElementRef={focusElementRef}
              currentCategoryId={currentCategoryId}
              category={category}
              searchParam={searchParam}
            />
          ))}
        </CategoryList>
      )}
    </ScrollContainer>
  );
}

export default SearchCategoryTab;
