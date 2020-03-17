import React, { useEffect } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import * as colors from '@ridi/colors';

import { lineClamp, RIDITheme } from 'src/styles';
import { getEscapedString } from 'src/utils/highlight';
import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import useIsTablet from 'src/hooks/useIsTablet';

import {
  AuthorInfo as AuthorInfoScheme,
  InstantSearchAuthorResultScheme,
  InstantSearchBookResultScheme,
  InstantSearchResultScheme,
} from './InstantSearch';

const listItemCSS = css`
  ${orBelow(
    BreakPoint.LG,
    css`
      min-height: 40px;
    `,
  )};
  cursor: pointer;
`;

const BookListItem = styled.li`
  ${listItemCSS};
  ${orBelow(
    BreakPoint.LG,
    css`
      :hover {
        background-color: white !important;
      }
      :focus {
        background-color: white !important;
      }
    `,
  )};
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
        :first-of-type {
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
        }
        :last-of-type {
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 3px;
        }

        :hover {
          background-color: ${colors.lightSteelBlue5};
        }
      `,
  )}
    :hover {
    background-color: ${colors.lightSteelBlue5};
  }
  button {
    :focus {
      background-color: ${colors.lightSteelBlue5};
      outline: none !important;
    }
  }
`;

const AuthorListItem = styled.li`
  ${listItemCSS};
  display: flex;
  ${orBelow(
    BreakPoint.LG,
    css`
      :hover {
        background-color: white !important;
      }
      :focus {
        background-color: white !important;
      }
    `,
  )};
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      :first-of-type {
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
      }
    `,
  )};
  :hover {
    background-color: ${colors.lightSteelBlue5};
  }
  button {
    :focus {
      background-color: ${colors.lightSteelBlue5};
      outline: none !important;
    }
  }
`;

const AuthorListItemButton = styled.button`
  width: 100%;
  height: 100%;
  padding: 13px 16px;
  text-align: left;
  flex-wrap: wrap;
`;

const BookListItemButton = styled.button`
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  text-align: left;
  padding: 14px 16px;
`;

const BookThumbnail = styled.img`
  margin-right: 12px;
  border: 1px solid ${colors.slateGray30};
  flex-shrink: 0;
  width: 38px;
`;

const BookMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: left;
  justify-content: center;
`;

const BookTitle = styled.span`
  font-size: 15px;
  line-height: 1.33;
  word-break: keep-all;
  margin-right: 4px;
  margin-bottom: 3px;
  color: #252525;
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      max-width: 298px;
      color: #303538;
      margin-bottom: 4px;
    `,
  )};
`;

const BookAuthors = styled.div`
  word-break: keep-all;
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      max-width: 298px;
    `,
  )}
`;

const authorPublisherCSS = css`
  font-size: 14px;
  line-height: 1.36;
  color: #808991;
  -webkit-font-smoothing: antialiased;
  max-width: 298px;
`;

const AuthorInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const AuthorName = styled.span`
  font-size: 15px;
  line-height: 1.33;
  flex-shrink: 0;
  margin-right: 8px;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-right: 3px;
    `,
  )};
  color: #303538;
`;

const AuthorBooksInfo = styled.span`
  font-size: 14px;
  word-break: keep-all;
  color: ${colors.slateGray50};
  ${lineClamp(1)};
`;

const Author = styled.span`
  ${authorPublisherCSS};
  margin-right: 4px;
`;

const AuthorPublisher = styled.span`
  ${authorPublisherCSS};
  padding-left: 4px;
  border-left: 1px solid #e6e8eb;
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    css`
      max-width: 298px;
    `,
  )}
`;

const ItemWrapper = styled.div`
  display: flex;
`;

const InstantSearchDivider = styled.hr`
  height: 1px;
  border: 0;
  border-top: 1px solid #e6e8e0;
  margin: 8px 16px;
  display: block;
`;

interface InstantSearchResultProps {
  result: InstantSearchResultScheme;
  handleKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  handleClickAuthorItem: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleClickBookItem: (e: React.MouseEvent<HTMLButtonElement>) => void;
  focusedPosition: number;
}

interface InstantSearchResultBookListProps {
  result: InstantSearchResultScheme;
  handleKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  handleClickBookItem: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AuthorInfo: React.FC<{ author: InstantSearchAuthorResultScheme }> = (props) => {
  const { author } = props;

  return (
    <AuthorInfoWrapper>
      <AuthorName
        dangerouslySetInnerHTML={{
          __html: getEscapedString(author.highlight.name_raw || author.name_raw),
        }}
      />
      <AuthorBooksInfo>
        {`<${author.popular_book_title}>`}
        {author.book_count > 1 ? ` 외 ${author.book_count - 1}권` : ''}
      </AuthorBooksInfo>
    </AuthorInfoWrapper>
  );
};

// Todo 사용 컴포넌트마다 다른 options 사용해서 보여주기
const AuthorLabel: React.FC<{ author: string; authors: AuthorInfoScheme[] }> = (props) => {
  const viewedAuthors = props.authors
    && props.authors
      .filter((author) => author.role === 'author' || author.role === 'illustrator')
      .map((author) => author.name);
  if (!viewedAuthors || viewedAuthors.length === 0) {
    return (
      <Author>
        {props.author}
      </Author>
    );
  }

  return (
    <Author>
      {viewedAuthors.length > 2
        ? `${viewedAuthors[0]} 외 ${viewedAuthors.length - 1}명`
        : `${viewedAuthors.join(', ')}`}
    </Author>
  );
};

const BookList: React.FC<InstantSearchResultBookListProps> = React.memo((props) => {
  const { result, handleKeyDown, handleClickBookItem } = props;
  const isTablet = useIsTablet();

  return (
    <ul>
      {result.books.map((book: InstantSearchBookResultScheme, index) => (
        <BookListItem data-book-id={book.b_id} key={index}>
          <BookListItemButton
            type="button"
            data-book-id={book.b_id}
            onKeyDown={handleKeyDown}
            onClick={handleClickBookItem}
          >
            {isTablet ? (
              <>
                <BookTitle
                  dangerouslySetInnerHTML={{
                    __html: getEscapedString(
                      book.highlight.web_title_title_raw || book.web_title_title_raw,
                    ),
                  }}
                />
                <AuthorLabel author={book.author} authors={book.authors_info} />
                <AuthorPublisher>{book.publisher}</AuthorPublisher>
              </>
            ) : (
              <ItemWrapper>
                <BookThumbnail
                  alt={book.web_title_title}
                  width="38px"
                  height="58px"
                  src={`https://img.ridicdn.net/cover/${book.b_id}/small`}
                />
                <BookMeta>
                  <BookTitle
                    dangerouslySetInnerHTML={{
                      __html: getEscapedString(
                        book.highlight.web_title_title_raw || book.web_title_title_raw,
                      ),
                    }}
                  />
                  <BookAuthors>
                    <AuthorLabel author={book.author} authors={book.authors_info} />
                    <AuthorPublisher>{book.publisher}</AuthorPublisher>
                  </BookAuthors>
                </BookMeta>
              </ItemWrapper>
            )}
          </BookListItemButton>
        </BookListItem>
      ))}
    </ul>
  );
});

const InstantSearchResult: React.FC<InstantSearchResultProps> = React.memo((props) => {
  const {
    focusedPosition,
    handleClickAuthorItem,
    handleClickBookItem,
    result,
    handleKeyDown,
  } = props;
  const wrapperRef = React.useRef<HTMLDivElement>();
  const isTablet = useIsTablet();
  useEffect(() => {
    if (wrapperRef.current && !!focusedPosition) {
      const items = wrapperRef.current.querySelectorAll('li button');
      if (items.length > 0 && focusedPosition !== 0) {
        const item = items[focusedPosition - 1] as HTMLLIElement;
        if (item) {
          item.focus();
        }
      }
    }
  }, [focusedPosition, result]);

  return (
    <div ref={wrapperRef}>
      {result.authors.length > 0 && (
        <>
          <ul>
            {result.authors.map((author, index) => (
              <AuthorListItem key={index}>
                <AuthorListItemButton
                  type="button"
                  data-author-id={author.id}
                  onKeyDown={handleKeyDown}
                  onClick={handleClickAuthorItem}
                >
                  {isTablet ? (
                    <AuthorInfo author={author} />
                  ) : (
                    <ItemWrapper>
                      <AuthorInfo author={author} />
                    </ItemWrapper>
                  )}
                </AuthorListItemButton>
              </AuthorListItem>
            ))}
          </ul>
          <InstantSearchDivider />
        </>
      )}
      {result.books.length > 0 && (
        <BookList
          handleClickBookItem={handleClickBookItem}
          handleKeyDown={handleKeyDown}
          result={result}
        />
      )}
    </div>
  );
});

export default InstantSearchResult;
