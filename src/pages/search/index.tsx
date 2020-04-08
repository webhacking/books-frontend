import * as React from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import styled from '@emotion/styled';
import axios from 'src/utils/axios';
import * as SearchTypes from 'src/types/searchResults';
import { AuthorInfo } from 'src/components/Search/InstantSearchResult';
import { slateGray40, slateGray90 } from '@ridi/colors';

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

const SearchTitle = styled.h3`
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  color: ${slateGray90};
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const TotalAuthor = styled.span`
  font-size: 13px;
  font-weight: normal;
  margin-left: 5px;
  color: ${slateGray40};
`;

const AuthorItem = styled.li`
  padding: 12px 0;
  display: flex;
  align-items: center;
`;

const AuthorList = styled.ul`
  margin-bottom: 16px;
`;

function Authors(props: { author: SearchTypes.AuthorResult }) {
  const [isCollapsed, setCollapse] = React.useState(props.author.total > 30);

  return (
    <AuthorList>
      {props.author.authors.map((author) => (
        <AuthorItem key={author.id}>
          <AuthorInfo author={author} />
        </AuthorItem>
      ))}
      {/* Todo 더 보기 */}
      {isCollapsed && <span>더 보기</span>}
    </AuthorList>
  );
}

function SearchPage(props: SearchProps) {
  const {
    author, book, categories, q,
  } = props;
  return (
    <SearchResultSection>
      <Head>
        <title>
          {props.q}
          {' '}
          검색 결과 - 리디북스
        </title>
      </Head>
      {props.author.total > 0 && (
        <>
          <SearchTitle>
            {`‘${q}’ 저자 검색 결과`}
            <TotalAuthor>
              {author.total > 30 ? '총 30명+' : `총 ${author.total}명`}
            </TotalAuthor>
          </SearchTitle>
          <Authors author={author} />
        </>
      )}
      {props.book.total > 0 && (
        <>
          <SearchTitle>{`‘${q}’ 도서 검색 결과`}</SearchTitle>
          {props.book?.books.map((item) => (
            <span key={item.b_id}>{item.title}</span>
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
