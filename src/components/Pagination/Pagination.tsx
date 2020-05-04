import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { useRouter } from 'next/router';
import {
  dodgerBlue50, dodgerBlue60, slateGray20, slateGray50,
} from '@ridi/colors';
import ArrowBoldV from 'src/svgs/ArrowBoldV.svg';
import { css } from '@emotion/core';

interface Props {
  type: 'page' | 'last' | 'first' | 'next' | 'previous';
  page: number;
}

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 60px 0;
`;

const buttonGroup = css`
  :first-of-type {
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
  }
  :last-of-type {
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
  }
  :not(:first-of-type) {
    border-left: 0;
  }
`;
const Page = styled.li<{ isActive?: boolean }>`
  min-width: 38px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    padding: 7px 8px;
    font-weight: bold;
    font-size: 13px;
    ${(props) => props.isActive && 'color: white'};
    display: flex;
    align-items: center;
  }
  border: solid 1px ${slateGray20};
  color: ${slateGray50};
  box-shadow: 0 1px 1px 0 rgba(206, 210, 214, 0.3);

  text-align: center;

  ${(props) => props.isActive && `background: ${dodgerBlue50};`}
  ${(props) => props.isActive && `border: 1px solid ${dodgerBlue60};`}

  ${orBelow(BreakPoint.LG, 'min-width: 42px;')}
`;

const Pages = styled.ul`
  display: flex;
  li {
    ${buttonGroup}
  }
`;

const PageButton = Page.withComponent('button');

const StyledPageButton = styled(PageButton)`
  border-radius: 3px;
  font-size: 13px;
  font-weight: bold;
`;

// function Page(props) {
//   return (
//     <Link href={'/search/'}>
//       <button>{pr}</button>
//     </Link>
//   );
// }

interface PaginationProps {
  totalItem: number;
  pagePerItem: number;
  showPageCount: number;
  currentPage: number;
}

const MAX_ITEM = 9600; // search api result window 10000. 24 * 400 = 9600
const MAX_PAGE = 400;

export function Pagination(props: PaginationProps) {
  const {
    totalItem, currentPage, pagePerItem, showPageCount = 5,
  } = props;
  const totalPage = Math.min(MAX_PAGE, Math.ceil(totalItem / pagePerItem));
  const totalPagination = Math.ceil(totalPage / showPageCount);
  const currentPaginationPosition = Math.ceil(currentPage / showPageCount);
  const showPreviousButton = currentPaginationPosition > 1;
  const showNextButton = currentPaginationPosition < totalPagination;

  const router = useRouter();
  const searchParam = new URLSearchParams(router.query as Record<string, string>);
  searchParam.delete('page');
  return (
    <PaginationWrapper>
      {showPreviousButton && (
        <StyledPageButton>
          <Link href={`/search?${new URLSearchParams(searchParam).toString()}&page=1`}>
            <a>처음</a>
          </Link>
        </StyledPageButton>
      )}
      <Pages>
        {Array.from({ length: showPageCount }, (v, i) => i).map((page, index) => {
          const moveToPage = (currentPaginationPosition - 1) * showPageCount + (index + 1);
          if (totalPage < moveToPage) {
            return null;
          }
          return (
            <Page isActive={currentPage === moveToPage} key={index}>
              <Link href={`/search?${searchParam.toString()}&page=${moveToPage}`}>
                <a>{moveToPage}</a>
              </Link>
            </Page>
          );
        })}
      </Pages>
      {showNextButton && (
        <>
          <StyledPageButton>
            <Link href={`/search?${searchParam.toString()}&page=${totalPage}`}>
              <a>
                <ArrowBoldV />
              </a>
            </Link>
          </StyledPageButton>
          <span>...</span>
          <StyledPageButton>
            <Link href={`/search?${searchParam.toString()}&page=${totalPage}`}>
              <a>마지막</a>
            </Link>
          </StyledPageButton>
        </>
      )}
    </PaginationWrapper>
  );
}
