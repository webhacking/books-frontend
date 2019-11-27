import React, { useState, useEffect, useCallback } from 'react';
import { css, keyframes } from '@emotion/core';
import ArrowLeft from 'src/svgs/Arrow_Left_13.svg';
import Lens from 'src/svgs/Lens.svg';
import Clear from 'src/svgs/Clear.svg';
import { RIDITheme, ZIndexLayer } from 'src/styles';
import { useDebouncedCallback } from 'use-debounce';
// import { Router } from 'server/routes';
import localStorageKeys from 'src/constants/localStorage';
import * as labels from 'src/labels/instantSearch.json';
import { isOnsetNucleusCoda } from 'src/utils/hangle';
import { safeJSONParse } from 'src/utils/common';
import axios from 'axios';
import InstantSearchResult from 'src/components/Search/InstantSearchResult';
import InstantSearchHistory from 'src/components/Search/InstantSearchHistory';
import getConfig from 'next/config';
import { get } from 'ts-get';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import pRetry from 'p-retry';
import sentry from 'src/utils/sentry';

const { captureException } = sentry();

const { publicRuntimeConfig } = getConfig();

const fadeIn = keyframes`
  0% { 
    opacity: 0; 
  }
  100% { 
    opacity: 1; 
  }
  
`;

const placeHolderCSS = css`
  opacity: 1;
  font-size: 16px;
  height: 19px;
  line-height: 19px;
  font-weight: 500;
`;

const searchWrapper = (theme: RIDITheme) => css`
  font-size: 16px;
  background-color: #ffffff;
  box-sizing: border-box;
  min-width: 340px;
  border-radius: 3px;
  height: 32px;
  line-height: 32px;
  ${orBelow(
    BreakPoint.LG,
    css`
      height: 36px;
      line-height: 36px;
      min-width: unset;
      width: 100%;
    `,
  )};
  form {
    width: 100%;
  }

  input {
    flex-shrink: 0;
    position: relative;
    top: -0.5px;
    padding-right: 3.75px; // 4 * 0.9375
    width: 98%;
    font-size: 16px;
    transform: scale(0.9375);
    transform-origin: top left;
    font-weight: 500;
    color: #000000;
    ::placeholder {
      ${placeHolderCSS};
      color: ${theme.input.placeholder};
    }
    ::-moz-placeholder {
      ${placeHolderCSS};
      color: ${theme.input.placeholder};
    }
    :-moz-placeholder {
      ${placeHolderCSS};
      color: ${theme.input.placeholder};
    }
  }
  display: flex;
  align-items: center;
`;

const iconStyle = (theme: RIDITheme) => css`
  fill: ${theme.input.placeholder};
  box-sizing: content-box;
  flex-shrink: 0;
  padding: 5.5px 2.5px 5px 7.5px;
  width: 24px;
  height: 24px;
`;

const focused = (theme: RIDITheme) => css`
  order: 2;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-top: 0;
      position: absolute;
      top: 0;
      left: 0;
      z-index: ${ZIndexLayer.LEVEL_9};
      background: ${theme.primaryColor};
      width: 100%;
      padding: 6px;
      box-sizing: border-box;
      animation: ${fadeIn} 0.2s ease-in-out;
      display: flex;
      align-items: center;
      order: 3;
    `,
  )};
`;

const initial = () => css`
  position: relative;
  margin-top: unset;
  outline: unset;
  order: 2;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-top: 10px;
      order: 3;
    `,
  )};
`;

const searchFooter = css`
  box-sizing: border-box;
  position: absolute;
  background-color: white;
  width: 380px;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  z-index: ${ZIndexLayer.LEVEL_9};
  margin-top: 2px;
  ${orBelow(
    BreakPoint.LG,
    css`
      width: 100vw;
      left: 6px;
      box-shadow: unset;
      margin-left: -6px;
      top: 48px;
      margin-top: unset;
      border-radius: 0;
    `,
  )};
  // ie11
  @media (max-width: 999px) and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    top: 46px;
  }
`;

const dimmer = css`
  display: none;
  ${orBelow(
    BreakPoint.LG,
    css`
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: ${ZIndexLayer.LEVEL_8};
      background: rgba(0, 0, 0, 0.5);
    `,
  )};
`;

const arrow = css`
  display: none;
  cursor: pointer;
  fill: white;
  width: 16px;
  height: 16px;
  ${orBelow(
    BreakPoint.LG,
    css`
      display: block;
    `,
  )};
`;

const arrowWrapperButton = css`
  display: none;
  ${orBelow(
    BreakPoint.LG,
    css`
      display: block;
      padding: 0 11px 0 5px;
    `,
  )};
`;

export interface AuthorInfo {
  author_id: number;
  b_id: string;
  name: string;
  order: number;
  role: 'author' | 'translator' | 'illustrator';
}

export interface InstantSearchBookResultScheme {
  b_id: string;
  highlight: {
    web_title_title?: string;
    web_title_title_raw?: string;
    author_title_title?: string;
    author_title_title_raw?: string;
  };
  web_title_title?: string;
  web_title_title_raw?: string;
  author_title_title?: string;
  author_title_title_raw?: string;
  author: string;
  author2: string;
  authors_info: AuthorInfo[];
  publisher: string;
}

export interface InstantSearchAuthorResultScheme {
  popular_book_title: string;
  book_count: number;
  name: string;
  id: number;
  name_raw: string;
  popular_book_title_raw: string;
  highlight: {
    name: string;
    name_raw: string;
  };
}

export interface InstantSearchResultScheme {
  books: InstantSearchBookResultScheme[];
  authors: InstantSearchAuthorResultScheme[];
}

interface InstantSearchProps {
  searchKeyword: string;
  isPartials?: boolean;
}

const initialSearchResult = {
  books: [],
  authors: [],
};
export const InstantSearch: React.FC<InstantSearchProps> = React.memo(
  (props: InstantSearchProps) => {
    const inputRef = React.useRef<HTMLInputElement>();
    const listWrapperRef = React.useRef<HTMLDivElement>();
    const [isLoaded, setLoaded] = useState(false);
    const [isFocused, setFocus] = useState(false);
    const [keyword, setKeyword] = useState<string>(props.searchKeyword);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [enableSearchHistoryRecord, toggleSearchHistoryRecord] = useState(true);
    const [focusedPosition, setFocusedPosition] = useState(0);
    const [, setFetching] = useState(false);

    const [searchResult, setSearchResult] = useState<InstantSearchResultScheme>(
      initialSearchResult,
    );
    const { isPartials } = props;

    const handleSearch = useCallback(async (value: string) => {
      setFetching(true);
      try {
        const url = new URL('/search', publicRuntimeConfig.SEARCH_API);
        url.searchParams.append('site', 'ridi-store');
        url.searchParams.append('where', 'book');
        url.searchParams.append('where', 'author');
        url.searchParams.append('what', 'instant');
        url.searchParams.append('keyword', value);

        const result = await pRetry(() => axios.get(url.toString()), { retries: 2 });
        setSearchResult({
          books: get(result.data, data => data.book.books, []),
          authors: get(result.data, data => data.author.authors, []),
        });
      } catch (error) {
        setSearchResult(initialSearchResult);
        setFocusedPosition(0);
        captureException(error);
      } finally {
        setFetching(false);
      }
    }, []);
    const [debouncedHandleSearch] = useDebouncedCallback(handleSearch, 300);

    const handleOnChange = useCallback(
      (target: React.ChangeEvent<HTMLInputElement>['target']) => {
        const { value } = target;
        setKeyword(value);
        // 초-중-종성 체크
        if (value.length > 0) {
          if (value.length === 1 && isOnsetNucleusCoda(value[0])) {
            setSearchResult(initialSearchResult);
          } else {
            debouncedHandleSearch(value);
          }
        }
        setFocusedPosition(0);
      },
      [debouncedHandleSearch],
    );
    const [debouncedOnChange] = useDebouncedCallback(handleOnChange, 100, {});
    const passEventTarget = e => {
      debouncedOnChange(e.target);
    };

    const handleSearchWrapperBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
      const relatedTarget = e.relatedTarget || document.activeElement; // IE11
      if (!relatedTarget || !e.currentTarget.contains(relatedTarget as Element)) {
        setFocus(false);
        setFocusedPosition(0);
      }
    }, []);

    const handleToggleSearchHistoryRecord = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        localStorage.setItem(
          localStorageKeys.instantSearchHistoryOption,
          JSON.stringify(!enableSearchHistoryRecord),
        );
        toggleSearchHistoryRecord(!enableSearchHistoryRecord);
        setFocusedPosition(0);
      },
      [enableSearchHistoryRecord, toggleSearchHistoryRecord],
    );

    const handleRemoveHistory = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const label = e.currentTarget.getAttribute('data-value');
        if (label) {
          const historySet = new Set<string>([...searchHistory]);
          historySet.delete(label);
          const newHistory: string[] = Array<string>(...historySet);
          setSearchHistory(newHistory);
          // setFocusedPosition(0);
          localStorage.setItem(
            localStorageKeys.instantSearchHistory,
            JSON.stringify(newHistory.slice(0, 10)),
          );
        }
      },
      [searchHistory],
    );

    const handleClearInput = useCallback(
      e => {
        e.preventDefault();
        inputRef.current.value = '';
        setKeyword('');
        inputRef.current.focus();
      },
      [inputRef],
    );

    const handleClearHistory = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (enableSearchHistoryRecord) {
          localStorage.setItem(localStorageKeys.instantSearchHistory, JSON.stringify([]));
          setSearchHistory([]);
          setFocusedPosition(0);
        }
      },
      [enableSearchHistoryRecord],
    );

    const handleClickHistoryItem = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const label = e.currentTarget.getAttribute('data-value');
        if (label) {
          setKeyword(label);
          setFocus(false);
          setSearchResult(initialSearchResult);

          const url = new URL('/search/', publicRuntimeConfig.STORE_HOST);
          url.searchParams.append('q', label);

          window.location.href = url.toString();
          // if (isPartials) {
          //   window.location.href = `${window.location.origin}/search/?q=${label}`;
          // } else {
          //   Router.pushRoute(`/search/?q=${label}`);
          // }
        }
      },
      [isPartials],
    );

    const handleClickBookItem = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { bookId } = e.currentTarget.dataset;

        const url = new URL(`/books/${bookId}`, publicRuntimeConfig.STORE_HOST);
        url.searchParams.append('_s', 'instant');
        url.searchParams.append('_q', keyword);

        window.location.href = url.toString();
        // if (isPartials) {
        //   window.location.href = `${window.location.origin}/books/${bookId}?_s=instant&_q=${keyword}`;
        // } else {
        //   Router.pushRoute(`/books/${bookId}?_s=instant&_q=${keyword}`);
        // }
        setFocus(false);
      },
      [keyword, isPartials],
    );
    const handleClickAuthorItem = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { authorId } = e.currentTarget.dataset;
        const url = new URL(`/author/${authorId}`, publicRuntimeConfig.STORE_HOST);
        url.searchParams.append('_s', 'instant');
        url.searchParams.append('_q', keyword);

        window.location.href = url.toString();
        // if (isPartials) {
        //   window.location.href = `${window.location.origin}/author/${authorId}?_s=instant&_q=${keyword}`;
        // } else {
        //   Router.pushRoute(`/author/${authorId}?_s=instant&_q=${keyword}`);
        // }
        setFocus(false);
      },
      [keyword, isPartials],
    );

    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (keyword.length > 0) {
          if (enableSearchHistoryRecord) {
            const newHistory = Array<string>(
              ...new Set<string>([keyword, ...searchHistory]),
            ).slice(0, 10);
            setSearchHistory(newHistory);
            localStorage.setItem(
              localStorageKeys.instantSearchHistory,
              JSON.stringify(newHistory),
            );
          }
          // Move search result page
          // Todo conditional check for partial component

          const url = new URL('/search/', publicRuntimeConfig.STORE_HOST);
          url.searchParams.append('q', keyword);
          //
          // if (isPartials) {
          //   window.location.href = `${window.location.origin}/search/?q=${keyword}`;
          // } else {
          //   Router.pushRoute(`/search/?q=${keyword}`);
          // }

          setFocus(false);
          if (inputRef.current) {
            inputRef.current.blur();
          }
        }
      },
      [keyword, enableSearchHistoryRecord, isPartials, searchHistory],
    );

    const handleSetCurrentPosition = useCallback((pos: number) => {
      setFocusedPosition(pos);
      if (pos === 0 && inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent | KeyboardEvent) => {
        if (!inputRef.current) {
          return;
        }
        if (e.which === 13 && e.target) {
          (e.target as HTMLLIElement).click();
        }
        if (e.which === 40 || e.which === 38) {
          e.preventDefault();

          const history = safeJSONParse(
            window.localStorage.getItem(localStorageKeys.instantSearchHistory),
            [],
          ).slice(0, 5);
          const total =
            inputRef.current.value.length < 1
              ? history.length
              : searchResult.authors.length + searchResult.books.length;
          if (e.which === 40) {
            // keyDown
            const nextPos = focusedPosition + 1;
            const pos = nextPos > total ? 0 : nextPos;
            handleSetCurrentPosition(pos);
          } else {
            const prevPos = focusedPosition - 1;
            const pos = prevPos < 0 ? total : prevPos;
            handleSetCurrentPosition(pos);
          }
        }
      },
      [
        handleSetCurrentPosition,
        focusedPosition,
        searchResult.authors.length,
        searchResult.books.length,
      ],
    );
    useEffect(() => {
      toggleSearchHistoryRecord(
        safeJSONParse(
          window.localStorage.getItem(localStorageKeys.instantSearchHistoryOption),
          true,
        ),
      );
      const history = safeJSONParse(
        window.localStorage.getItem(localStorageKeys.instantSearchHistory),
        [],
      );

      setSearchHistory(Array<string>(...new Set<string>(history)));

      if (inputRef.current) {
        setLoaded(true);
      }

      return () => {
        // Unmount
      };
    }, []);

    const showFooter = React.useMemo(
      () =>
        // eslint-disable-next-line
        ((keyword.length < 1 && searchHistory.length > 0) ||
          searchResult.books.length > 0 ||
          searchResult.authors.length > 0) &&
        isFocused,
      [
        isFocused,
        keyword.length,
        searchHistory.length,
        searchResult.authors.length,
        searchResult.books.length,
      ],
    );

    return (
      <>
        <div
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          onBlur={handleSearchWrapperBlur}
          css={isFocused ? focused : initial}>
          {isFocused && (
            <button css={arrowWrapperButton} onClick={setFocus.bind(null, false)}>
              <ArrowLeft css={arrow} />
              <span className={'a11y'}>{labels.goBack}</span>
            </button>
          )}
          <div css={searchWrapper}>
            <Lens
              css={theme => css`
                ${iconStyle(theme)};
                opacity: ${isFocused ? 1 : 0.6};
              `}
            />
            <form onSubmit={handleSubmit} autoComplete={'off'}>
              <input
                autoComplete={'off'}
                autoCapitalize={'off'}
                autoCorrect={'off'}
                disabled={!isLoaded}
                aria-label={labels.searchPlaceHolder}
                defaultValue={keyword}
                ref={inputRef}
                type={'text'}
                name="instant_search"
                placeholder={labels.searchPlaceHolder}
                onFocus={setFocus.bind(null, true)}
                onClick={setFocus.bind(null, true)}
                onKeyDown={handleKeyDown}
                onChange={passEventTarget}
              />
            </form>
            {keyword.length > 0 && isFocused && (
              <button
                css={css`
                  outline: none;
                  position: relative;
                  right: 10px;
                  display: flex;
                  align-items: center;
                `}
                onClick={handleClearInput}>
                <Clear
                  css={css`
                    width: 14px;
                    height: 14px;
                  `}
                />
                <span className={'a11y'}>모두 지우기</span>
              </button>
            )}
          </div>
          {showFooter && (
            <div ref={listWrapperRef} css={searchFooter}>
              <form>
                {keyword.length < 1 && searchHistory.length > 0 ? (
                  <InstantSearchHistory
                    searchHistory={searchHistory}
                    enableSearchHistoryRecord={enableSearchHistoryRecord}
                    handleClickHistoryItem={handleClickHistoryItem}
                    handleClearHistory={handleClearHistory}
                    handleRemoveHistory={handleRemoveHistory}
                    handleToggleSearchHistoryRecord={handleToggleSearchHistoryRecord}
                    handleKeyDown={handleKeyDown}
                    focusedPosition={focusedPosition}
                  />
                ) : (
                  <InstantSearchResult
                    handleKeyDown={handleKeyDown}
                    handleClickBookItem={handleClickBookItem}
                    handleClickAuthorItem={handleClickAuthorItem}
                    focusedPosition={focusedPosition}
                    result={searchResult}
                  />
                )}
              </form>
            </div>
          )}
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        {isFocused && <div onClick={setFocus.bind(null, false)} css={dimmer} />}
      </>
    );
  },
);

export default InstantSearch;
