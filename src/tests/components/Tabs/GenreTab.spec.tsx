import * as React from 'react';
import { cleanup, render, getByText } from '@testing-library/react';
import { GenreTab } from 'src/components/Tabs';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import * as labels from 'src/labels/common.json';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { createRouter } from 'next/router';
const router = createRouter('/', { genre: 'general' }, '', {
  subscription: jest.fn(),
  initialProps: {},
  pageLoader: jest.fn(),
  App: jest.fn(),
  Component: jest.fn(),
  isFallback: false,
  wrapApp: jest.fn(),
});

afterEach(cleanup);

const renderComponent = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <RouterContext.Provider value={{ asPath: '/bl', query: { pathname: '/'}}}>
        <GenreTab currentGenre={'fantasy'} />
      </RouterContext.Provider>
    </ThemeProvider>,
  );

describe('GenreTab test', () => {
  it('should be render GenreTab component', () => {
    const { container } = renderComponent();
    expect(container).not.toBe(null);
  });
  it('should be render sub service', () => {
    const { container } = renderComponent();
    const categoryNode = getByText(container, labels.category);
    expect(categoryNode).not.toBe(null);
  });
});
