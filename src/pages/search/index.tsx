import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import styled from '@emotion/styled';
import * as SearchTypes from 'src/types/searchResults';
import { AuthorInfo } from 'src/components/Search/InstantSearchResult';
import {
  dodgerBlue50,
  slateGray10,
  slateGray20,
  slateGray40,
  slateGray50,
  slateGray60,
  slateGray90,
} from '@ridi/colors';
import ArrowBoldH from 'src/svgs/ArrowBoldH.svg';
import Lens from 'src/svgs/Lens.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import isPropValid from '@emotion/is-prop-valid';
import { SearchCategoryTab } from 'src/components/Tabs';
import { useCallback, useEffect } from 'react';
import sentry from 'src/utils/sentry';
import { useEventTracker } from 'src/hooks/useEventTracker';

import { RootState } from 'src/store/config';
import { Pagination } from 'src/components/Pagination/Pagination';
import SearchLandscapeBook from 'src/components/Search/SearchLandscapeBook';
import useIsTablet from 'src/hooks/useIsTablet';
import { AdultExcludeToggle, FilterSelector } from 'src/components/Search';
import { useRouter } from 'next/router';
import { defaultHoverStyle } from 'src/styles';
import { useSearchQueries } from 'src/hooks/useSearchQueries';
import { booksActions } from 'src/services/books';
import { ITEM_PER_PAGE, MAX_PAGE, runSearch } from 'src/utils/search';
import { Border } from 'src/components/Tabs/SearchCategoryTab';
import SkeletonCategoryTab from 'src/components/Skeleton/CategoryTab';

const SearchResultSection = styled.section`
  max-width: 952px;
  min-height: 620px;
  margin: 0 auto;
  padding-top: 8px;
  ${orBelow(BreakPoint.LG, 'max-width: 100%;')}
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
  display: ${(props) => (props.show ? 'flex' : 'none')};
  align-items: center;
`;

const AuthorList = styled.ul`
  margin-bottom: 16px;
  > li {
    ${defaultHoverStyle}
  }
`;

const ShowMoreAuthor = styled.button`
  padding: 12px 0;
  height: 46px;
  color: ${slateGray60};
  font-size: 13px;
  font-weight: bold;
  display: flex;
  cursor: pointer;
  align-items: center;
  width: 100%;
  outline: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  ${orBelow(BreakPoint.LG, 'padding: 12px 16px;')}
`;

const AuthorAnchor = styled.a`
  width: 100%;
  padding: 12px 0;
  :active {
    background: rgba(0, 0, 0, 0.05);
  }
  -webkit-tap-highlight-color: rgb(0, 0, 0, 0.05);
  ${orBelow(BreakPoint.LG, 'padding: 12px 16px;')}
`;

const MAXIMUM_AUTHOR = 30;
const DEFAULT_SHOW_AUTHOR_COUNT = 3;

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
      <AuthorAnchor href={`/author/${author.id}?_s=search&_q=${encodeURIComponent(q)}`}>
        <AuthorInfo author={author} />
      </AuthorAnchor>
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
        <li>
          <ShowMoreAuthor onClick={() => setShowMore((current) => !current)}>
            {isShowMore ? '접기' : `${Math.min(total, MAXIMUM_AUTHOR) - DEFAULT_SHOW_AUTHOR_COUNT}명 더 보기`}
            <Arrow isRotate={isShowMore} />
          </ShowMoreAuthor>
        </li>
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
  padding: 20px 0;
  border-bottom: 1px solid ${slateGray20};
  align-items: flex-start;
  ${orBelow(BreakPoint.LG, 'margin: 0 16px;')};
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
  margin-top: 40px;
`;

const NoResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    flex: none;
    margin-bottom: 16px;
  }
  padding: 200px 0 360px;
  ${orBelow(BreakPoint.MD, 'padding: 80px 0 240px;')}
`;

const NoResultLens = styled(Lens)`
  width: 83.5px;
  height: 83.5px;
  fill: ${slateGray10};
`;

const NoResultText = styled.p`
  font-size: 14px;
  color: ${slateGray50};
`;

const SuggestButton = styled.a`
  height: 40px;
  padding: 12px 48px;
  font-weight: bold;
  font-size: 14px;
  border: 1px solid ${dodgerBlue50};
  color: ${dodgerBlue50};
  border-radius: 3px;
`;

function SearchPage() {
  const dispatch = useDispatch();
  const { query, calculateUpdateQuery } = useSearchQueries();
  const {
    q,
    isAdultExclude,
    page,
    categoryId: currentCategoryId,
    order,
  } = query;
  const [authors, setAuthors] = React.useState<SearchTypes.AuthorResult>();
  const [books, setBooks] = React.useState<SearchTypes.BookResult>();
  const [categories, setCategories] = React.useState<SearchTypes.Aggregation[]>();

  React.useEffect(() => {
    (async () => {
      const result = await runSearch(query);
      setAuthors((orig) => orig || result.author);
      setBooks((orig) => orig || result.book);
      setCategories((orig) => orig || result.book.aggregations);

      const bIds = result.book.books.map((book) => book.b_id);
      dispatch({
        type: booksActions.insertBookIds.type,
        payload: { bIds, withDesc: true },
      });
    })();
  }, [query]);

  React.useEffect(() => {
    setAuthors(undefined);
  }, [q]);
  React.useEffect(() => {
    setBooks(undefined);
  }, [q, isAdultExclude, page, currentCategoryId, order]);
  React.useEffect(() => {
    setCategories(undefined);
  }, [q, isAdultExclude]);

  const [tracker] = useEventTracker();
  const router = useRouter();
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
  const hasPagination = books != null && books.total > ITEM_PER_PAGE && books.books.length > 0;

  useEffect(() => {
    setPageView();
  }, [loggedUser]);
  useEffect(() => {
    if (books == null) {
      return;
    }
    const availableMaxPage = Math.min(Math.ceil(books.total / ITEM_PER_PAGE), MAX_PAGE);
    if (page > availableMaxPage && books.total > 0) {
      const search = calculateUpdateQuery({ page: availableMaxPage });
      router.replace(`/search?${search}`);
    }
  }, [page, books?.total, calculateUpdateQuery]);
  useEffect(() => {
    if (categories == null) {
      return;
    }
    if (categories.every((category) => String(category.category_id) !== currentCategoryId)) {
      const search = calculateUpdateQuery({ categoryId: '0' });
      router.replace(`/search?${search}`);
    }
  }, [categories, currentCategoryId]);

  let booksNode;
  if (books != null) {
    if (books.total > 0) {
      booksNode = (
        <SearchBookList>
          {books.books.map((item, index) => (
            <SearchBookItem key={item.b_id}>
              <SearchLandscapeBook item={item} title={item.title} q={q || ''} index={index} />
            </SearchBookItem>
          ))}
        </SearchBookList>
      );
    } else {
      booksNode = (
        <NoResult>
          <NoResultLens />
          <NoResultText>{`‘${q}’에 대한 도서 검색 결과가 없습니다.`}</NoResultText>
          <SuggestButton href="https://help.ridibooks.com/hc/ko/requests/new?ticket_form_id=664028" rel="noreferrer nooppener" target="_blank">도서 제안하기</SuggestButton>
        </NoResult>
      );
    }
  } else {
    booksNode = null;
  }
  return (
    <SearchResultSection>
      <Head>
        <title>
          {q}
          {' '}
          검색 결과 - 리디북스
        </title>
      </Head>
      {authors != null && authors.total > 0 && (
        <>
          <SearchTitle>
            {`‘${q}’ 저자 검색 결과`}
            <TotalAuthor>
              {authors.total > MAXIMUM_AUTHOR ? `총 ${MAXIMUM_AUTHOR}명+` : `총 ${authors.total}명`}
            </TotalAuthor>
          </SearchTitle>
          <MemoizedAuthors author={authors} q={q || ''} />
        </>
      )}

      <>
        <SearchTitle>{`‘${q}’ 도서 검색 결과`}</SearchTitle>
        {categories != null && categories.length > 0 ? (
          <SearchCategoryTab
            categories={categories}
            currentCategoryId={parseInt(currentCategoryId, 10)}
          />
        ) : (
          <>
            <SkeletonCategoryTab />
            <Border color={slateGray10} />
          </>
        )}
        <Filters>
          <FilterSelector />
          <AdultExcludeToggle adultExclude={isAdultExclude} />
        </Filters>
        {booksNode}
        {hasPagination ? (
          <Pagination
            itemPerPage={ITEM_PER_PAGE}
            currentPage={Math.max(page, 1)} // 0 이하로 떨어지는 걸 방지
            totalItem={books?.total || 0}
            showStartAndLastButton={!isTablet}
            showPageCount={isTablet ? 5 : 10}
            maxPage={MAX_PAGE}
          />
        ) : (
          <EmptyBlock />
        )}
      </>
    </SearchResultSection>
  );
}

export default SearchPage;
