import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import { useRouter, NextRouter } from 'next/router';
import React from 'react';
import { useImmer } from 'use-immer';
import Cookies from 'universal-cookie';

import { LENS_ICON_URL } from 'src/constants/icons';
import localStorageKeys from 'src/constants/localStorage';
import * as labels from 'src/labels/instantSearch.json';
import { RIDITheme } from 'src/styles';
import ArrowLeft from 'src/svgs/Arrow_Left_13.svg';
import Clear from 'src/svgs/Clear.svg';
import { CancelToken } from 'src/utils/axios';
import { CancelledError } from 'src/utils/backoff';
import { isJamo } from 'src/utils/hangul';
import { orBelow, BreakPoint } from 'src/utils/mediaQuery';
import { runInstantSearch } from 'src/utils/search';
import sentry from 'src/utils/sentry';
import { localStorage } from 'src/utils/storages';

import { SearchResult } from '../types';
import InstantSearchHistory from './History';
import InstantSearchResult from './Result';

const WrapperForm = styled.form<{ focused?: boolean }>`
  flex: 1;
  max-width: 340px;
  order: 2;
  z-index: 10;
  ${(props) => orBelow(BreakPoint.LG, `
    flex: none;
    width: 100%;
    max-width: 100%;
    order: 3;
    ${props.focused && `
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    `}
  `)}
`;

const FocusTrap = styled.div`
  &, &:focus {
    outline: none;
  }
`;

const SearchBoxWrapper = styled.div<{ focused?: boolean }, RIDITheme>`
  ${(props) => orBelow(BreakPoint.LG, `
    padding-top: 9px;
    ${props.focused && `
      display: flex;
      align-items: center;
      padding: 6px;
      background-color: ${props.theme.primaryColor};
    `}
  `)}
`;

const SearchBoxShape = styled.label`
  background: white;
  border-radius: 3px;

  display: flex;
  align-items: center;
  ${orBelow(BreakPoint.LG, 'width: 100%')}
`;

const StyledClear = styled(Clear)`
  display: block;
  width: 24px;
  height: 24px;
  padding: 5px;
`;

const ArrowButton = styled.button`
  display: none;
  ${orBelow(BreakPoint.LG, 'margin: 0 11px 0 5px; display: block;')};
`;

const StyledArrowLeft = styled(ArrowLeft)`
  fill: white;
  width: 16px;
  height: 16px;
`;

const StyledLens = styled('img', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'focused',
})<{focused?: boolean}, RIDITheme>`
  flex: none;
  width: 24px;
  height: 24px;
  margin: 0 4px 0 6px;
  opacity: ${(props) => (props.focused ? 1 : 0.6)};
`;

const SearchBox = styled.input`
  flex: 1;
  height: 36px;
  font-size: 16px;
  line-height: 16px;
`;

const SearchResetButton = styled.button`
  outline: none;
  margin: 4px;
  margin-right: 6px;
`;

const PopupWrapper = styled.div<{ focused?: boolean }>`
  position: absolute;
  width: 380px;
  margin-top: 2px;
  border-radius: 3px;
  background-color: white;

  opacity: 1;
  transition: opacity 0.2s ease-in-out;

  ${(props) => props.focused && `
    box-shadow: rgba(0, 0, 0, 0.3) 3px 3px 10px 3px;
    z-index: 10;
  `}

  ${(props) => orBelow(BreakPoint.LG, `
    position: static;
    width: 100%;
    margin-top: 0;
    border-radius: 0;
    box-shadow: none;

    opacity: 0;
    ${props.focused && 'opacity: 1;'}
  `)}
`;

function initializeAdultExclude(router: NextRouter) {
  if (router.query.adult_exclude) {
    return router.query.adult_exclude === 'y';
  }
  const cookie = new Cookies();
  const cookieValue = cookie.get('adult_exclude');
  return cookieValue === 'y';
}

export default function InstantSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = React.useState(String(router.query.q || ''));
  const [isFocused, setFocused] = React.useState(false);
  const [disableRecord, setDisableRecord] = React.useState(() => {
    const value = localStorage.getItem(localStorageKeys.instantSearchHistoryOption);
    if (value == null) {
      return false;
    }
    try {
      const parsedValue = JSON.parse(value);
      if (typeof parsedValue === 'boolean') {
        // localStorage에는 저장 여부가 들어있기 때문에 뒤집는다
        return !parsedValue;
      }
    } catch (_) {
      // do nothing
    }
    return false;
  });
  const [adultExclude, setAdultExclude] = React.useState(() => initializeAdultExclude(router));
  const [focusedPosition, setFocusedPosition] = React.useState<number | null>(null);

  const [searchHistory, updateSearchHistory] = useImmer<string[]>(() => {
    const history = localStorage.getItem(localStorageKeys.instantSearchHistory);
    if (history) {
      try {
        const parsedHistory = JSON.parse(history);
        if (
          Array.isArray(parsedHistory)
          && parsedHistory.every((item) => typeof item === 'string')
        ) {
          return parsedHistory
            .map((item) => item.trim())
            .filter((item) => item !== '')
            .slice(0, 5);
        }
      } catch (_) {
        // invalid history, do nothing
      }
    }
    return [];
  });

  const addSearchHistory = (item: string) => {
    updateSearchHistory((draft) => [...new Set([item, ...draft])].slice(0, 5));
  };

  const removeSearchHistory = (index: number) => {
    updateSearchHistory((draft) => draft.filter((_, idx) => idx !== index));
  };

  const clearSearchHistory = () => {
    updateSearchHistory(() => []);
  };

  type InstantSearchState =
    | { status: 'cold' }
    | { status: 'pending'; keyword: string; adultExclude: boolean; result?: SearchResult }
    | { status: 'done'; keyword: string; result: SearchResult }
  ;

  const [instantSearchState, updateInstantSearchState] = useImmer<InstantSearchState>({ status: 'cold' });

  const startInstantSearch = (_keyword: string, _adultExclude: boolean) => {
    updateInstantSearchState((draft) => {
      if (keyword === '') {
        return { status: 'cold' };
      }
      return {
        ...draft,
        status: 'pending',
        keyword: _keyword,
        adultExclude: _adultExclude,
      };
    });
  };

  const doneInstantSearch = (_keyword: string, _adultExclude: boolean, result: SearchResult) => {
    updateInstantSearchState((draft) => {
      if (
        draft.status === 'pending'
        && draft.keyword === _keyword
        && draft.adultExclude === _adultExclude
      ) {
        return {
          status: 'done',
          keyword: _keyword,
          result,
        };
      }
    });
  };

  const doSearch = React.useCallback((searchKeyword: string) => {
    const trimmedKeyword = searchKeyword.trim();
    if (trimmedKeyword === '') {
      return;
    }
    if (!disableRecord) {
      addSearchHistory(trimmedKeyword);
    }
    const params = new URLSearchParams({
      q: trimmedKeyword,
      adult_exclude: adultExclude ? 'y' : 'n',
    });
    window.location.href = `/search?${params.toString()}`;
  }, [disableRecord, adultExclude]);

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    doSearch(keyword);
  }, [keyword, disableRecord, adultExclude]);

  const handleKeywordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const handleKeywordReset = React.useCallback(() => {
    setKeyword('');
  }, []);

  const handleHistoryItemClick = React.useCallback((idx: number) => {
    const historyKeyword = searchHistory[idx].trim();
    setKeyword(historyKeyword);
    doSearch(historyKeyword);
  }, [searchHistory]);

  const handleHistoryItemRemove = React.useCallback((idx: number) => {
    if (!disableRecord) {
      removeSearchHistory(idx);
    }
  }, [disableRecord]);

  const handleHistoryClear = React.useCallback(() => {
    if (!disableRecord) {
      clearSearchHistory();
    }
  }, [disableRecord]);

  const handleAuthorClick = React.useCallback((id: number) => {
    const params = new URLSearchParams({
      _s: 'instant',
      _q: keyword,
    });
    setFocused(false);
    window.location.href = `/author/${id}?${params.toString()}`;
  }, [keyword]);

  const handleBookClick = React.useCallback((id: string) => {
    const params = new URLSearchParams({
      _s: 'instant',
      _q: keyword,
    });
    setFocused(false);
    window.location.href = `/books/${id}?${params.toString()}`;
  }, [keyword]);

  const handleArrowLeftClick = React.useCallback(() => {
    setFocused(false);
  }, []);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    let itemCount = 0;
    let authors: SearchResult['authors'] = [];
    let books: SearchResult['books'] = [];
    if (keyword === '') {
      itemCount = searchHistory.length;
    } else if (instantSearchState.status === 'done' || instantSearchState.status === 'pending') {
      const { result } = instantSearchState;
      if (result != null) {
        authors = result.authors;
        books = result.books;
        itemCount = authors.length + books.length;
      }
    }

    let newPosition = focusedPosition ?? itemCount;
    switch (e.key) {
      case 'ArrowDown':
      case 'Down':
        newPosition += 1;
        break;
      case 'ArrowUp':
      case 'Up':
        newPosition -= 1;
        break;
      case 'Enter':
        if (focusedPosition != null) {
          e.preventDefault();
          e.stopPropagation();
          if (keyword === '') {
            handleHistoryItemClick(focusedPosition);
          } else if (focusedPosition < authors.length) {
            handleAuthorClick(authors[focusedPosition].id);
          } else if (focusedPosition < itemCount) {
            handleBookClick(books[focusedPosition - authors.length].b_id);
          }
        } else if (keyword !== '') {
          // Fixme Chrome, FF 에서 input 검색에 엔터를 두 번 쳐야되는 문제가 있음
          e.preventDefault();
          e.stopPropagation();
          doSearch(keyword);
        }
        return;
      default:
        setFocusedPosition(null);
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    newPosition += itemCount + 1;
    newPosition %= (itemCount + 1);
    setFocusedPosition(newPosition === itemCount ? null : newPosition);
  }, [focusedPosition, keyword, searchHistory, instantSearchState]);

  const handleFocus = React.useCallback(() => setFocused(true), []);
  const handleBlur = React.useCallback((e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget || document.activeElement;
    if (!e.currentTarget.contains(relatedTarget as (Element | null))) {
      setFocused(false);
    }
    setFocusedPosition(null);
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      setAdultExclude(initializeAdultExclude(router));
      setFocusedPosition(null);
    }
  }, [isFocused]);

  React.useEffect(() => {
    const cookie = new Cookies();
    cookie.set(
      'adult_exclude',
      adultExclude ? 'y' : 'n',
      { path: '/', sameSite: 'lax' },
    );
  }, [adultExclude]);

  React.useEffect(() => {
    // localStorage에는 저장 여부가 들어있기 때문에 뒤집는다
    const value = JSON.stringify(!disableRecord);
    localStorage.setItem(
      localStorageKeys.instantSearchHistoryOption,
      value,
    );
  }, [disableRecord]);

  React.useEffect(() => {
    const keywordToSearch = keyword.trim();
    startInstantSearch(keywordToSearch, adultExclude);

    if (keywordToSearch === '') {
      return;
    }
    if (keywordToSearch.length === 1 && isJamo(keywordToSearch)) {
      return;
    }
    const cancelSource = CancelToken.source();
    const handle = window.setTimeout(() => {
      // make the linter happy
      (async () => {
        const result = await runInstantSearch(
          keywordToSearch,
          adultExclude,
          cancelSource.token,
        );
        if (result == null) {
          return;
        }
        doneInstantSearch(keywordToSearch, adultExclude, {
          authors: result.author.authors,
          books: result.book.books,
        });
        setFocusedPosition(null);
      })().catch((err) => {
        if (err instanceof CancelledError) {
          return;
        }
        const statusCode = err?.response?.statusCode ?? 0;
        if (statusCode === 401 || statusCode === 403) {
          return;
        }
        sentry.captureException(err);
      });
    }, 500);
    return () => {
      window.clearTimeout(handle);
      cancelSource.cancel();
    };
  }, [keyword, adultExclude]);

  React.useEffect(() => {
    const history = JSON.stringify(searchHistory);
    localStorage.setItem(localStorageKeys.instantSearchHistory, history);
  }, [searchHistory]);

  let popup = null;
  if (isFocused) {
    if (keyword === '') {
      popup = (
        <InstantSearchHistory
          disableRecord={disableRecord}
          searchHistory={searchHistory}
          focusedPosition={focusedPosition ?? undefined}
          onDisableRecordChange={setDisableRecord}
          onItemClick={handleHistoryItemClick}
          onItemRemove={handleHistoryItemRemove}
          onItemHover={setFocusedPosition}
          onClear={handleHistoryClear}
        />
      );
    } else if (instantSearchState.status === 'done' || instantSearchState.status === 'pending') {
      const { result } = instantSearchState;
      if (result != null && result.books.length + result.authors.length > 0) {
        popup = (
          <InstantSearchResult
            focusedPosition={focusedPosition ?? undefined}
            result={result}
            adultExclude={adultExclude}
            onAuthorClick={handleAuthorClick}
            onBookClick={handleBookClick}
            onAdultExcludeChange={setAdultExclude}
            onItemHover={setFocusedPosition}
          />
        );
      }
    }
  }

  return (
    <WrapperForm
      focused={isFocused}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
    >
      {/* 검색창 내부 포커스를 여기서 잡음 */}
      <FocusTrap tabIndex={-1} onKeyDown={handleKeyDown}>
        <SearchBoxWrapper focused={isFocused}>
          {
            isFocused && (
              <ArrowButton onClick={handleArrowLeftClick}>
                <StyledArrowLeft />
              </ArrowButton>
            )
          }
          <SearchBoxShape>
            <StyledLens alt="인스턴트 검색" src={LENS_ICON_URL} focused={isFocused} />
            <SearchBox
              placeholder={labels.searchPlaceHolder}
              value={keyword}
              onChange={handleKeywordChange}
            />
            {isFocused && keyword !== '' && (
              <SearchResetButton type="button" onClick={handleKeywordReset}>
                <StyledClear />
              </SearchResetButton>
            )}
          </SearchBoxShape>
        </SearchBoxWrapper>
        {popup && (
          <PopupWrapper focused={isFocused}>
            {popup}
          </PopupWrapper>
        )}
      </FocusTrap>
    </WrapperForm>
  );
}
