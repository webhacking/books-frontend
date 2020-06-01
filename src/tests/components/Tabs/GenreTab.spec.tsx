import * as React from 'react';
import {
  act,
  cleanup,
  createEvent,
  fireEvent,
  render,
  getByText,
  RenderResult,
} from '@testing-library/react';

import { GenreTab } from 'src/components/Tabs';
import * as labels from 'src/labels/common.json';

jest.mock('next/router', () => {
  const router = {
    asPath: '/',
    pathname: '/[genre]',
    query: {
      genre: 'general',
    },
    events: {
      on() {},
      off() {},
    },
    preload() {},
  };
  return {
    __esModule: true,
    default: router,
    useRouter: () => router,
  };
});

describe('GenreTab test', () => {
  let renderResult: RenderResult;

  beforeEach(async () => {
    await act(async () => {
      renderResult = render(
        <GenreTab currentGenre="fantasy" />
      );
    });
  });

  afterEach(async () => {
    await act(async () => {
      cleanup();
    });
  });

  it('should be render GenreTab component', () => {
    expect(getByText(renderResult.container, labels.category)).not.toBeNull();
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
      const anchor = renderResult.container.querySelector('a[href="/"]');
      const anchorClickEvent = createEvent.click(anchor);
      act(() => {
        fireEvent(anchor, anchorClickEvent);
      });
      expect(cookieSetSpy).toHaveBeenCalled();
    });
  });
});
