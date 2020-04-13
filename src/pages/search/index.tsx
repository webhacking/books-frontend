import * as React from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import styled from '@emotion/styled';
import axios from 'src/utils/axios';
import * as SearchTypes from 'src/types/searchResults';
import { AuthorInfo } from 'src/components/Search/InstantSearchResult';
import { slateGray40, slateGray60, slateGray90 } from '@ridi/colors';
import ArrowBoldH from 'src/svgs/ArrowBoldH.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import isPropValid from '@emotion/is-prop-valid';
import { SearchCategoryTab } from 'src/components/Tabs';
import { css } from '@emotion/core';
import { SearchResult } from 'src/types/searchResults';
import { useCallback, useEffect } from 'react';
import sentry from 'src/utils/sentry';
import { useEventTracker } from 'src/hooks/useEventTracker';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import { getEscapedNode } from 'src/utils/highlight';
import { computeSearchBookTitle } from 'src/utils/bookTitleGenerator';
import ScrollContainer from 'src/components/ScrollContainer';

interface SearchProps {
  q?: string;
  book: SearchTypes.BookResult;
  author: SearchTypes.AuthorResult;
  categories: SearchTypes.Aggregation[];
  currentCategory?: string;
}

const SearchResultSection = styled.section`
  max-width: 952px;
  margin: 0 auto;

  ${orBelow(
    999,
    `
    max-width: 100%;
  `,
  )};
`;

const SearchTitle = styled.h3`
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

const MemoizedAuthors = React.memo(Authors);

function SearchBooks(props: { books: SearchTypes.SearchBookDetail[] }) {
  const { books } = props;

  return (
    <>
      {books.map((book) => (
        <span key={book.b_id}>{book.title}</span>
      ))}
    </>
  );
}

function SearchPage(props: SearchProps) {
  const {
    author,
    book,
    categories,
    currentCategory,
    q,
  } = props;
  const [tracker] = useEventTracker();
  const { loggedUser } = useSelector((state: RootState) => state.account);

  const setPageView = useCallback(() => {
    if (tracker) {
      try {
        tracker.sendPageView(window.location.href, document.referrer);
      } catch (error) {
        sentry.captureException(error);
      }
    }
  }, [tracker]);
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
            <SearchCategoryTab categories={categories} currentCategory={currentCategory} />
          )}
          {/* FIXME 임시 마진 영역 */}
          <div
            css={css`
            margin-top: 12px;
          `}
          >
            some filters
          </div>
          {/* Todo 스타일링 및 메타정보 표시 */}
          {props.book.books.map((item) => (
            <span key={item.b_id}>
              {getEscapedNode(computeSearchBookTitle(item))}
            </span>
          ))}
        </>
      )}
    </SearchResultSection>
  );
}

SearchPage.getInitialProps = async (props: ConnectedInitializeProps) => {
  const {
    req, isServer, res, store, query,
  } = props;
  const searchKeyword = query.q ?? '';
  const searchUrl = new URL('/search', process.env.NEXT_STATIC_SEARCH_API);
  searchUrl.searchParams.append('site', 'ridi-store');
  searchUrl.searchParams.append('where', 'author');
  searchUrl.searchParams.append('where', 'book');
  searchUrl.searchParams.append('what', 'base');
  searchUrl.searchParams.append('keyword', searchKeyword as string);
  if (query.category && query.category !== '전체') {
    searchUrl.searchParams.append('category', query.category.toString());
  }
  if (isServer) {
    const { data } = await axios.get<SearchTypes.SearchResult>(searchUrl.toString());
    // const result = await pRetry(() => axios.get(process.env.NEXT_STATIC_SEARCH_API), {
    //   retries: 3,
    // });
    // console.log(result, q);
    return {
      q: props.query.q,
      book: data.book,
      author: data.author,
      categories: data.book.aggregations,
      currentCategory: props.query.category,
    };
  }
  const { data } = await axios.get<SearchTypes.SearchResult>(searchUrl.toString());
  return {
    q: props.query.q,
    book: data.book,
    author: data.author,
    categories: data.book.aggregations,
    currentCategory: props.query.category,
  };
};

export default SearchPage;
