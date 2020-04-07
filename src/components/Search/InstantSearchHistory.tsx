import React, { useEffect } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import * as labels from 'src/labels/instantSearch.json';
import * as colors from '@ridi/colors';
import { RIDITheme } from 'src/styles';
import Exclamation from 'src/svgs/Exclamation_1.svg';
import Close from 'src/svgs/Close_2.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

const TurnOffSearchHistory = styled.div`
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
  color: ${colors.slateGray80};
`;

const RecentHistoryLabel = styled.p`
  padding: 12px 0 12px 16px;
  font-size: 14px;
  font-weight: normal;
  color: ${colors.slateGray50};
`;

const RemoveHistoryButton = styled.button`
  margin-left: 16px;
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

const HistoryList = styled.ul`
  li {
    box-sizing: border-box;
  }
`;

const SearchHistoryItem = styled.li`
  cursor: pointer;
  box-sizing: border-box;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${orBelow(
    BreakPoint.LG,
    `
      :hover {
        background-color: white !important;
      }
      :focus {
        background-color: white !important;
      }
    `,
  )};
  a {
    span {
      color: #303538;
      font-size: 15px;
      line-height: 1.33;
    }
  }
  :hover {
    background-color: #f7fafc;
  }
  :focus {
    background-color: #f7fafc;
  }
  outline: none;
`;

const HistoryOptionPanel = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  background-color: ${colors.slateGray5};
  color: ${colors.slateGray50};
  font-size: 14px;
  line-height: 1;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  button {
    color: ${colors.slateGray80};
    opacity: 0.7;
  }
`;

const HistoryOptionButton = styled.button`
  font-size: 14px;
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

const InstantSearchHistory: React.FC<InstantSearchHistoryProps> = (props) => {
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
        const item = items[focusedPosition - 1];
        if (item) {
          item.focus();
        }
      }
    }
  }, [focusedPosition]);
  return (
    <>
      <RecentHistoryLabel>{labels.recentKeywords}</RecentHistoryLabel>
      <HistoryList ref={wrapperRef}>
        {enableSearchHistoryRecord ? (
          <>
            {searchHistory.slice(0, 5).map((history: string, index: number) => (
              <SearchHistoryItem
                tabIndex={0}
                data-value={history}
                onClick={handleClickHistoryItem}
                onKeyDown={handleKeyDown}
                key={index}
              >
                {/* Fixme href */}
                <a href="#history">
                  <span>{history}</span>
                </a>
                <RemoveHistoryButton
                  data-value={history}
                  type="button"
                  onClick={handleRemoveHistory}
                >
                  <Close css={closeIcon} />
                  <span className="a11y">{labels.removeHistory}</span>
                </RemoveHistoryButton>
              </SearchHistoryItem>
            ))}
          </>
        ) : (
          <TurnOffSearchHistory>
            <Exclamation css={exclamation} />
            <span
              css={css`
                color: #9ea7ad;
              `}
            >
              {labels.turnOffStatus}
            </span>
          </TurnOffSearchHistory>
        )}
      </HistoryList>
      <HistoryOptionPanel>
        <HistoryOptionButton
          type="button"
          onClick={handleToggleSearchHistoryRecord}
        >
          {enableSearchHistoryRecord
            ? labels.turnOffSearchHistory
            : labels.turnOnSearchHistory}
        </HistoryOptionButton>
        <HistoryOptionButton
          type="button"
          onClick={handleClearHistory}
        >
          {enableSearchHistoryRecord && labels.clearSearchHistory}
        </HistoryOptionButton>
      </HistoryOptionPanel>
    </>
  );
};

export default InstantSearchHistory;
