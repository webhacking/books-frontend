import * as React from 'react';
import { InstantSearch } from 'src/components/Search';
import { render, cleanup, fireEvent, getByText, getByPlaceholderText } from 'react-testing-library';
import 'jest-dom/extend-expect';
// @ts-ignore
import labels from 'src/labels/instantSearch.json';
import keys from 'src/constants/localStorage';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import localStorageKeys from 'src/constants/localStorage';
import { safeJSONParse } from '../../../utils/common';
// import { act } from 'react-dom/test-utils';
// import axiosMock from 'axios';
jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));
jest.mock('server/routes', () => ({ default: {}, Router: { pushRoute: () => null } }));
jest.mock('src/utils/sentry', () => ({ notifySentry: () => null }));

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
    fireEvent.click(inputNode, {});
    const historyNode = getByText(container, labels.turnOffSearchHistory);
    expect(historyNode).not.toBe(null);
    const historyItems = container.getElementsByTagName('li');
    expect(historyItems.length).toBeGreaterThan(1);
    const item = getByText(container, 'history_1');
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
    fireEvent.keyDown(inputNode, { key: 'Down', keyCode: 40, code: 40, charCode: 40, which: 40 });
    fireEvent.keyDown(inputNode, { key: 'Down', keyCode: 40, code: 40, charCode: 40, which: 40 });
    fireEvent.keyDown(inputNode, { key: 'Up', keyCode: 38, code: 38, charCode: 38, which: 38 });
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
    localStorage.setItem(localStorageKeys.instantSearchHistory, 'maybe error be with you');
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
    // const resultNode = getByText(container , 'result');
    // expect(resultNode).not.toBe('a');
  });

  it('should not be render search result', async () => {
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.change(inputNode, { target: { value: 'ㄱ' } });

    // Fixme
    // https://github.com/trojanowski/react-apollo-hooks/issues/84
    // https://github.com/facebook/react/releases/tag/v16.9.0-alpha.0
    await new Promise(resolve => setTimeout(resolve, 301));
    // const resultNode = getByText(container , 'result');
    // expect(resultNode).not.toBe('a');
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

    const history = safeJSONParse(localStorage.getItem(keys.instantSearchHistory), []);
    expect(history).not.toBe([]);
  });

  it('should be remove all search history.', () => {
    localStorage.setItem(localStorageKeys.instantSearchHistory, JSON.stringify(['history_1']));
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.click(inputNode, {});
    const historyClearNode = getByText(container, labels.clearSearchHistory);
    expect(historyClearNode).not.toBe(null);
    fireEvent.click(historyClearNode, {});
    const history = safeJSONParse(localStorage.getItem(localStorageKeys.instantSearchHistory), '');

    expect(history.length).toBe(0);
  });
  it('should be toggle search history', () => {
    localStorage.setItem(localStorageKeys.instantSearchHistory, JSON.stringify(['history_1']));
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.click(inputNode, {});
    const historyToggleNode = getByText(container, labels.turnOffSearchHistory);
    expect(historyToggleNode).not.toBe(null);
    fireEvent.click(historyToggleNode, {});
    const historyOption = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistoryOption),
      'defaultValue',
    );
    expect(historyOption).toBe(false);
    getByText(container, labels.turnOffStatus);

    const historyToggleOnNode = getByText(container, labels.turnOnSearchHistory);
    expect(historyToggleOnNode).not.toBe(null);
    fireEvent.click(historyToggleOnNode, {});
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
    fireEvent.click(inputNode, {});
    const removeHistoryNode: HTMLElement = getByText(container, labels.removeHistory);

    // @ts-ignore
    fireEvent.click(removeHistoryNode.parentElement, {});

    const history = safeJSONParse(localStorage.getItem(localStorageKeys.instantSearchHistory), []);
    expect(history.length).toBe(1);
  });

  it('should be clickable history item', () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1', 'history_2']),
    );
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    fireEvent.click(inputNode, {});
    const removeHistoryNode: HTMLElement = getByText(container, labels.removeHistory);

    // history item click
    // @ts-ignore
    fireEvent.click(removeHistoryNode.parentElement.parentElement, {});
  });
});
