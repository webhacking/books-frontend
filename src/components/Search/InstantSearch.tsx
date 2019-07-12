import * as React from 'react';
import { notifySentry } from 'src/utils/sentry';
import { css, keyframes } from '@emotion/core';
import ArrowLeft from 'src/svgs/Arrow_Left_13.svg';
import Lens from 'src/svgs/Lens.svg';
import Clear from 'src/svgs/Clear.svg';
import { RIDITheme, ZIndexLayer } from 'src/styles';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Router } from 'server/routes';
import localStorageKeys from 'src/constants/localStorage';
import * as labels from 'src/labels/instantSearch.json';
import { isOnsetNucleusCoda } from 'src/utils/hangle';
import { safeJSONParse } from 'src/utils/common';
import axios from 'axios';
import InstantSearchResult from 'src/components/Search/InstantSearchResult';
import InstantSearchHistory from 'src/components/Search/InstantSearchHistory';
import getConfig from 'next/config';
import { get } from 'ts-get';
import { PublicRuntimeConfig } from 'src/types/common';
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
  font-size: 15px;
  height: 19px;
  line-height: 19px;
  font-weight: 500;
  letter-spacing: -0.46px;
`;

const searchWrapper = (theme: RIDITheme) => css`
  background-color: #ffffff;
  box-sizing: border-box;
  min-width: 340px;
  border-radius: 3px;
  height: 32px;
  line-height: 32px;
  @media (max-width: 999px) {
    height: 36px;
    line-height: 36px;
    min-width: unset;
    width: 100%;
  }
  form {
    width: 100%;
    @media (max-width: 999px) {
    }
  }

  input {
    flex-shrink: 0;
    position: relative;
    top: -0.5px;
    //margin-top: -2px;
    padding-right: 4px;
    width: 98%;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.46px;
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
  padding: 5.5px 3px 5px 6px;
  width: 24px;
  height: 24px;
  @media (max-width: 999px) {
  }
`;

const focused = (theme: RIDITheme) => css`
  order: 2;
  @media (max-width: 999px) {
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
  }
`;

const initial = () => css`
  position: relative;
  margin-top: unset;
  outline: unset;
  order: 2;
  @media (max-width: 999px) {
    margin-top: 10px;
    order: 3;
  }
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
  @media (max-width: 999px) {
    width: 100vw;
    box-shadow: unset;
    margin-left: -6px;
    top: 48px;
    margin-top: unset;
    border-radius: unset;
  }
`;

const dimmer = css`
  @media (max-width: 999px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: ${ZIndexLayer.LEVEL_8};
    background: rgba(0, 0, 0, 0.5);
  }
`;

const arrow = css`
  display: none;
  cursor: pointer;
  fill: white;
  width: 16px;
  height: 16px;
  @media (max-width: 999px) {
    display: block;
  }
`;

const arrowWrapperButton = css`
  display: none;
  @media (max-width: 999px) {
    display: block;
    padding: 0 11px 0 5px;
  }
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
    const inputRef = React.createRef<HTMLInputElement>();
    const listWrapperRef = React.createRef<HTMLDivElement>();
    const [isLoaded, setLoaded] = useState(false);
    const [isFocused, setFocus] = useState(false);
    const [keyword, setKeyword] = useState<string>(props.searchKeyword);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [enableSearchHistoryRecord, toggleSearchHistoryRecord] = useState(true);
    const [focusedPosition, setFocusedPosition] = useState(0);

    const [searchResult, setSearchResult] = useState<InstantSearchResultScheme>(
      initialSearchResult,
    );

    const handleSearch = async (value: string) => {
      try {
        const result = await axios.get(
          `${
            (publicRuntimeConfig as PublicRuntimeConfig).SEARCH_API
          }/search?site=ridi-store&where=book&where=author&what=instant&keyword=${value}`,
        );
        setSearchResult({
          books: get(result.data, data => data.book.books, []),
          authors: get(result.data, data => data.author.authors, []),
        });
      } catch (error) {
        notifySentry(error);
        setSearchResult(initialSearchResult);
        setFocusedPosition(0);
      }
    };
    const [debouncedCallback] = useDebouncedCallback(handleSearch, 300, [keyword]);

    const handleOnChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setKeyword(value);
        // 초-중-종성 체크
        if (value.length > 0) {
          if (value.length === 1 && isOnsetNucleusCoda(value[0])) {
            setSearchResult(initialSearchResult);
          } else {
            debouncedCallback(value);
          }
        }
        setFocusedPosition(0);
      },
      [searchHistory, focusedPosition, keyword],
    );

    const handleFocus = (focus: boolean) => {
      setFocus(focus);
    };

    const handleSearchWrapperBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.relatedTarget) {
        handleFocus(false);
        setFocusedPosition(0);
      }
    };

    const handleToggleSearchHistoryRecord = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      localStorage.setItem(
        localStorageKeys.instantSearchHistoryOption,
        JSON.stringify(!enableSearchHistoryRecord),
      );
      toggleSearchHistoryRecord(!enableSearchHistoryRecord);
      setFocusedPosition(0);
    };

    const handleRemoveHistory = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    };

    const handleClearHistory = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (enableSearchHistoryRecord) {
        localStorage.setItem(localStorageKeys.instantSearchHistory, JSON.stringify([]));
        setSearchHistory([]);
        setFocusedPosition(0);
      }
    };

    const handleClickHistoryItem = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const label = e.currentTarget.getAttribute('data-value');
      if (label) {
        setKeyword(label);
        setFocus(false);
        setSearchResult(initialSearchResult);
        if (!props.isPartials) {
          Router.pushRoute(`/search/?q=${label}`);
        } else {
          window.location.href = `${window.location.origin}/search/?q=${label}`;
        }
      }
    };

    const handleClickBookItem = (e: React.MouseEvent<HTMLLIElement>) => {
      e.preventDefault();
      const { bookId } = e.currentTarget.dataset;
      if (!props.isPartials) {
        Router.pushRoute(`/books/${bookId}?_s=instant&_q=${keyword}`);
      } else {
        window.location.href = `${window.location.origin}/books/${bookId}?_s=instant&_q=${keyword}`;
      }
      setFocus(false);
    };
    const handleClickAuthorItem = (e: React.MouseEvent<HTMLLIElement>) => {
      e.preventDefault();
      const { authorId } = e.currentTarget.dataset;
      if (!props.isPartials) {
        Router.pushRoute(`/author/${authorId}?_s=instant&_q=${keyword}`);
      } else {
        window.location.href = `${
          window.location.origin
        }/author/${authorId}?_s=instant&_q=${keyword}`;
      }
      setFocus(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (keyword.length > 0) {
        if (enableSearchHistoryRecord) {
          const newHistory = Array<string>(...new Set<string>([keyword, ...searchHistory])).slice(
            0,
            10,
          );
          setSearchHistory(newHistory);
          localStorage.setItem(localStorageKeys.instantSearchHistory, JSON.stringify(newHistory));
        }
        // move search result page
        // Todo conditional check for partial component
        if (!props.isPartials) {
          Router.pushRoute(`/search/?q=${keyword}`);
        } else {
          window.location.href = `${window.location.origin}/search/?q=${keyword}`;
        }

        setFocus(false);
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    };

    const handleSetCurrentPosition = (pos: number) => {
      setFocusedPosition(pos);
      if (pos === 0 && inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent | KeyboardEvent) => {
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
    };

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

    const showFooter = useMemo(() => {
      const hasAvailableResult =
        keyword.length > 0 && (searchResult.books.length > 0 || searchResult.authors.length > 0);
      const hasAvailableSearchHistory = keyword.length < 1 && searchHistory.length > 0;

      return isFocused && (hasAvailableResult || hasAvailableSearchHistory);
    }, [isFocused, keyword, searchResult, searchHistory]);
    return (
      <>
        <div tabIndex={0} onBlur={handleSearchWrapperBlur} css={isFocused ? focused : initial}>
          {isFocused && (
            <button css={arrowWrapperButton} onClick={handleFocus.bind(null, false)}>
              <ArrowLeft css={arrow} />
              <span className={'a11y'}>{labels.goBack}</span>
            </button>
          )}
          <div css={searchWrapper}>
            <Lens
              css={theme =>
                css`
                  ${iconStyle(theme)};
                  opacity: ${isFocused ? 1 : 0.6};
                `
              }
            />
            <form onSubmit={handleSubmit}>
              <input
                disabled={!isLoaded}
                aria-label={labels.searchPlaceHolder}
                value={keyword}
                ref={inputRef}
                name="instant_search"
                placeholder={labels.searchPlaceHolder}
                onFocus={handleFocus.bind(null, true)}
                onClick={handleFocus.bind(null, true)}
                onKeyDown={handleKeyDown}
                onChange={handleOnChange}
              />
            </form>
            {keyword.length > 0 && isFocused && (
              <button
                css={css`
                  outline: none;
                `}
                onClick={() => setKeyword('')}>
                <Clear
                  css={css`
                    position: relative;
                    right: 9px;
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
                {keyword.length < 1 ? (
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
        {isFocused && <div onClick={handleFocus.bind(null, false)} css={dimmer} />}
      </>
    );
  },
);

export default InstantSearch;
