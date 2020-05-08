import * as React from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import styled from '@emotion/styled';
import axios from 'src/utils/axios';
import * as SearchTypes from 'src/types/searchResults';
import { AuthorInfo } from 'src/components/Search/InstantSearchResult';
import {
  slateGray20,
  slateGray40,
  slateGray60,
  slateGray90,
} from '@ridi/colors';
import ArrowBoldH from 'src/svgs/ArrowBoldH.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import isPropValid from '@emotion/is-prop-valid';
import { SearchCategoryTab } from 'src/components/Tabs';
import { css } from '@emotion/core';
import { useCallback, useEffect } from 'react';
import sentry from 'src/utils/sentry';
import { useEventTracker } from 'src/hooks/useEventTracker';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import { booksActions } from 'src/services/books';
import ScrollContainer from 'src/components/ScrollContainer';
import pRetry from 'p-retry';
import { keyToArray } from 'src/utils/common';
import { SearchLandscapeBook } from 'src/components/Book/SearchLandscapeBook';
import { Pagination } from 'src/components/Pagination/Pagination';
import useIsTablet from 'src/hooks/useIsTablet';
import { FilterSelector } from 'src/components/Search/FilterSelector';

interface SearchProps {
  q?: string;
  book: SearchTypes.BookResult;
  author: SearchTypes.AuthorResult;
  categories: SearchTypes.Aggregation[];
  currentCategoryId: string;
  currentPage?: string;
}

const SearchResultSection = styled.section`
  max-width: 952px;
  margin: 0 auto;

  ${orBelow(BreakPoint.MD, 'max-width: 100%;')}
`;

const SearchTitle = styled.h2`
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  color: ${slateGray90};
  display: flex;
  align-items: center;
  padding: 10px 0;
  ${orBelow(BreakPoint.LG, 'padding: 10px 16px;')}
`;

const TotalAuthor = styled.span`
  font-size: 13px;
  font-weight: normal;
  margin-left: 5px;
  color: ${slateGray40};
`;

const AuthorItem = styled.li<{ show: boolean }>`
  padding: 12px 0;
  display: ${(props) => (props.show ? 'flex' : 'none')};
  align-items: center;
`;

const AuthorList = styled.ul`
  margin-bottom: 16px;
  ${orBelow(BreakPoint.LG, 'padding: 10px 16px;')}
`;

const ShowMoreAuthor = styled.li`
  padding: 12px 0;
  color: ${slateGray60};
  font-size: 13px;
  font-weight: bold;
  display: flex;
  cursor: pointer;
  align-items: center;
`;

const MAXIMUM_AUTHOR = 30;
const DEFAULT_SHOW_AUTHOR_COUNT = 3;

const ITEM_PER_PAGE = 24;

const Arrow = styled(ArrowBoldH, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'isRotate',
})<{ isRotate: boolean }>`
  width: 11px;
  fill: ${slateGray40};
  margin-left: 5px;
  transform: rotate(${(props) => (props.isRotate ? '180deg' : '0deg')});
`;

function Author(props: { author: SearchTypes.Author; q: string; show: boolean }) {
  const { author, q, show } = props;
  return (
    <AuthorItem show={show}>
      <a href={`/author/${author.id}?_s=search&_q=${encodeURIComponent(q)}`}>
        <AuthorInfo author={author} />
      </a>
    </AuthorItem>
  );
}

const MemoizedAuthor = React.memo(Author);

function Authors(props: { author: SearchTypes.AuthorResult; q: string }) {
  const {
    author: { authors, total },
    q,
  } = props;
  const [isShowMore, setShowMore] = React.useState(false);
  const authorsPreview = authors.slice(0, DEFAULT_SHOW_AUTHOR_COUNT);
  const restAuthors = authors.slice(DEFAULT_SHOW_AUTHOR_COUNT, authors.length);

  return (
    <AuthorList>
      {authorsPreview.map((author) => (
        <MemoizedAuthor show key={author.id} author={author} q={q} />
      ))}
      {restAuthors.map((author) => (
        <MemoizedAuthor show={isShowMore} key={author.id} author={author} q={q} />
      ))}
      {authors.length > DEFAULT_SHOW_AUTHOR_COUNT && (
        <ShowMoreAuthor onClick={() => setShowMore((current) => !current)}>
          {isShowMore ? (
            <span>접기</span>
          ) : (
            <span>
              {Math.min(total, MAXIMUM_AUTHOR) - DEFAULT_SHOW_AUTHOR_COUNT}
              명 더 보기
            </span>
          )}
          <Arrow isRotate={isShowMore} />
        </ShowMoreAuthor>
      )}
    </AuthorList>
  );
}

const SearchBookList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const SearchBookItem = styled.li`
  display: flex;
  margin: 0 4px;
  padding: 20px 0;
  border-bottom: 1px solid ${slateGray20};
  align-items: flex-start;
  ${orBelow(BreakPoint.LG, 'margin: 0 20px;')};
`;


const Filters = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  ${orBelow(BreakPoint.LG, 'margin-left: 16px; margin-right: 16px;')}
`;


const MemoizedAuthors = React.memo(Authors);

const EmptyBlock = styled.div`
  margin-top: 108px;
`;

function SearchPage(props: SearchProps) {
  const {
    author,
    book,
    categories,
    currentCategoryId,
    q,
  } = props;

  const [tracker] = useEventTracker();
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const isTablet = useIsTablet();
  const setPageView = useCallback(() => {
    if (tracker) {
      try {
        tracker.sendPageView(window.location.href, document.referrer);
      } catch (error) {
        sentry.captureException(error);
      }
    }
  }, [tracker]);
  const hasPagination = book.total > ITEM_PER_PAGE && book.books.length > 0;
  useEffect(() => {
    setPageView();
  }, [loggedUser]);
  return (
    <SearchResultSection>
      <Head>
        <title>
          {q}
          {' '}
          검색 결과 - 리디북스
        </title>
      </Head>
      {
        author.total > 0 && (
          <>
            <SearchTitle>
              {`‘${q}’ 저자 검색 결과`}
              <TotalAuthor>
                {
                  author.total > MAXIMUM_AUTHOR ? '총 30명+' : `총 ${author.total}명`
                }
              </TotalAuthor>
            </SearchTitle>
            <MemoizedAuthors author={author} q={q || ''} />
          </>
        )
      }
      {book.total > 0 && (
        <>
          <SearchTitle>{`‘${q}’ 도서 검색 결과`}</SearchTitle>
          {categories.length > 0 && (
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
              <SearchCategoryTab
                categories={categories}
                currentCategoryId={
                  parseInt(currentCategoryId, 10)
                }
              />
            </ScrollContainer>
          )}
          <Filters>
            <FilterSelector />
            <div>
              Todo Adult Exclude Toggle
            </div>
          </Filters>
          <SearchBookList>
            {props.book.books.map((item) => (
              <SearchBookItem key={item.b_id}>
                <SearchLandscapeBook
                  item={item}
                  title={item.title}
                />
              </SearchBookItem>
            ))}
          </SearchBookList>
          {hasPagination ? (
            <Pagination
              itemPerPage={ITEM_PER_PAGE}
              currentPage={parseInt(props.currentPage || '1', 10)}
              totalItem={props.book.total}
              showStartAndLastButton={!isTablet}
              showPageCount={isTablet ? 5 : 10}
            />
          ) : (
            <EmptyBlock />
          )}
        </>
      )}
    </SearchResultSection>
  );
}

const orderType = ['score', 'recent', 'review_cnt', 'price', 'similarity'];

SearchPage.getInitialProps = async (props: ConnectedInitializeProps) => {
  const { store, query } = props;
  const searchKeyword = String(query.q || '');
  const page = String(query.page || '1');
  const categoryId = String(query.category_id || '0');
  const searchUrl = new URL('/search', process.env.NEXT_STATIC_SEARCH_API);
  const order = String(query.order || 'score');

  searchUrl.searchParams.set('site', 'ridi-store');
  searchUrl.searchParams.append('where', 'book');
  if (orderType.includes(order)) {
    searchUrl.searchParams.set('order', order);
  }
  const isPublisherSearch = searchKeyword.startsWith('출판사:');
  if (/^\d+$/.test(categoryId)) {
    searchUrl.searchParams.set('category_id', categoryId);
  }
  if (/^\d+$/.test(page)) {
    const startPosition = ITEM_PER_PAGE * (parseInt(page, 10) - 1);
    searchUrl.searchParams.set('start', startPosition.toString());
  }
  if (isPublisherSearch) {
    searchUrl.searchParams.set('what', 'publisher');
    searchUrl.searchParams.set(
      'keyword',
      searchKeyword.replace('출판사:', ''),
    );
  } else {
    searchUrl.searchParams.set('what', 'base');
    searchUrl.searchParams.append('where', 'author');
    searchUrl.searchParams.set('keyword', searchKeyword);
  }
  const { data } = await pRetry(
    () => axios.get(searchUrl.toString()),
    {
      retries: 3,
    },
  );
  const searchResult = SearchTypes.checkSearchResult(isPublisherSearch ? {
    book: data,
    author: { total: 0, authors: [] },
  } : data);
  const bIds = keyToArray(searchResult.book, 'b_id');
  store.dispatch({ type: booksActions.insertBookIds.type, payload: bIds });
  return {
    q: searchKeyword,
    book: searchResult.book,
    author: searchResult.author,
    categories: searchResult.book.aggregations,
    currentCategoryId: categoryId,
    currentPage: page,
  };
};

export default SearchPage;
