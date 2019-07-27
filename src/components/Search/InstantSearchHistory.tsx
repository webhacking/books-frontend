import React, { useEffect } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import * as labels from 'src/labels/instantSearch.json';
import { RIDITheme } from 'src/styles';
import Exclamation from 'src/svgs/Exclamation_1.svg';
import Close from 'src/svgs/Close_2.svg';

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

const closeIcon = (theme: RIDITheme) => css`
  fill: ${theme.icon.warn};
  width: 8px;
  height: 8px;
  @media (max-width: 999px) {
    width: 10px;
    height: 10px;
  }
`;

const exclamation = (theme: RIDITheme) => css`
  margin-right: 3px;
  fill: ${theme.etc.slot1};
  width: 14px;
  height: 14px;
`;

const historyListCSS = theme => css`
  li {
    box-sizing: border-box;
    :not(:last-of-type) {
      @media (max-width: 999px) {
        border-bottom: 1px ${theme.divider} solid;
      }
    }
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
  a {
    span {
      color: black;
      font-size: 14px;
    }
  }
  :hover {
    background-color: #ebf6ff;
  }
  :focus {
    background-color: #ebf6ff;
  }
`;

const historyOptionPanelCSS = theme => css`
  padding: 12px 20px;
  cursor: pointer;
  @media (max-width: 999px) {
    height: 40px;
  }
  display: flex;
  justify-content: space-between;
  background-color: ${theme.divider};
  color: ${theme.input.placeholder};
  font-size: 13px;
  line-height: 1.31;
  letter-spacing: -0.4px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
`;

interface InstantSearchHistoryProps {
  enableSearchHistoryRecord: boolean;
  handleClickHistoryItem: (e: React.MouseEvent<HTMLElement>) => void;
  handleRemoveHistory: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleClearHistory: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleToggleSearchHistoryRecord: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  searchHistory: string[];
  focusedPosition: number;
}

const InstantSearchHistory: React.FC<InstantSearchHistoryProps> = props => {
  const {
    enableSearchHistoryRecord,
    handleClearHistory,
    handleRemoveHistory,
    handleClickHistoryItem,
    handleToggleSearchHistoryRecord,
    searchHistory,
    handleKeyDown,
    focusedPosition,
  } = props;

  const wrapperRef = React.useRef<HTMLUListElement>();

  useEffect(() => {
    if (wrapperRef.current) {
      const items = wrapperRef.current.querySelectorAll('li');
      if (items.length > 0 && focusedPosition !== 0) {
        (items[focusedPosition - 1] as HTMLLIElement).focus();
      }
    }
  }, [focusedPosition]);
  return (
    <>
      <p css={recentHistoryLabel}>{labels.recentKeywords}</p>
      <ul css={historyListCSS} ref={wrapperRef}>
        {enableSearchHistoryRecord ? (
          <>
            {searchHistory.slice(0, 5).map((history: string, index: number) => (
              <SearchHistoryItem
                tabIndex={0}
                data-value={history}
                onClick={handleClickHistoryItem}
                onKeyDown={handleKeyDown}
                key={index}>
                {/* Fixme href */}
                <a href={'#history'}>
                  <span>{history}</span>
                </a>
                <button
                  data-value={history}
                  type={'submit'}
                  onClick={handleRemoveHistory}>
                  <Close css={closeIcon} />
                  <span className={'a11y'}>{labels.removeHistory}</span>
                </button>
              </SearchHistoryItem>
            ))}
          </>
        ) : (
          <div css={turnOffSearchHistory}>
            <Exclamation css={exclamation} />
            <span>{labels.turnOffStatus}</span>
          </div>
        )}
      </ul>
      <div css={historyOptionPanelCSS}>
        <button
          css={css`
            font-size: 13px;
          `}
          type={'submit'}
          onClick={handleClearHistory}>
          {enableSearchHistoryRecord && labels.clearSearchHistory}
        </button>
        <button
          css={css`
            font-size: 13px;
          `}
          type={'submit'}
          onClick={handleToggleSearchHistoryRecord}>
          {enableSearchHistoryRecord
            ? labels.turnOffSearchHistory
            : labels.turnOnSearchHistory}
        </button>
      </div>
    </>
  );
};

export default InstantSearchHistory;
