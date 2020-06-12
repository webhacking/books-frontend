import * as React from 'react';
import Index from 'src/pages/notification';
import makeStore from 'src/store/config';

import { act, render, cleanup, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

jest.mock('src/hooks/useNotification', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => {
      const [unreadCount, setUnreadCount] = React.useState();
      const [items, setItems] = React.useState();
      return {
        unreadCount,
        items,
        async requestFetchUnreadCount() {
          await new Promise(resolve => setTimeout(resolve, 0));
          setUnreadCount(1);
        },
        async requestFetchNotifications() {
          await new Promise(resolve => setTimeout(resolve, 0));
          setUnreadCount(1);
          setItems([
            {
              landingUrl: '/',
              expireAt: 15151515151515,
              imageUrl: '/img.img',
              imageType: 'book',
              createdAt: 151515151510,
              userIdx: 5,
              message: '알림입니다.',
              tag: 'tag',
              id: '2',
              itemId: '5',
              strCreatedAt: '20200101',
            },
            {
              landingUrl: '/',
              expireAt: 15151515151515,
              imageUrl: '/img.img',
              imageType: 'book',
              createdAt: 151515151510,
              userIdx: 5,
              message: '알림입니다.',
              tag: 'tag',
              id: '2',
              itemId: '5',
              strCreatedAt: '20200101',
            },
            {
              landingUrl: '/',
              expireAt: 15151515151515,
              imageUrl: '/img.img',
              imageType: 'book',
              createdAt: 151515151510,
              userIdx: 5,
              message: '알림입니다.',
              tag: 'tag',
              id: '2',
              itemId: '5',
              strCreatedAt: '20200101',
            },
            {
              landingUrl: '/',
              expireAt: 15151515151515,
              imageUrl: '/img.img',
              imageType: 'book',
              createdAt: 151515151510,
              userIdx: 5,
              message: '최고의 알림',
              tag: 'tag',
              id: '2',
              itemId: '5',
              strCreatedAt: '20200101',
            },
          ]);
        },
      };
    },
  };
});

jest.useFakeTimers();

afterAll(() => {
  cleanup();
});

it('should render correctly', async () => {
  let renderResult: RenderResult;
  act(() => {
    renderResult = render(<Index />);
  });
  expect(renderResult.getAllByText(/알림/)[0]).toHaveTextContent('알림');
  const items = renderResult.container.querySelectorAll('[class*="NotificationPlaceholderWrap"]');
  // placeholder 개수
  expect(items.length).toBe(5);

  await act(async () => {
    jest.runAllTimers();
  });
  expect(renderResult.getAllByText(/최고의/)[0]).toHaveTextContent('최고의 알림');
});
