import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { getEscapedNode } from 'src/utils/highlight';
import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import { gray100, slateGray50 } from '@ridi/colors';
import { ADULT_BADGE_URL } from 'src/constants/icons';
import * as SearchTypes from 'src/types/searchResults';

import { AuthorRole } from 'src/types/book';
import AuthorInfo from './Authors/AuthorInfo';
import { SearchResult } from './types';

const listItemCSS = css`
  ${orBelow(BreakPoint.LG, 'min-height: 40px;')};
  cursor: pointer;
`;

const BookListItem = styled.li`
  ${listItemCSS}
  ${orBelow(
    BreakPoint.LG,
    `
      :hover {
        background-color: rgba(0, 0, 0, 0.05) !important;
      }
      :focus {
        background-color: white !important;
      }
    `,
  )}
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    `
        :first-of-type {
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
        }
        :last-of-type {
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 3px;
        }

        :hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `,
  )}
  :hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  button {
    :focus {
      background-color: rgba(0, 0, 0, 0.05);
      outline: none !important;
    }
  }
  &, button {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  }
`;

const AuthorListItem = styled.li`
  ${listItemCSS};
  display: flex;
  ${orBelow(
    BreakPoint.LG,
    `
      :hover {
        background-color: rgba(0, 0, 0, 0.05) !important;
      }
      :focus {
        background-color: white !important;
      }
    `,
  )};
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    `
      :first-of-type {
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
      }
    `,
  )};
  :hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  button {
    :focus {
      background-color: rgba(0, 0, 0, 0.05);
      outline: none !important;
    }
  }
  &, button {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  }
`;

const searchResultItemButton = css`
  height: 100%;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  flex-wrap: wrap;
`;

const AuthorListItemButton = styled.button`
  ${searchResultItemButton}
`;

const BookListItemButton = styled.button`
  display: flex;
  align-items: center;
  ${searchResultItemButton}
`;
const BookTitle = styled.span`
  font-size: 14px;
  line-height: 1.4em;
  word-break: keep-all;
  margin-right: 6px;
  color: ${gray100};
  ${greaterThanOrEqualTo(BreakPoint.LG + 1, 'max-width: 298px;')};
`;

const authorPublisherCSS = css`
  line-height: 1.4em;
  color: ${slateGray50};
  -webkit-font-smoothing: antialiased;
  max-width: 298px;
`;

const Author = styled.span`
  ${authorPublisherCSS};
  font-size: 14px;
  margin-right: 5px;
`;

const AuthorPublisher = styled.span`
  ${authorPublisherCSS};
  font-size: 13px;
  padding-left: 5px;
  margin-right: 5px;
  ${greaterThanOrEqualTo(BreakPoint.LG + 1, 'max-width: 298px;')}
`;

const InstantSearchDivider = styled.hr`
  height: 1px;
  border: 0;
  border-top: 1px solid #e6e8e0;
  margin: 4px 16px;
  display: block;
`;

const Divider = styled.div`
  height: 12px;
  width: 1px;
  background: #e6e8e0;
`;

interface InstantSearchResultProps {
  result: SearchResult;
  handleClickAuthorItem: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleClickBookItem: (e: React.MouseEvent<HTMLButtonElement>) => void;
  focusedPosition: number;
}

// Todo 사용 컴포넌트마다 다른 options 사용해서 보여주기
const AuthorLabel: React.FC<{ author: string; authors: SearchTypes.AuthorsInfo[] }> = (props) => {
  const viewedAuthors = props.authors
    && props.authors
      .filter((author) => author.role !== AuthorRole.TRANSLATOR)
      .map((author) => author.name);
  if (!viewedAuthors || viewedAuthors.length === 0) {
    return <Author>{props.author}</Author>;
  }

  return (
    <Author>
      {viewedAuthors.length > 2
        ? `${viewedAuthors[0]} 외 ${viewedAuthors.length - 1}명`
        : `${viewedAuthors.join(', ')}`}
    </Author>
  );
};

const ResultWrapper = styled.div`
  padding: 4px 0 0;
`;

function InstantSearchResult(props: InstantSearchResultProps) {
  const {
    focusedPosition,
    handleClickAuthorItem,
    handleClickBookItem,
    result: { authors, books },
  } = props;
  const focusRef = React.useCallback((node: HTMLButtonElement | null) => {
    if (node != null) {
      node.focus();
    }
  }, []);
  const authorCount = authors.length;
  return (
    <ResultWrapper>
      {authors.length > 0 && (
        <>
          <ul>
            {authors.map((author, index) => (
              <AuthorListItem key={index}>
                <AuthorListItemButton
                  ref={index === focusedPosition - 1 ? focusRef : undefined}
                  type="button"
                  data-author-id={author.id}
                  onClick={handleClickAuthorItem}
                >
                  <AuthorInfo author={author} />
                </AuthorListItemButton>
              </AuthorListItem>
            ))}
          </ul>
          <InstantSearchDivider />
        </>
      )}
      {books.length > 0 && (
        <>
          <ul>
            {books.map((book: SearchTypes.SearchBookDetail, index) => (
              <BookListItem data-book-id={book.b_id} key={index}>
                <BookListItemButton
                  ref={index + authorCount === focusedPosition - 1 ? focusRef : undefined}
                  type="button"
                  data-book-id={book.b_id}
                  onClick={handleClickBookItem}
                >
                  <BookTitle>
                    {getEscapedNode(
                      book.highlight.web_title_title || book.web_title_title,
                    )}
                  </BookTitle>
                  <AuthorLabel author={book.author} authors={book.authors_info} />
                  <Divider />
                  <AuthorPublisher>{book.publisher}</AuthorPublisher>
                  {book.age_limit > 18 && (
                    <img width={19} src={ADULT_BADGE_URL} alt="성인 전용 도서" />
                  )}
                </BookListItemButton>
              </BookListItem>
            ))}
          </ul>
          <InstantSearchDivider />
        </>
      )}
    </ResultWrapper>
  );
}

export default React.memo(InstantSearchResult);
