import * as React from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import styled from '@emotion/styled';
import axios from 'src/utils/axios';
import * as SearchTypes from 'src/types/searchResults';
import Cookies from 'universal-cookie';
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
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import { booksActions } from 'src/services/books';
import pRetry from 'p-retry';
import { keyToArray } from 'src/utils/common';
import { SearchLandscapeBook } from 'src/components/Book/SearchLandscapeBook';
import { Pagination } from 'src/components/Pagination/Pagination';
import useIsTablet from 'src/hooks/useIsTablet';
import { AdultExcludeToggle, FilterSelector } from 'src/components/Search';
import { useRouter } from 'next/router';
import { defaultHoverStyle } from 'src/styles';
import { useDeviceType } from 'src/hooks/useDeviceType';

interface SearchProps {
  q?: string;
  book: SearchTypes.BookResult;
  author: SearchTypes.AuthorResult;
  categories: SearchTypes.Aggregation[];
  currentCategoryId: string;
  currentPage?: string;
  isAdultExclude: boolean;
}

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
  > label {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
    ${defaultHoverStyle}
  }

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
// const MAX_ITEM = 9600; // search api result window 10000. 24 * 400 = 9600
const MAX_PAGE = 400;

function SearchPage(props: SearchProps) {
  const {
    author,
    book,
    categories,
    currentCategoryId,
    currentPage,
    q,
    isAdultExclude,
  } = props;

  const [tracker] = useEventTracker();
  const router = useRouter();
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const isTablet = useIsTablet();
  const { deviceType } = useDeviceType();
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
  const page = parseInt(currentPage || '1', 10);

  const searchBookClickHandler = (genre: string, index: number, bId: string) => {
    if (tracker) {
      try {
        tracker.sendEvent('click', { section: `${deviceType}.search.result_book.${genre}`, items: [{ id: bId, idx: index, ts: Date.now() }] });
      } catch (error) {
        sentry.captureException(error);
      }
    }
  };
  useEffect(() => {
    setPageView();
  }, [loggedUser]);
  useEffect(() => {
    const availableMaxPage = Math.min(Math.ceil(book.total / ITEM_PER_PAGE), MAX_PAGE);
    if (page > availableMaxPage && book.total > 0) {
      const searchParams = new URLSearchParams(router.query as Record<string, string> || {});
      searchParams.set('page', availableMaxPage.toString());
      router.replace(`/search?${searchParams.toString()}`);
    }
  }, [currentPage, book.total]);
  useEffect(() => {
    if (categories.every((category) => String(category.category_id) !== currentCategoryId)) {
      const searchParams = new URLSearchParams(router.query as Record<string, string> || {});
      searchParams.set('category_id', '0');
      router.replace(`/search?${searchParams.toString()}`);
    }
  }, [categories, currentCategoryId]);
  return (
    <SearchResultSection>
      <Head>
        <title>
          {q}
          {' '}
          검색 결과 - 리디북스
        </title>
      </Head>
      {author.total > 0 && (
        <>
          <SearchTitle>
            {`‘${q}’ 저자 검색 결과`}
            <TotalAuthor>
              {author.total > MAXIMUM_AUTHOR ? `총 ${MAXIMUM_AUTHOR}명+` : `총 ${author.total}명`}
            </TotalAuthor>
          </SearchTitle>
          <MemoizedAuthors author={author} q={q || ''} />
        </>
      )}

      <>
        <SearchTitle>{`‘${q}’ 도서 검색 결과`}</SearchTitle>
        {categories.length > 0 && (
          <SearchCategoryTab
            categories={categories}
            currentCategoryId={parseInt(currentCategoryId, 10)}
          />
        )}
        <Filters>
          <FilterSelector />
          <AdultExcludeToggle adultExclude={isAdultExclude} />
        </Filters>
        {book.total > 0 ? (
          <SearchBookList>
            {book.books.map((item, index) => (
              <SearchBookItem key={item.b_id}>
                <SearchLandscapeBook item={item} title={item.title} index={index} clickHandler={searchBookClickHandler} q={q || ''} />
              </SearchBookItem>
            ))}
          </SearchBookList>
        ) : (
          <NoResult>
            <NoResultLens />
            <NoResultText>{`‘${q}’에 대한 도서 검색 결과가 없습니다.`}</NoResultText>
            <SuggestButton href="https://help.ridibooks.com/hc/ko/requests/new?ticket_form_id=664028" rel="noreferrer nooppener" target="_blank">도서 제안하기</SuggestButton>
          </NoResult>
        )}
        {hasPagination ? (
          <Pagination
            itemPerPage={ITEM_PER_PAGE}
            currentPage={Math.max(page, 1)} // 0 이하로 떨어지는 걸 방지
            totalItem={book.total}
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

const orderType = ['score', 'recent', 'review_cnt', 'price', 'similarity'];

SearchPage.getInitialProps = async (props: ConnectedInitializeProps) => {
  const { store, query, req } = props;
  const searchKeyword = String(query.q || '');
  const page = String(query.page || '1');
  const categoryId = String(query.category_id || '0');
  const searchUrl = new URL('/search', process.env.NEXT_STATIC_SEARCH_API);
  const order = String(query.order || 'score');
  const cookie = new Cookies(req?.headers.cookie);
  const adult_exclude = String(query.adult_exclude || cookie.get('adult_exclude') || 'n');
  const isAdultExclude = adult_exclude === 'y';

  searchUrl.searchParams.set('adult_exclude', isAdultExclude ? 'y' : 'n');
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
    const startPosition = Math.min(ITEM_PER_PAGE * (parseInt(page, 10) - 1), ITEM_PER_PAGE * (MAX_PAGE - 1));
    if (startPosition >= 0) {
      searchUrl.searchParams.set('start', startPosition.toString());
    }
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
    currentPage: /^\d+$/.test(page) ? page : '1',
    isAdultExclude,
  };
};

export default SearchPage;
