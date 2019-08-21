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
  font-size: 14px;
  letter-spacing: 0.3px;
  color: ${theme.label3};
`;

const recentHistoryLabel = (theme: RIDITheme) => css`
  padding: 13px 0 13px 16px;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: -0.43px;
  color: ${theme.label2};
`;

const closeIcon = (theme: RIDITheme) => css`
  fill: ${theme.icon.warn};
  width: 12px;
  height: 12px;
`;

const exclamation = (theme: RIDITheme) => css`
  margin-right: 3px;
  fill: ${theme.etc.slot1};
  width: 14px;
  height: 14px;
`;

const historyListCSS = () => css`
  li {
    box-sizing: border-box;
  }
`;

const SearchHistoryItem = styled.li`
  cursor: pointer;
  box-sizing: border-box;
  padding: 13px 16px;
  font-size: 15px;
  line-height: 1;
  letter-spacing: -0.43px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 999px) {
    :hover {
      background-color: white !important;
    }
    :focus {
      background-color: white !important;
    }
  }
  a {
    span {
      color: #303538;
      font-size: 15px;
      letter-spacing: -0.46px;
      line-height: 1.33;
    }
  }
  :hover {
    background-color: #f7fafc;
  }
  :focus {
    background-color: #f7fafc;
  }
`;

const historyOptionPanelCSS = theme => css`
  padding: 13px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  background-color: ${theme.divider};
  color: ${theme.input.placeholder};
  font-size: 14px;
  line-height: 1;
  letter-spacing: -0.4px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  button {
    color: ${theme.label3};
    opacity: 0.7;
  }
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
                  css={css`
                    margin-left: 16px;
                  `}
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
            <span
              css={css`
                color: #9ea7ad;
              `}>
              {labels.turnOffStatus}
            </span>
          </div>
        )}
      </ul>
      <div css={historyOptionPanelCSS}>
        <button
          css={css`
            font-size: 14px;
            letter-spacing: -0.43px;
          `}
          type={'submit'}
          onClick={handleToggleSearchHistoryRecord}>
          {enableSearchHistoryRecord
            ? labels.turnOffSearchHistory
            : labels.turnOnSearchHistory}
        </button>
        <button
          css={css`
            font-size: 14px;
            letter-spacing: -0.43px;
          `}
          type={'submit'}
          onClick={handleClearHistory}>
          {enableSearchHistoryRecord && labels.clearSearchHistory}
        </button>
      </div>
    </>
  );
};

export default InstantSearchHistory;
