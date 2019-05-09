import * as React from 'react';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { Svg } from 'src/components/Svg';
import { RIDITheme, ZIndexLayer } from 'src/styles';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Router } from 'server/routes';
import localStorageKeys from 'src/constants/localStorage';
import * as labels from 'src/labels/instantSearch.json';
import { isOnsetNucleusCoda } from 'src/utils/hangle';
import { safeJSONParse } from 'src/utils/common';

// import axios from 'axios';

const fadeIn = keyframes`
  0% { 
    opacity: 0; 
  }
  100% { 
    opacity: 1; 
  }
  
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
    position: relative;
    top: -0.5px;
    //margin-top: -2px;
    padding-right: 4px;
    width: 98%;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.5px;
    color: #000000;
    ::placeholder {
      //padding-top: 2px;
      font-size: 15px;
      height: 19px;
      line-height: 19px;
      font-weight: 500;
      letter-spacing: -0.5px;
      color: ${theme.input.placeholder};
    }
    ::-moz-placeholder {
      opacity: 1;
      font-size: 15px;
      height: 19px;
      line-height: 19px;
      font-weight: 500;
      letter-spacing: -0.5px;
      color: ${theme.input.placeholder};
    }
    :-moz-placeholder {
      opacity: 1;
      font-size: 15px;
      height: 19px;
      line-height: 19px;
      font-weight: 500;
      letter-spacing: -0.5px;
      color: ${theme.input.placeholder};
    }
  }
  display: flex;
  align-items: center;
`;
const turnOffSearchHistory = (theme: RIDITheme) => css`
  text-align: center;
  width: 100%;
  height: 160px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  box-sizing: content-box;
  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${theme.label};
`;

const exclamation = (theme: RIDITheme) => css`
  margin-right: 3px;
  fill: ${theme.etc.slot1};
`;

const iconStyle = (theme: RIDITheme) => css`
  fill: ${theme.input.placeholder};
  opacity: 0.6;
  box-sizing: content-box;
  padding: 6px 3px 5px 6px;
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

const SearchHistoryItem = styled.li`
  cursor: pointer;
  box-sizing: border-box;
  padding: 8px 20px;
  font-size: 14px;
  line-height: 1;
  letter-spacing: -0.4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 999px) {
    height: 40px;
    padding: 12px 15px 12px 20px;
  }
  :nth-last-of-type(2) {
    padding: 12px 20px 18px 20px;
    height: unset;
    @media (max-width: 999px) {
      padding: 12px 15px 12px 20px;
    }
  }
  a {
    span {
      color: black;
      font-size: 14px;
    }
  }
`;

const closeIcon = (theme: RIDITheme) => css`
  fill: ${theme.icon.warn};
  width: 8px;
  height: 8px;
  @media (max-width: 999px) {
    width: 10px;
    height: 10px;
  }
`;

const SearchHistoryOptionPanel = styled.li`
  padding: 12px 20px;
  cursor: pointer;
  @media (max-width: 999px) {
    height: 40px;
  }
  display: flex;
  justify-content: space-between;
`;

const SearchHistory = styled.ul`
  li {
    box-sizing: border-box;
    :last-of-type {
      background-color: ${props => props.theme.divider};
      color: ${props => props.theme.input.placeholder};
      font-size: 13px;
      line-height: 1.31;
      letter-spacing: -0.4px;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
      @media (max-width: 999px) {
      }
    }
    :not(:last-of-type) {
      @media (max-width: 999px) {
        border-bottom: 1px ${props => props.theme.divider} solid;
      }
    }
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

const recentHistoryLabel = (theme: RIDITheme) => css`
  padding: 18px 20px 10px 20px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.3px;
  color: ${theme.label};

  @media (max-width: 999px) {
    display: none;
  }
`;

interface InstantSearchProps {
  searchKeyword: string;
  isPartials?: boolean;
}
export const InstantSearch: React.FC<InstantSearchProps> = React.memo(
  (props: InstantSearchProps) => {
    const inputRef = React.createRef<HTMLInputElement>();

    const [isLoaded, setLoaded] = useState(false);
    const [isFocused, setFocus] = useState(false);
    const [keyword, setKeyword] = useState<string>(props.searchKeyword);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [enableSearchHistoryRecord, toggleSearchHistoryRecord] = useState(true);

    // Todo Make search result interface
    const [searchResult, setSearchResult] = useState<Array<{ name: string }>>([]);

    const handleSearch = async (value: string) => {
      console.log(`search start keyword:${value}`);
      // Fixme
      // const result = await axios.get(`https://search-api.dev.ridi.io/search?=${searchKeyword}`);
      setSearchResult([{ name: 'test' }]);
    };
    const [debouncedCallback] = useDebouncedCallback(handleSearch, 300, [keyword]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setKeyword(value);
      // 초-중-종성 체크
      if (value.length > 0 && !isOnsetNucleusCoda(value[0])) {
        debouncedCallback(value);
      }
    };

    const handleFocus = (focus: boolean) => {
      setFocus(focus);
    };

    const handleSearchWrapperBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.relatedTarget) {
        handleFocus(false);
      }
    };

    const handleToggleSearchHistoryRecord = (
      e: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>,
    ) => {
      if ((e as React.KeyboardEvent).keyCode && (e as React.KeyboardEvent).keyCode !== 13) {
        return;
      }
      e.preventDefault();
      localStorage.setItem(
        localStorageKeys.instantSearchHistoryOption,
        JSON.stringify(!enableSearchHistoryRecord),
      );
      toggleSearchHistoryRecord(!enableSearchHistoryRecord);
    };

    const handleRemoveHistory = (
      e: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>,
    ) => {
      if ((e as React.KeyboardEvent).keyCode && (e as React.KeyboardEvent).keyCode !== 13) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const label = e.currentTarget.getAttribute('data-value');
      if (label) {
        const historySet = new Set<string>([...searchHistory]);
        historySet.delete(label);
        const newHistory: string[] = Array<string>(...historySet);
        setSearchHistory(newHistory);
        localStorage.setItem(
          localStorageKeys.instantSearchHistory,
          JSON.stringify(newHistory.slice(0, 10)),
        );
      }
    };

    const handleClearHistory = (
      e: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>,
    ) => {
      if ((e as React.KeyboardEvent).keyCode && (e as React.KeyboardEvent).keyCode !== 13) {
        return;
      }
      e.preventDefault();
      if (enableSearchHistoryRecord) {
        localStorage.setItem(localStorageKeys.instantSearchHistory, JSON.stringify([]));
        setSearchHistory([]);
      }
    };

    const handleClickHistoryItem = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const label = e.currentTarget.getAttribute('data-value');
      if (label) {
        setKeyword(label);
        // Router.pushRoute(`/search/?q=${label}`);
        // setFocus(false);
        if (inputRef.current) {
          inputRef.current.blur();
        }
        if (!props.isPartials) {
          Router.pushRoute(`/search/?q=${keyword}`);
        } else {
          // Router.push(`/search/?q=${keyword}`);
          window.location.href = `${window.location.origin}/search/?q=${keyword}`;
        }
      }
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

    // initialize
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

      const focusListener = handleFocus.bind(null, true);
      if (inputRef.current) {
        setLoaded(true);
        inputRef.current.addEventListener('focus', focusListener);
      }
      return () => {
        // Todo Unmount test
        if (inputRef.current) {
          inputRef.current.removeEventListener('focus', focusListener);
        }
      };
    }, []);

    const showFooter =
      isFocused &&
      ((keyword.length > 0 && searchResult.length > 0) ||
        (keyword.length < 1 && searchHistory.length > 0));

    return (
      <>
        <div tabIndex={0} onBlur={handleSearchWrapperBlur} css={isFocused ? focused : initial}>
          {isFocused && (
            <button css={arrowWrapperButton} onClick={handleFocus.bind(null, false)}>
              <Svg css={arrow} iconName={'Arrow_Left_13'} width="16px" height="16px" fill="white" />
              <span className={'a11y'}>{labels.goBack}</span>
            </button>
          )}
          <div css={searchWrapper}>
            <Svg css={iconStyle} iconName={'Lens'} />
            <form onSubmit={handleSubmit}>
              <input
                disabled={!isLoaded}
                aria-label={labels.searchPlaceHolder}
                value={keyword}
                ref={inputRef}
                name="instant_search"
                placeholder={labels.searchPlaceHolder}
                onClick={handleFocus.bind(null, true)}
                onChange={handleOnChange}
              />
            </form>
          </div>
          {showFooter && (
            <div css={searchFooter}>
              {keyword.length < 1 ? (
                <SearchHistory>
                  {enableSearchHistoryRecord ? (
                    <>
                      <li css={recentHistoryLabel}>{labels.recentKeywords}</li>
                      {searchHistory.slice(0, 5).map((history: string, index: number) => (
                        <SearchHistoryItem
                          data-value={history}
                          onMouseDown={handleClickHistoryItem}
                          key={index}>
                          <a href={'#'}>
                            <span>{history}</span>
                          </a>
                          <button
                            data-value={history}
                            onKeyDown={handleRemoveHistory}
                            onMouseDown={handleRemoveHistory}>
                            <Svg css={closeIcon} iconName={'Close_2'} />
                            <span className={'a11y'}>{labels.removeHistory}</span>
                          </button>
                        </SearchHistoryItem>
                      ))}
                    </>
                  ) : (
                    <li css={turnOffSearchHistory}>
                      <Svg css={exclamation} iconName={'Exclamation_1'} width={14} height={14} />
                      <span>{labels.turnOffStatus}</span>
                    </li>
                  )}

                  <SearchHistoryOptionPanel>
                    <button
                      css={css`
                        font-size: 13px;
                      `}
                      onMouseDown={handleClearHistory}
                      onKeyDown={handleClearHistory}>
                      {enableSearchHistoryRecord && labels.clearSearchHistory}
                    </button>
                    <button
                      css={css`
                        font-size: 13px;
                      `}
                      onMouseDown={handleToggleSearchHistoryRecord}
                      onKeyDown={handleToggleSearchHistoryRecord}>
                      {enableSearchHistoryRecord
                        ? labels.turnOffSearchHistory
                        : labels.turnOnSearchHistory}
                    </button>
                  </SearchHistoryOptionPanel>
                </SearchHistory>
              ) : (
                searchResult.length > 0 && <div>result</div>
              )}
            </div>
          )}
        </div>
        {isFocused && <div onClick={handleFocus.bind(null, false)} css={dimmer} />}
      </>
    );
  },
);

export default InstantSearch;
