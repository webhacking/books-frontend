/** @jsx jsx */
import * as React from 'react';
import { jsx, css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { Svg } from 'src/components/Svg';
import { RIDITheme } from 'src/styles';
import { useState } from 'react';
import { notifySentry } from 'src/utils/sentry';
import { useDebouncedCallback } from 'use-debounce';
import { Router } from 'server/routes';
import localStorageKeys from 'src/constants/localStorage';
// @ts-ignore
import { saveSearchHistory, searchPlaceHolder } from 'src/labels/instantSearch.json';

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
    width: 100%;
  }
  form {
    min-width: 320px;
    @media (max-width: 999px) {
      width: 95%;
    }
  }

  input {
    margin-top: -2px;
    padding-right: 4px;
    width: 100%;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.5px;
    color: #000000;
    ::placeholder {
      font-size: 15px;
      height: 19px;
      line-height: 15px;
      font-weight: 500;
      letter-spacing: -0.5px;
      color: ${theme.input.placeholder};
      vertical-align: middle;
    }
  }
  display: flex;
  align-items: center;
`;

const iconStyle = (theme: RIDITheme) => css`
  fill: ${theme.input.placeholder};
  opacity: 0.6;
  padding: 6px 3px 5px 6px;
  width: 22px;
  height: 22px;
  @media (max-width: 999px) {
    width: 24px;
    height: 24px;
  }
`;

const focused = (theme: RIDITheme) => css`
  @media (max-width: 999px) {
    margin-top: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    background: ${theme.primaryColor};
    width: 100%;
    padding: 6px;
    box-sizing: border-box;
    animation: ${fadeIn} 0.2s ease-in-out;
    display: flex;
    align-items: center;
  }
`;

const initial = () => css`
  position: relative;
  margin-top: unset;
  @media (max-width: 999px) {
    margin-top: 10px;
  }
`;

const readHistory = () => {
  try {
    return JSON.parse(window.localStorage.getItem('test') || '');
  } catch (err) {
    notifySentry(err);
    return [];
  }
};

const SearchHistoryItem = styled.li`
  @media (max-width: 999px) {
    height: 40px;
  }
`;

const SearchHistoryOptionPanel = styled.li`
  @media (max-width: 999px) {
    height: 40px;
  }
`;

const SearchHistory = styled.ul``;

const searchFooter = css`
  box-sizing: border-box;
  position: absolute;
  background-color: white;
  width: 380px;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  z-index: 1;
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
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const arrow = css`
  padding: 0 12px 0 8px;
  display: none;
  @media (max-width: 999px) {
    display: block;
  }
`;

interface InstantSearchProps {
  searchKeyword: string;
}

export const InstantSearch: React.FC<InstantSearchProps> = React.memo(
  (props: InstantSearchProps) => {
    const inputRef = React.createRef<HTMLInputElement>();

    const [isFocused, setFocus] = useState(false);
    const [keyword, setKeyword] = useState(props.searchKeyword);
    const [searchHistory, setHistory] = useState(readHistory);
    const [searchResult, setSearchResult] = useState<Array<{ name: string }>>([]);

    const handleSearch = async () => {
      console.log(`search start keyword:${keyword}`);
      // Fixme
      // const result = await axios.get(`https://search-api.dev.ridi.io/search?=${searchKeyword}`);
      setSearchResult([{ name: 'test' }]);
    };
    const [debouncedCallback] = useDebouncedCallback(handleSearch, 300, []);
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
      debouncedCallback();
    };
    const handleFocus = (focus: boolean) => {
      setFocus(focus);
    };

    const showFooter = isFocused && (keyword.length < 1 || searchResult.length > 0);

    return (
      <>
        <div css={isFocused ? focused : initial}>
          {isFocused && (
            <div onClick={handleFocus.bind(null, false)}>
              <Svg css={arrow} iconName={'Arrow_Left_13'} width="16px" height="16px" fill="white" />
            </div>
          )}
          <div css={searchWrapper}>
            <Svg css={iconStyle} iconName={'Lens'} />
            <form
              onSubmit={e => {
                e.preventDefault();
                if (keyword.length > 0) {
                  // Todo save keyword to localStorage
                  localStorage.setItem(
                    localStorageKeys.instantSearchHistory,
                    JSON.stringify(['test']),
                  );
                  console.log(searchHistory);
                  setHistory([keyword, 1]);

                  // move search result page
                  Router.push(`/search/?q=${keyword}`);
                }
              }}>
              <input
                defaultValue={keyword}
                ref={inputRef}
                placeholder={searchPlaceHolder}
                onClick={handleFocus.bind(null, true)}
                onChange={handleOnChange}
                onBlur={handleFocus.bind(null, false)}
              />
            </form>
          </div>
          {showFooter && (
            <div css={searchFooter}>
              {keyword.length < 1 ? (
                <SearchHistory>
                  <SearchHistoryItem>으앙</SearchHistoryItem>
                  <SearchHistoryOptionPanel>{saveSearchHistory}</SearchHistoryOptionPanel>
                </SearchHistory>
              ) : (
                searchResult.length > 0 && <div>result</div>
              )}
            </div>
          )}
        </div>
        {isFocused && <div css={dimmer} />}
      </>
    );
  },
);

export default InstantSearch;
