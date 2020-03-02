import * as React from 'react';
import Index from 'src/pages/notification';
import { Provider } from 'react-redux';
import makeStore from 'src/store/config';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { appStateInitialState } from 'src/services/app/reducer';

const store = makeStore(
  {
    app: appStateInitialState,
    account: {
      loggedUser: null,
    },
    books: {
      isFetching: false,
      items: {},
    },
    categories: {
      isFetching: false,
      items: {},
    },
    notifications: {
      hasNotification: true,
      isLoaded: true,
      unreadCount: 10,
      items: [],
    },
  },
  { asPath: 'test', isServer: false },
);
afterEach(cleanup);

test('should be render Index Component', async () => {
  // @ts-ignore

  const { getAllByText } = render(
    <Provider store={store}>
      <Index />
    </Provider>,
  );

  expect(getAllByText(/알림/)[0]).toHaveTextContent('알림');
});

test('should be render placeholder', async () => {
  // @ts-ignore

  const { getAllByText, container } = render(
    <Provider store={store}>
      <Index />
    </Provider>,
  );
  const items = container.querySelectorAll('[class*="NotificationPlaceholderWrap"]');
  // placeholder 개수
  expect(items.length).toBe(5);
});

const notificationStore = makeStore(
  {
    app: appStateInitialState,
    account: {
      loggedUser: null,
    },
    books: {
      isFetching: false,
      items: {},
    },
    categories: {
      isFetching: false,
      items: {},
    },
    notifications: {
      hasNotification: true,
      isLoaded: true,
      unreadCount: 1,
      items: [
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
      ],
    },
  },
  { asPath: 'test', isServer: false },
);


test('should be render notification item', async () => {
  // @ts-ignore

  const { getAllByText } = render(
    <Provider store={notificationStore}>
      <Index />
    </Provider>,
  );
  expect(getAllByText(/최고의/)[0]).toHaveTextContent('최고의 알림');
});
