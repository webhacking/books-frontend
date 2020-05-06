import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

const FilterWrapper = styled.div`
  margin-top: 12px;
`;
export function FilterSelector() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState(router.query?.order ?? 'score');
  function applyFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    const searchParams = new URLSearchParams(
      (router.query as Record<string, string>) || {},
    );
    searchParams.set('order', e.target.value);
    setSelectedFilter(e.target.value);
    router.push(`/search?${searchParams.toString()}`);
  }
  return (
    <FilterWrapper>
      <select
        value={selectedFilter}
        onChange={applyFilter}
        // Enforce usage of onBlur over onChange for accessibility.
        // https://github.com/reactjs/react-a11y/blob/master/docs/rules/no-onchange.md
        onBlur={applyFilter}
      >
        <option value="score">인기순</option>
        <option value="recent">최신순</option>
        <option value="review_cnt">리뷰 많은순</option>
        <option value="price">낮은 가격순</option>
        <option value="similarity">정확도순</option>
      </select>
    </FilterWrapper>
  );
}
