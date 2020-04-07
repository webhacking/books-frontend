import * as React from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import styled from '@emotion/styled';
import axios from 'src/utils/axios';
import * as SearchTypes from 'src/types/searchResults';

interface SearchProps {
  q?: string;
  book?: SearchTypes.BookResult;
  author?: SearchTypes.AuthorResult;
  categories?: SearchTypes.Aggregation;
}

const SearchResultSection = styled.section`
  max-width: 952px;
  margin: 0 auto;
`;

function SearchPage(props: SearchProps) {
  return (
    <SearchResultSection>
      <Head>
        <title>
          {props.q}
          {' '}
          검색 결과 - 리디북스
        </title>
      </Head>
      <div>
        <h3>검색 결과</h3>
        {props.book?.books.map((book) => (
          <span key={book.b_id}>{book.title}</span>
        ))}
      </div>
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
    };
  }
  return { q: props.query.q };
};

export default SearchPage;
