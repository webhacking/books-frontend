import { act, render, cleanup, fireEvent, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import axios from 'axios';
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { createRouter } from 'next/router';

import Index from 'src/pages/search';

import fixture from './searchResult.fixture.json';

function makeRouter(q: string) {
  return createRouter('/search', { q }, '/search?q=' + encodeURIComponent(q), {});
}

describe('Search Page Test', () => {
  describe('render test', () => {
    let rendered: RenderResult;
    beforeEach(async () => {
      const mockRouter = makeRouter('유유');
      const reducerMock = jest.fn().mockReturnValue({
        account: {},
        books: {},
        categories: {},
        notifications: {},
      });
      const store = createStore(reducerMock);
      (axios as any).__setHandler(() => ({ data: fixture }));
      await act(async () => {
        rendered = render(
          <Provider store={store}>
            <RouterContext.Provider value={mockRouter}>
              <Index />
            </RouterContext.Provider>
          </Provider>
        );
      });
    });
    afterEach(() => {
      act(() => {
        cleanup();
      });
    });

    it('should be render authors`s popular book', () => {
      expect(rendered.getByText(/미남들과 함께 가는 성교육 1화/))
        .toHaveTextContent('<[미즈] 미남들과 함께 가는 성교육 1화> 외 11권');
    });

    it('should be clickable show more authors button', () => {
      const container = rendered.getByText(/명 더 보기/);
      expect(container).not.toBeNull();
      act(() => {
        fireEvent.click(container, {});
      });
      expect(container).toHaveTextContent('접기');
    });

    // Todo 저자가 없을 경우, 도서가 없을 경우
    it.todo('should be render empty state');

    // Todo 페이지네이션 확인
    it.todo('shoud be render last or goto first button');

    it('should be render category tab', () => {
      const container = rendered.getByText(/성공\/삶의자세/);
      expect(container).toHaveTextContent('성공/삶의자세');
    });
  });
});
