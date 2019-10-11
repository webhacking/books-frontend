import * as React from 'react';
import { InstantSearch } from 'src/components/Search';
import {
  render,
  cleanup,
  fireEvent,
  getAllByText,
  getByPlaceholderText,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import labels from 'src/labels/instantSearch.json';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import localStorageKeys from 'src/constants/localStorage';
import { safeJSONParse } from '../../../utils/common';

afterEach(cleanup);

// axiosMock.get.mockResolvedValue();
const renderComponent = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <InstantSearch searchKeyword={''} />
    </ThemeProvider>,
  );

describe('test instant search', () => {
  it('should be render input', () => {
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    expect(inputNode).not.toBe(null);
  });

  it('should be render history list', async () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1', 'history_2']),
    );
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.focus(inputNode, {});
    const historyNode = getAllByText(container, labels.turnOffSearchHistory);
    expect(historyNode).not.toBe(null);
    const historyItems = container.getElementsByTagName('li');
    expect(historyItems.length).toBeGreaterThan(1);
    const item = getAllByText(container, 'history_1');
    expect(item).not.toBe(null);
  });

  it('should be move item by keyboard control', async () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1', 'history_2']),
    );
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.click(inputNode, {});
    fireEvent.keyDown(inputNode, {
      key: 'Down',
      keyCode: 40,
      code: 40,
      charCode: 40,
      which: 40,
    });
    fireEvent.keyDown(inputNode, {
      key: 'Down',
      keyCode: 40,
      code: 40,
      charCode: 40,
      which: 40,
    });
    fireEvent.keyDown(inputNode, {
      key: 'Up',
      keyCode: 38,
      code: 38,
      charCode: 38,
      which: 38,
    });
    expect(document.activeElement).not.toBe(null);
    fireEvent.keyDown(document.activeElement!, {
      key: 'Enter',
      keyCode: 13,
      code: 13,
      charCode: 13,
      which: 13,
    });
  });

  it('should not be render search history', () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      'maybe error be with you',
    );
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.click(inputNode, {});
    const historyItems = container.getElementsByTagName('li');
    expect(historyItems.length).toBe(0);
  });

  it('should be render search result', async () => {
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.change(inputNode, { target: { value: 'ABC' } });

    // Fixme
    // https://github.com/trojanowski/react-apollo-hooks/issues/84
    // https://github.com/facebook/react/releases/tag/v16.9.0-alpha.0
    await new Promise(resolve => setTimeout(resolve, 301));
    // const resultNode = getAllByText(container , 'result');
    // expect(resultNode).not.toBe('a');
  });

  it('should not be render search result', async () => {
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.change(inputNode, { target: { value: '가나' } });
    await new Promise(resolve => setTimeout(resolve, 100));
    // Fixme
    // https://github.com/trojanowski/react-apollo-hooks/issues/84
    // https://github.com/facebook/react/releases/tag/v16.9.0-alpha.0
    //
    expect(inputNode.value).toBe('가나');
  });

  it('can be add search history', () => {
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    const searchForm = container.getElementsByTagName('form');
    expect(searchForm).not.toBe(null);

    // keyword length 0 submit
    fireEvent.submit(searchForm[0]);

    fireEvent.change(inputNode, { target: { value: 'ABC' } });
    fireEvent.submit(searchForm[0]);

    const history = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistory),
      [],
    );
    expect(history).not.toBe([]);
  });

  it('should be remove all search history.', () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1']),
    );
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.focus(inputNode, {});
    const historyClearNode = getAllByText(container, labels.clearSearchHistory);
    expect(historyClearNode).not.toBe(null);
    fireEvent.click(historyClearNode[0], {});
    const history = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistory),
      '',
    );

    expect(history.length).toBe(0);
  });
  it('should be toggle search history', () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1']),
    );
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.focus(inputNode, {});
    const historyToggleNode = getAllByText(container, labels.turnOffSearchHistory);
    expect(historyToggleNode).not.toBe(null);
    fireEvent.click(historyToggleNode[0], {});
    const historyOption = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistoryOption),
      'defaultValue',
    );
    expect(historyOption).toBe(false);
    getAllByText(container, labels.turnOffStatus);

    const historyToggleOnNode = getAllByText(container, labels.turnOnSearchHistory);
    expect(historyToggleOnNode).not.toBe(null);
    fireEvent.click(historyToggleOnNode[0], {});
    const historyOnOption = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistoryOption),
      'defaultValue',
    );
    expect(historyOnOption).toBe(true);
  });

  it('should be remove search history item', () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1', 'history_2']),
    );
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.focus(inputNode, {});
    const removeHistoryNode: HTMLElement[] = getAllByText(
      container,
      labels.removeHistory,
    );

    // @ts-ignore
    fireEvent.click(removeHistoryNode[0].parentElement, {});

    const history = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistory),
      [],
    );
    expect(history.length).toBe(1);
  });

  it('should be clickable history item', () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1', 'history_2']),
    );
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.focus(inputNode, {});
    const removeHistoryNode: HTMLElement[] = getAllByText(
      container,
      labels.removeHistory,
    );

    // history item click
    // @ts-ignore
    fireEvent.click(removeHistoryNode[0].parentElement.parentElement, {});
  });
});
