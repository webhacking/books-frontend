import { getByLabelText, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import { css } from '@emotion/core';
import { getMaxDiscountPercentage } from 'src/utils/common';
import React from 'react';
import { DisplayType } from 'src/types/sections';
// @ts-ignore

const books = [
  {
    id: '425141571',
    title: { main: '천재배우의 아우라Aura 10권' },
    thumbnail: {
      small: 'https://img.ridicdn.net/cover/425141571/small',
      large: 'https://img.ridicdn.net/cover/425141571/large',
      xxlarge: 'https://img.ridicdn.net/cover/425141571/xxlarge',
    },
    categories: [
      {
        id: 1713,
        name: '현대 판타지',
        genre: 'fantasy',
        sub_genre: 'fantasy',
        is_series_category: true,
      },
    ],
    price_info: {
      buy: { regular_price: 3200, price: 2880, discount_percentage: 10 },
    },
    series: {
      id: '425141562',
      volume: 10,
      property: {
        last_volume_id: '425141571',
        opened_last_volume_id: '425141571',
        title: '천재배우의 아우라Aura',
        unit: '권',
        opened_book_count: 10,
        total_book_count: 10,
        is_serial: false,
        is_completed: false,
        is_comic_hd: false,
        is_serial_complete: false,
        is_wait_free: false,
      },
      price_info: {
        buy: {
          total_book_count: 10,
          free_book_count: 1,
          regular_price: 28800,
          price: 25920,
          discount_percentage: 0,
        },
      },
    },
    authors: [{ name: '글술술', id: 101878, role: 'author' }],
    file: {
      size: 1000,
      format: 'epub',
      is_drm_free: false,
      is_comic: false,
      is_webtoon: false,
      is_manga: false,
      is_comic_hd: false,
      character_count: 104942,
    },
    property: {
      is_novel: false,
      is_magazine: false,
      is_adult_only: false,
      is_new_book: true,
      is_open: true,
      is_somedeal: false,
      is_trial: false,
      preview_rate: 10,
      preview_max_characters: 10494,
    },
    support: {
      android: true,
      ios: true,
      mac: true,
      paper: true,
      windows: true,
      web_viewer: false,
    },
    publish: {
      ridibooks_register: '2019-12-18T14:22:02+09:00',
      ebook_publish: '2019-12-24T00:00:00+09:00',
      ridibooks_publish: '2019-12-24T00:20:29+09:00',
    },
    publisher: { id: 425, name: '문피아', cp_name: '문피아_E/P' },
    last_modified: '2019-12-24T12:12:44+09:00',
  },
  {
    id: '425141562',
    title: { main: '천재배우의 아우라Aura 1권' },
    thumbnail: {
      small: 'https://img.ridicdn.net/cover/425141562/small',
      large: 'https://img.ridicdn.net/cover/425141562/large',
      xxlarge: 'https://img.ridicdn.net/cover/425141562/xxlarge',
    },
    categories: [
      {
        id: 1713,
        name: '현대 판타지',
        genre: 'fantasy',
        sub_genre: 'fantasy',
        is_series_category: true,
      },
    ],
    price_info: { buy: { regular_price: 0, price: 0, discount_percentage: 0 } },
    series: {
      id: '425141562',
      volume: 1,
      property: {
        last_volume_id: '425141571',
        opened_last_volume_id: '425141571',
        title: '천재배우의 아우라Aura',
        unit: '권',
        opened_book_count: 10,
        total_book_count: 10,
        is_serial: false,
        is_completed: false,
        is_comic_hd: false,
        is_serial_complete: false,
        is_wait_free: false,
        next_preview_b_id: '425141563',
      },
      price_info: {
        buy: {
          total_book_count: 10,
          free_book_count: 1,
          regular_price: 28800,
          price: 25920,
          discount_percentage: 0,
        },
      },
    },
    authors: [{ name: '글술술', id: 101878, role: 'author' }],
    file: {
      size: 1013,
      format: 'epub',
      is_drm_free: false,
      is_comic: false,
      is_webtoon: false,
      is_manga: false,
      is_comic_hd: false,
      character_count: 113466,
    },
    property: {
      is_novel: false,
      is_magazine: false,
      is_adult_only: false,
      is_new_book: true,
      is_open: true,
      is_somedeal: false,
      is_trial: false,
      preview_rate: 100,
      preview_max_characters: 113466,
    },
    support: {
      android: true,
      ios: true,
      mac: true,
      paper: true,
      windows: true,
      web_viewer: false,
    },
    publish: {
      ridibooks_register: '2019-12-18T14:20:01+09:00',
      ebook_publish: '2019-12-24T00:00:00+09:00',
      ridibooks_publish: '2019-12-24T00:19:20+09:00',
    },
    publisher: { id: 425, name: '문피아', cp_name: '문피아_E/P' },
    last_modified: '2019-12-24T12:12:47+09:00',
  },
];

const renderBadge = book =>
  render(
    <BookBadgeRenderer
      type={DisplayType.AiRecommendation}
      isWaitFree={book.series?.property.is_wait_free}
      // @ts-ignore
      discountPercentage={getMaxDiscountPercentage(book)}
    />,
  );

describe('test BoodBadgeRenderer', () => {
  it('should be render discountBadge', () => {
    const { container } = renderBadge(books[0]);
    const itemNode = getByLabelText(container, '10% 할인');
    expect(itemNode).not.toBe(null);
  });
});
