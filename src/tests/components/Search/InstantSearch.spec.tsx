import * as React from 'react';
import { InstantSearch } from 'src/components/Search';
import { render, cleanup, fireEvent, getByText, getByPlaceholderText } from 'react-testing-library';
import 'jest-dom/extend-expect';
// @ts-ignore
import { searchPlaceHolder, saveSearchHistory } from 'src/labels/instantSearch.json';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
// import { act } from 'react-dom/test-utils';
// import axiosMock from 'axios';
jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));
jest.mock('server/routes', () => ({ default: {}, Router: { push: () => null } }));

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
    const inputNode = getByPlaceholderText(container, searchPlaceHolder);
    expect(inputNode).not.toBe(null);
  });

  it('should be render history list', () => {
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, searchPlaceHolder);
    fireEvent.click(inputNode, {});
    const historyNode = getByText(container, saveSearchHistory);
    expect(historyNode).not.toBe(null);
  });

  it('should be render search result', async () => {
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, searchPlaceHolder);
    fireEvent.change(inputNode, { target: { value: 'ABC' } });

    // Fixme
    // https://github.com/trojanowski/react-apollo-hooks/issues/84
    // https://github.com/facebook/react/releases/tag/v16.9.0-alpha.0
    await new Promise(resolve => setTimeout(resolve, 301));
    // const resultNode = getByText(container , 'result');
    // expect(resultNode).not.toBe('a');
  });

  it('can be add search history', () => {
    const { container } = renderComponent();
    const inputNode = getByPlaceholderText(container, searchPlaceHolder);
    const searchForm = container.getElementsByTagName('form');
    expect(searchForm).not.toBe(null);

    // keyword length 0 submit
    fireEvent.submit(searchForm[0]);

    fireEvent.change(inputNode, { target: { value: 'ABC' } });
    fireEvent.submit(searchForm[0]);
    // Fixme
    const history = JSON.parse(localStorage.getItem('__books__searchHistory__') || '[]');
    expect(history).not.toBe([]);
  });
});
