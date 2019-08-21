import React, { useEffect } from 'react';
import {
  AuthorInfo as AuthorInfoScheme,
  InstantSearchAuthorResultScheme,
  InstantSearchBookResultScheme,
  InstantSearchResultScheme,
} from './InstantSearch';
import { css } from '@emotion/core';
import { View } from 'libreact/lib/View';
import { WindowWidthQuery } from 'libreact/lib/WindowWidthQuery';
import { RIDITheme } from 'src/styles';
import styled from '@emotion/styled';
import { getEscapedString } from 'src/utils/highlight';

const listItemCSS = css`
  @media (max-width: 999px) {
    min-height: 40px;
  }
  cursor: pointer;
`;
const bookListItemCSS = (theme: RIDITheme) => css`
  ${listItemCSS};
  @media (max-width: 999px) {
    // border-bottom: 1px solid ${theme.divider};
    :hover {
      background-color: white !important;
    }
    :focus {
      background-color: white !important;
    }
  }
  @media (min-width: 1000px) {
    :first-of-type {
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
    :last-of-type {
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }
  :hover {
    background-color: ${theme.instantSearch.itemHover};
  }
  :focus {
    background-color: ${theme.instantSearch.itemHover};
  }
`;

const authorListItemCSS = (theme: RIDITheme) => css`
  ${listItemCSS};
  display: flex;
  @media (max-width: 999px) {
    :hover {
      background-color: white !important;
    }
    :focus {
      background-color: white !important;
    }
  }
  @media (min-width: 1000px) {
    :first-of-type {
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
  }
  :hover {
    background-color: ${theme.instantSearch.itemHover};
  }
  :focus {
    background-color: ${theme.instantSearch.itemHover};
  }
`;

const titleCSS = css`
  font-size: 15px;
  line-height: 1.33;
  letter-spacing: 0.43px;
  word-break: keep-all;
`;

const ItemWrapper = styled.div`
  display: flex;
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

const AuthorInfo: React.FC<{ author: InstantSearchAuthorResultScheme }> = props => {
  const { author } = props;

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        width: 100%;
      `}>
      <span
        css={css`
          font-size: 15px;
          line-height: 1.33;
          letter-spacing: 0.43px;
          flex-shrink: 0;
          @media (max-width: 999px) {
            margin-right: 3px;
          }
          margin-right: 8px;
        `}
        dangerouslySetInnerHTML={{
          __html: getEscapedString(author.highlight.name_raw || author.name_raw),
        }}
      />
      <span
        css={(theme: RIDITheme) => css`
          font-size: 14px;
          letter-spacing: -0.4px;
          word-break: keep-all;
          color: ${theme.label2};
        `}>
        {`<${author.popular_book_title}>${
          author.book_count > 1 ? ` 외 ${author.book_count - 1}권` : ''
        }`}
      </span>
    </div>
  );
};

const ListWrapper = styled.div`
  @media (max-width: 999px) {
    padding: 0;
  }
`;

const authorPublisherCSS = css`
  font-size: 14px;
  line-height: 1.36;
  letter-spacing: -0.4px;
  color: #808991;
  -webkit-font-smoothing: antialiased;
`;

// Todo 사용 컴포넌트마다 다른 options 사용해서 보여주기
const AuthorLabel: React.FC<{ author: string; authors: AuthorInfoScheme[] }> = props => {
  const viewedAuthors =
    props.authors &&
    props.authors
      .filter(author => author.role === 'author' || author.role === 'illustrator')
      .map(author => author.name);
  if (!viewedAuthors || viewedAuthors.length === 0) {
    return (
      <span
        css={css`
          ${authorPublisherCSS};
          margin-right: 4px;
        `}>
        {props.author}
      </span>
    );
  }

  return (
    <span
      css={css`
        ${authorPublisherCSS};
        margin-right: 4px;
      `}>
      {viewedAuthors.length > 2
        ? `${viewedAuthors[0]} 외 ${viewedAuthors.length - 1}명`
        : `${viewedAuthors.join(', ')}`}
    </span>
  );
};

const BookList: React.FC<InstantSearchResultBookListProps> = React.memo(props => {
  const { result, handleKeyDown, handleClickBookItem } = props;

  return (
    <ListWrapper>
      <ul>
        {result.books.map((book: InstantSearchBookResultScheme, index) => (
          <li data-book-id={book.b_id} css={bookListItemCSS} key={index}>
            <button
              css={css`
                height: 100%;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                //align-items: center;
                text-align: left;
                padding: 14px 16px;
              `}
              data-book-id={book.b_id}
              onKeyDown={handleKeyDown}
              onClick={handleClickBookItem}>
              <WindowWidthQuery>
                <View maxWidth={1000}>
                  <span
                    css={css`
                      ${titleCSS};
                      margin-right: 4px;
                      margin-bottom: 3px;
                    `}
                    dangerouslySetInnerHTML={{
                      __html: getEscapedString(
                        book.highlight.web_title_title_raw || book.web_title_title_raw,
                      ),
                    }}
                  />
                  <AuthorLabel author={book.author} authors={book.authors_info} />
                  <span
                    css={css`
                      ${authorPublisherCSS};
                      padding-left: 4px;
                      border-left: 1px solid #e6e8eb;
                    `}>
                    {book.publisher}
                  </span>
                </View>
                <View>
                  <div>
                    <ItemWrapper>
                      <img
                        alt={book.web_title_title}
                        css={(theme: RIDITheme) => css`
                          margin-right: 12px;
                          border: 1px solid ${theme.image.border};
                          flex-shrink: 0;
                          width: 38px;
                        `}
                        width="38px"
                        height="58px"
                        src={`https://misc.ridibooks.com/cover/${book.b_id}/small`}
                      />
                      <div
                        css={css`
                          display: flex;
                          flex-direction: column;
                          align-items: start;
                          text-align: left;
                          justify-content: center;
                        `}>
                        <p
                          css={css`
                            ${titleCSS};
                            margin-bottom: 4px;
                          `}
                          dangerouslySetInnerHTML={{
                            __html: getEscapedString(
                              book.highlight.web_title_title_raw ||
                                book.web_title_title_raw,
                            ),
                          }}
                        />
                        <div>
                          <AuthorLabel author={book.author} authors={book.authors_info} />
                          <span
                            css={css`
                              ${authorPublisherCSS};
                              padding-left: 4px;
                              border-left: 1px solid #e6e8eb;
                            `}>
                            {book.publisher}
                          </span>
                        </div>
                      </div>
                    </ItemWrapper>
                  </div>
                </View>
              </WindowWidthQuery>
            </button>
          </li>
        ))}
      </ul>
    </ListWrapper>
  );
});

const InstantSearchResult: React.FC<InstantSearchResultProps> = React.memo(props => {
  const {
    focusedPosition,
    handleClickAuthorItem,
    handleClickBookItem,
    result,
    handleKeyDown,
  } = props;
  const wrapperRef = React.useRef<HTMLDivElement>();
  useEffect(() => {
    if (wrapperRef.current && !!focusedPosition) {
      const items = wrapperRef.current.querySelectorAll('li button');
      if (items.length > 0 && focusedPosition !== 0) {
        (items[focusedPosition - 1] as HTMLLIElement).focus();
      }
    }
  }, [focusedPosition, result]);

  return (
    <div ref={wrapperRef}>
      {result.authors.length > 0 && (
        <ListWrapper>
          <ul
            css={css`
              @media (max-width: 999px) {
                padding: 0;
              }
            `}>
            {result.authors.map((author, index) => (
              <li css={authorListItemCSS} key={index}>
                <button
                  css={css`
                    width: 100%;
                    height: 100%;
                    padding: 13px 16px;
                    text-align: left;
                    flex-wrap: wrap;
                  `}
                  data-author-id={author.id}
                  onKeyDown={handleKeyDown}
                  onClick={handleClickAuthorItem}>
                  <WindowWidthQuery>
                    <View maxWidth={1000}>
                      <AuthorInfo author={author} />
                    </View>
                    <View>
                      <div>
                        <ItemWrapper>
                          <AuthorInfo author={author} />
                        </ItemWrapper>
                      </div>
                    </View>
                  </WindowWidthQuery>
                </button>
              </li>
            ))}
          </ul>
          <hr
            css={css`
              height: 1px;
              border: 0;
              border-top: 1px solid #e6e8e0;
              margin: 8px 16px;
            `}
          />
        </ListWrapper>
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
