import * as React from 'react';
import {
  InstantSearchAuthorResultScheme,
  InstantSearchBookResultScheme,
  InstantSearchResultScheme,
} from './InstantSearch';
import { css } from '@emotion/core';
import { View } from 'libreact/lib/View';
import { WindowWidthQuery } from 'libreact/lib/WindowWidthQuery';
import { RIDITheme } from 'src/styles';
import styled from '@emotion/styled';
import { useEffect } from 'react';

const listCSS = css`
  padding-bottom: 10px;
  @media (max-width: 999px) {
    padding: 0;
  }
`;

const listItemCSS = css`
  @media (max-width: 999px) {
    min-height: 40px;
    padding: 13px 10px;
  }
`;
const bookListItemCSS = (theme: RIDITheme) => css`
  ${listItemCSS};
  @media (max-width: 999px) {
    border-bottom: 1px solid ${theme.divider};
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
  @media (max-width: 999px) {
    :not(:last-of-type) {
      border-bottom: 1px solid ${theme.divider};
    }
  }
  :hover {
    background-color: ${theme.instantSearch.itemHover};
  }
  :focus {
    background-color: ${theme.instantSearch.itemHover};
  }
`;

const listTitleCSS = (theme: RIDITheme) => css`
  @media (max-width: 999px) {
    display: none;
  }
  padding-top: 20px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.3px;
  color: ${theme.label};
  margin-bottom: 10px;
`;

const ItemWrapper = styled.div`
  display: flex;
`;

interface InstantSearchResultProps {
  result: InstantSearchResultScheme;
  handleKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  handleClickAuthorItem: (e: React.MouseEvent<HTMLLIElement>) => void;
  handleClickBookItem: (e: React.MouseEvent<HTMLLIElement>) => void;
  focusedPosition: number;
}

interface InstantSearchResultBookListProps {
  result: InstantSearchResultScheme;
  handleKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  handleClickBookItem: (e: React.MouseEvent<HTMLLIElement>) => void;
}

const AuthorInfo: React.FC<{ author: InstantSearchAuthorResultScheme }> = props => {
  const { author } = props;
  return (
    <div>
      <span
        css={css`
          font-size: 14px;
          line-height: 1.57;
          letter-spacing: -0.43px;
          flex-shrink: 0;
          @media (max-width: 999px) {
            margin-right: 3px;
          }
          margin-right: 8px;
        `}
        dangerouslySetInnerHTML={{
          __html: author.highlight.name_raw! || author.name_raw!,
        }}
      />
      <span
        css={(theme: RIDITheme) => css`
          font-size: 13px;
          letter-spacing: -0.4px;
          word-break: keep-all;
          color: ${theme.label2};
        `}>
        {/* Todo 1권 만 있을 경우는 어떻게 할 것인가? */}
        {`<${author.popular_book_title}> 외 ${author.book_count - 1}권`}
      </span>
    </div>
  );
};

const ListWrapper = styled.div`
  padding: 0 20px;
  @media (max-width: 999px) {
    padding: 0;
  }
`;

const BookList: React.FC<InstantSearchResultBookListProps> = React.memo(props => {
  const { result, handleKeyDown, handleClickBookItem } = props;
  return (
    <ListWrapper>
      <p css={listTitleCSS}>도서</p>
      <ul css={listCSS}>
        {result.books.map((book: InstantSearchBookResultScheme, index) => (
          <li
            tabIndex={1}
            data-book-id={book.b_id}
            onKeyDown={handleKeyDown}
            onClick={handleClickBookItem}
            css={bookListItemCSS}
            key={index}>
            <WindowWidthQuery>
              <View maxWidth={1000}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: book.highlight.web_title_title_raw! || book.web_title_title_raw!,
                  }}
                />
              </View>
              <View>
                <div>
                  <ItemWrapper
                    css={css`
                      padding: 10px;
                    `}>
                    <img
                      css={(theme: RIDITheme) => css`
                        margin-right: 12px;
                        border: 1px solid ${theme.image.border};
                      `}
                      width="38px"
                      height="58px"
                      src={`https://misc.ridibooks.com/cover/${book.b_id}/small`}
                    />
                    <div
                      css={css`
                        display: flex;
                        flex-direction: column;
                      `}>
                      <p
                        css={css`
                          font-size: 14px;
                          line-height: 1.57;
                          letter-spacing: -0.43px;
                          word-break: keep-all;
                        `}
                        dangerouslySetInnerHTML={{
                          __html: book.highlight.web_title_title_raw! || book.web_title_title_raw!,
                        }}
                      />
                      {/*  Todo 저자, 출판사 출력 */}
                    </div>
                  </ItemWrapper>
                </div>
              </View>
            </WindowWidthQuery>
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
  const wrapperRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (wrapperRef.current && !!focusedPosition) {
      const items = wrapperRef.current.querySelectorAll('li');
      if (items.length > 0 && focusedPosition !== 0) {
        (items[focusedPosition - 1] as HTMLLIElement).focus();
      }
    }
  }, [focusedPosition, result]);
  return (
    <div ref={wrapperRef}>
      {result.authors.length > 0 && (
        <ListWrapper
          css={theme => css`
            border-bottom: 1px solid ${theme.divider3};
          `}>
          <p css={listTitleCSS}>저자/역자</p>
          <ul
            css={css`
              ${listCSS};
              @media (max-width: 999px) {
                padding: 0;
              }
            `}>
            {result.authors.map((author, index) => (
              <li
                data-author-id={author.id}
                tabIndex={1}
                onKeyDown={handleKeyDown}
                onClick={handleClickAuthorItem}
                css={authorListItemCSS}
                key={index}>
                <WindowWidthQuery>
                  <View maxWidth={1000}>
                    <AuthorInfo author={author} />
                  </View>
                  <View>
                    <div>
                      <ItemWrapper
                        css={css`
                          padding: 5px 0;
                        `}>
                        <AuthorInfo author={author} />
                      </ItemWrapper>
                    </div>
                  </View>
                </WindowWidthQuery>
              </li>
            ))}
          </ul>
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
