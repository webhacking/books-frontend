import * as React from 'react';
import {
  act,
  cleanup,
  createEvent,
  fireEvent,
  render,
  getByText,
} from '@testing-library/react';
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

  describe('cookie', () => {
    let cookieGetSpy: jest.MockInstance<string, []>;
    let cookieSetSpy: jest.MockInstance<void, [string]>;
    beforeEach(() => {
      cookieGetSpy = jest.spyOn(document, 'cookie', 'get');
      cookieSetSpy = jest.spyOn(document, 'cookie', 'set');
    });
    afterEach(() => {
      cookieGetSpy.mockRestore();
      cookieSetSpy.mockRestore();
    });

    it('should set cookie with path=/', () => {
      cookieGetSpy.mockReturnValue('main_genre=romance');
      cookieSetSpy.mockImplementation(cookie => {
        expect(cookie.split(';').map(x => x.trim().toLowerCase()))
          .toContain('path=/');
      });
      const { container } = renderComponent();
      const anchor = container.querySelector('a[href="/"]');
      const anchorClickEvent = createEvent.click(anchor);
      act(() => {
        fireEvent(anchor, anchorClickEvent);
      });
      expect(cookieSetSpy).toHaveBeenCalled();
    });
  });
});
