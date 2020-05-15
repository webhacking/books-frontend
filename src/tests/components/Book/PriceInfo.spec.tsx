import * as React from 'react';
import { getByText, render } from '@testing-library/react';
import { PriceInfo } from 'src/components/Book/SearchLandscapeBook';
import * as SearchTypes from 'src/types/searchResults';
import * as BookApi from 'src/types/book';
import { AuthorRole } from 'src/types/book';
import '@testing-library/jest-dom/extend-expect';

// rental 1,900
// buy 12,800
const searchApiPriceExistFixture = {
  bookApiResult: {
    clientBookFields: {
      isAvailableSelect: false,
      isAlreadyCheckedAtSelect: false,
    },
    id: '1962071472',
    title: { main: '\ud669\uc81c\uc758 \ub538 : \ub4a4\ubc14\ub010 \uc6b4\uba85 2' },
    thumbnail: {
      small: 'https://img.ridicdn.net/cover/1962071472/small',
      large: 'https://img.ridicdn.net/cover/1962071472/large',
      xxlarge: 'https://img.ridicdn.net/cover/1962071472/xxlarge',
    },
    categories: [
      {
        id: 117,
        name: '\uc911\uad6d \uc18c\uc124',
        genre: 'general',
        sub_genre: 'general',
        is_series_category: false,
      },
    ],
    price_info: {
      buy: { regular_price: 12800, price: 12800, discount_percentage: 0 },
      rent: { regular_price: 1900, price: 1900, rent_days: 90, discount_percentage: 0 },
    },
    series: {
      id: '1962070867',
      volume: 2,
      property: {
        last_volume_id: '1962071472',
        opened_last_volume_id: '1962071472',
        title: '\ud669\uc81c\uc758 \ub538',
        unit: '\uad8c',
        opened_book_count: 2,
        total_book_count: 2,
        is_serial: false,
        is_completed: false,
        is_comic_hd: false,
        is_serial_complete: false,
        is_wait_free: false,
      },
      price_info: {
        buy: {
          total_book_count: 2,
          free_book_count: 0,
          regular_price: 25600,
          price: 25600,
          discount_percentage: 0,
        },
        rent: {
          total_book_count: 2,
          free_book_count: 0,
          regular_price: 3800,
          rent_price: 3800,
          discount_percentage: 0,
          rent_days: 180,
        },
      },
    },
    authors: [{ name: '\uacbd\uc694', role: AuthorRole.AUTHOR, id: 1 }],
    file: {
      size: 679,
      format: 'epub',
      is_drm_free: false,
      is_comic: false,
      is_webtoon: false,
      is_manga: false,
      is_comic_hd: false,
      character_count: 201204,
    },
    property: {
      is_novel: true,
      is_magazine: false,
      is_adult_only: false,
      is_new_book: true,
      is_open: true,
      is_somedeal: false,
      is_trial: false,
      preview_rate: 7,
      preview_max_characters: 14084,
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
      ridibooks_register: '2020-04-29T18:21:09+09:00',
      ebook_publish: '2020-05-04T00:00:00+09:00',
      ridibooks_publish: '2020-05-04T00:02:29+09:00',
    },
    publisher: {
      id: 1962,
      name: '\ub3c4\uc11c\ucd9c\ud310 \ud64d',
      cp_name: '\uc5e0\uc2a4\ud1a0\ub9ac\ud5c8\ube0c_E/P/J',
    },
    last_modified: '2020-05-04T00:02:44+09:00',
  },
  searchApiResult: {
    parent_category_name2: null,
    buyer_rating_score: 4.4,
    category_name: '중국 소설',
    is_series_complete: false,
    is_serial: 0,
    events_info: [],
    translator: '',
    category_name2: null,
    tags_info: [],
    series_prices_info: [
      {
        series_arg: 0,
        total_regular_price: 25600,
        total_price: 25600,
        type: 'normal',
        free_book_count: 0,
        series_id: '1962070867',
        regular_price: 0,
        max_price: 12800,
        book_count: 2,
        min_price: 12800,
        arg: 0,
        min_nonzero_price: 12800,
        series_discount_rate: 0,
      },
      {
        series_arg: 90,
        total_regular_price: 25600,
        total_price: 3800,
        type: 'rent',
        free_book_count: 0,
        series_id: '1962070867',
        regular_price: 0,
        max_price: 1900,
        book_count: 2,
        min_price: 1900,
        arg: 90,
        min_nonzero_price: 1900,
        series_discount_rate: 0,
      },
    ],
    title: '황제의 딸 : 뒤바뀐 운명 2',
    book_count: 2,
    web_title: '',
    price: 12800,
    parent_category: 100,
    buyer_rating_count: 5,
    web_title_title: ' 황제의 딸 : 뒤바뀐 운명 2',
    category2: 0,
    sub_title: '',
    prices_info: [
      {
        price: 12800,
        arg: 0,
        type: 'normal',
      },
      {
        price: 1900,
        arg: 90,
        type: 'rent',
      },
    ],
    author: '경요',
    setbook_count: 1,
    age_limit: 0,
    is_wait_free: false,
    parent_category2: 0,
    is_rental: true,
    author2: '',
    opened_last_volume_id: '1962071472',
    b_id: '1962071472',
    is_setbook: false,
    buyer_review_count: 0,
    parent_category_name: '소설',
    publisher: '도서출판 홍',
    category: 117,
    authors_info: [],
    desc:
      "<b>&lt;책소개&gt;</b>\n\n전설의 중국드라마 &lt;환주격격&gt; 국내 최초 정식 한국어판 소설\r\n\r\n따뜻한 마음을 가지고 의리로 똘똘 뭉친 청나라 청춘 남녀\r\n그들의 사랑과 우정, 가족애를 그려낸 대서사!\r\n\r\n● 중국 방영 당시 최고 시청률 62.8% 돌파\r\n중국 드라마 역사상 전무후무한 기록\r\n\r\n● 방영 후 중화권을 넘어 전 세계를 휩쓸었던 드라마\r\n\r\n● 중국의 진정한 국민드라마\r\n중국에선 여름방학 때마다 재방송, 재방송 시청률도 1위\r\n\r\n● 한 시대를 대표하는 하나의 문화 콘텐츠.\r\n'환주격격' 방영 당시를 배경으로 하는\r\n중국드라마 &lt;치",
    _score: 1141.903,
    highlight: {
      web_title_title:
        ' <strong class="title_point">황제</strong><strong class="title_point">의</strong> <strong class="title_point">딸</strong> : 뒤바뀐 운명 2',
    },
  },
};

// free
const trialBookFixture = {
  bookApiResult: {
    id: '1508001144',
    title: {
      main: '[\uccb4\ud5d8\ud310] \uc0bc\uc2ed\uc721\uacc4 1 \ub9cc\ucc9c\uacfc\ud574',
      sub: '1\ubd80 \uc2b9\uc804\uacc4',
    },
    thumbnail: {
      small: 'https://img.ridicdn.net/cover/1508001144/small',
      large: 'https://img.ridicdn.net/cover/1508001144/large',
      xxlarge: 'https://img.ridicdn.net/cover/1508001144/xxlarge',
    },
    categories: [
      {
        id: 117,
        name: '\uc911\uad6d \uc18c\uc124',
        genre: 'general',
        sub_genre: 'general',
        is_series_category: false,
      },
      {
        id: 119,
        name: '\ud574\uc678 \uc5ed\uc0ac\uc18c\uc124',
        genre: 'general',
        sub_genre: 'general',
        is_series_category: false,
      },
    ],
    price_info: {
      paper: { price: 0 },
      buy: { regular_price: 0, price: 0, discount_percentage: 0 },
    },
    series: {
      id: '1508004029',
      volume: 10000,
      property: {
        last_volume_id: '160000144',
        opened_last_volume_id: '160000144',
        title: '\uc0bc\uc2ed\uc721\uacc4',
        unit: '\uad8c',
        opened_book_count: 37,
        total_book_count: 73,
        is_serial: false,
        is_completed: true,
        is_comic_hd: false,
        is_serial_complete: true,
        is_wait_free: false,
        next_preview_b_id: '',
      },
      price_info: {
        buy: {
          total_book_count: 36,
          free_book_count: 0,
          regular_price: 144000,
          price: 144000,
          discount_percentage: 0,
        },
      },
    },
    authors: [
      { name: '\ub9c8\uc11c\ud718', id: 1741, role: AuthorRole.AUTHOR },
      { name: '\uae40\ucc2c\uc5f0', id: 1733, role: AuthorRole.TRANSLATOR },
    ],
    file: {
      size: 502,
      format: 'epub',
      is_drm_free: false,
      is_comic: false,
      is_webtoon: false,
      is_manga: false,
      is_comic_hd: false,
      character_count: 97276,
    },
    property: {
      is_novel: true,
      is_magazine: false,
      is_adult_only: false,
      is_new_book: false,
      is_open: true,
      is_somedeal: false,
      is_trial: true,
      review_display_id: '1508000962',
      preview_rate: 100,
      preview_max_characters: 97276,
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
      ridibooks_register: '2015-02-13T17:52:14+09:00',
      ebook_publish: '2007-07-05T00:00:00+09:00',
      ridibooks_publish: '2015-02-16T18:52:16+09:00',
    },
    publisher: {
      id: 1508,
      name: '\ubc18\ub514\ucd9c\ud310\uc0ac',
      cp_name: '\ub9ac\ub514\ubd81\uc2a4_\ud504\ub85c\ubaa8\uc158\uc6a9',
    },
    last_modified: '2020-01-23T00:05:45+09:00',
    clientBookFields: {
      isAvailableSelect: false,
      isAlreadyCheckedAtSelect: false,
    },
  },
  searchApiResult: {
    parent_category_name2: '소설',
    buyer_rating_score: 0.0,
    category_name: '중국 소설',
    is_series_complete: true,
    is_serial: 0,
    events_info: [],
    translator: '김찬연',
    category_name2: '해외 역사소설',
    tags_info: [],
    series_prices_info: [
      {
        series_arg: 0,
        total_regular_price: 144000,
        total_price: 144000,
        type: 'normal',
        free_book_count: 1,
        series_id: '1508004029',
        regular_price: 0,
        max_price: 4000,
        book_count: 37,
        min_price: 0,
        arg: 0,
        min_nonzero_price: 4000,
        series_discount_rate: 0,
      },
    ],
    title: '[체험판] 삼십육계 1 만천과해',
    book_count: 37,
    web_title: '',
    price: 0,
    parent_category: 100,
    buyer_rating_count: 0,
    web_title_title: ' [체험판] 삼십육계 1 만천과해',
    category2: 119,
    sub_title: '1부 승전계',
    prices_info: [
      {
        price: 0,
        arg: 0,
        type: 'normal',
      },
    ],
    author: '마서휘',
    setbook_count: 1,
    age_limit: 0,
    is_wait_free: false,
    parent_category2: 100,
    is_rental: false,
    author2: ', 마서휘',
    opened_last_volume_id: '1508001144',
    b_id: '1508001144',
    is_setbook: false,
    buyer_review_count: 0,
    parent_category_name: '소설',
    publisher: '반디출판사',
    category: 117,
    authors_info: [
      {
        role: AuthorRole.TRANSLATOR,
        name: '김찬연',
        author_id: 1733,
        native_name: '',
        order: 0,
      },
      {
        role: AuthorRole.AUTHOR,
        name: '마서휘',
        author_id: 1741,
        native_name: '馬書輝',
        order: 1,
      },
    ],
    desc:
      '<b>&lt;책소개&gt;</b>\n\n대표적인 중국 역사와 사건 속에서 뽑은 36가지 책략을, 역사소설의 형식으로 담아낸 소설 『삼십육계』제1부 승전계 "만천과해"편. 등장인물들은 때와 세를 살피고 지피지기하여 적합한 생존전략을 찾아낸 임기응변의 지략가들이며, 삼십육계를 이루는 일계 일계는 모두 하나의 방향을 제시하고 있는 일종의 전략지도이다.\r\n\r\n작가는 수많은 인물들의 서로 다른 마음의 소리와 가치관과 행위를 살피고, 각 인물들의 행위에 대한 진정한 주관적 원인과 객관적 의거가 무엇이었는가를 보여준다. 계모의 생성, 계를 꾸미는 자의 기도와 결단, 계에 빠지는 자의',
    _score: 2387.4387,
    highlight: {
      web_title_title:
        ' [<strong class="title_point">체험</strong><strong class="title_point">판</strong>] 삼십육계 1 만천과해',
    },
  },
};

// free
const freeBookFixture: Fixture = {
  bookApiResult: {
    clientBookFields: {
      isAvailableSelect: false,
      isAlreadyCheckedAtSelect: false,
    },
    id: '111011502',
    title: { main: '\u00c2mona; The Child; And The Beast; And Others' },
    thumbnail: {
      small: 'https://img.ridicdn.net/cover/111011502/small',
      large: 'https://img.ridicdn.net/cover/111011502/large',
      xxlarge: 'https://img.ridicdn.net/cover/111011502/xxlarge',
    },
    categories: [
      {
        id: 1400,
        name: '\ud574\uc678\ub3c4\uc11c',
        genre: 'general',
        sub_genre: 'general',
        is_series_category: false,
      },
    ],
    price_info: {
      paper: { price: 0 },
      buy: { regular_price: 0, price: 0, discount_percentage: 0 },
    },
    authors: [{ name: '\ub8e8\uc774 \ubca1', id: 26030, role: AuthorRole.AUTHOR }],
    file: {
      size: 784,
      format: 'epub',
      is_drm_free: false,
      is_comic: false,
      is_webtoon: false,
      is_manga: false,
      is_comic_hd: false,
      character_count: 54130,
    },
    property: {
      is_novel: false,
      is_magazine: false,
      is_adult_only: false,
      is_new_book: false,
      is_open: true,
      is_somedeal: false,
      is_trial: false,
      preview_rate: 100,
      preview_max_characters: 54130,
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
      ridibooks_register: '2013-04-12T10:34:38+09:00',
      ridibooks_publish: '2013-04-16T11:51:34+09:00',
    },
    publisher: {
      id: 111,
      name: 'Public Domain Books',
      cp_name: '\ub9ac\ub514\ubd81\uc2a4',
    },
    last_modified: '2019-04-09T12:09:05+09:00',
  },
  searchApiResult: {
    parent_category_name2: null,
    buyer_rating_score: 0.0,
    category_name: '해외도서',
    is_series_complete: false,
    is_serial: 0,
    translator: '',
    tags_info: [],
    series_prices_info: [],
    title: 'Âmona; The Child; And The Beast; And Others',
    book_count: 1,
    web_title: '',
    price: 0,
    parent_category: 0,
    buyer_rating_count: 0,
    web_title_title: ' Âmona; The Child; And The Beast; And Others',
    category2: 0,
    sub_title: '',
    prices_info: [
      {
        price: 0,
        arg: 0,
        type: 'normal',
      },
    ],
    author: '루이 벡',
    setbook_count: 1,
    age_limit: 0,
    is_wait_free: false,
    parent_category2: 0,
    is_rental: false,
    author2: '',
    opened_last_volume_id: '',
    b_id: '111011502',
    is_setbook: false,
    buyer_review_count: 0,
    parent_category_name: null,
    publisher: 'Public Domain Books',
    category: 1400,
    authors_info: [
      {
        role: AuthorRole.AUTHOR,
        name: '루이 벡',
        author_id: 26030,
        alias_name: 'Louis Becke',
        native_name: 'Louis Becke',
        order: 0,
      },
    ],
    desc:
      '<b>&lt;책소개&gt;</b>\n\n* 이 책은 Public Domain Books 입니다. Public Domain Books란 저작자 사후 일정 기간이 경과하여 저작권이 만료된 책을 의미합니다. 회원님께서는 인터넷 상의 기타 사이트를 통해서 이 책을 찾아보실 수도 있습니다.',
    _score: 544.4475,
    highlight: {
      web_title_title:
        ' Âmona; <strong class="title_point">The</strong> <strong class="title_point">Child</strong>; <strong class="title_point">And</strong> <strong class="title_point">The</strong> <strong class="title_point">Beast</strong>; <strong class="title_point">And</strong> <strong class="title_point">Others</strong>',
    },
  },
};

// search-api price = 0 그러나 가격 정보 표시 되어야 함
const priceZeroFixture: Fixture = {
  bookApiResult: {
    clientBookFields: {
      isAvailableSelect: false,
      isAlreadyCheckedAtSelect: false,
    },
    id: '425075229',
    title: {
      main: '\uc804\uc9c0\uc801 \ub3c5\uc790 \uc2dc\uc810 1\ud654',
      prefix: '[\uc5f0\uc7ac]',
    },
    thumbnail: {
      small: 'https://img.ridicdn.net/cover/425075229/small',
      large: 'https://img.ridicdn.net/cover/425075229/large',
      xxlarge: 'https://img.ridicdn.net/cover/425075229/xxlarge',
    },
    categories: [
      {
        id: 1753,
        name: '\ud604\ub300 \ud310\ud0c0\uc9c0',
        genre: 'fantasy',
        sub_genre: 'fantasy_serial',
        is_series_category: true,
      },
    ],
    price_info: { buy: { regular_price: 0, price: 0, discount_percentage: 0 } },
    series: {
      id: '425075229',
      volume: 1,
      property: {
        last_volume_id: '425148663',
        opened_last_volume_id: '425148663',
        title: '\uc804\uc9c0\uc801 \ub3c5\uc790 \uc2dc\uc810',
        unit: '\ud654',
        opened_book_count: 551,
        total_book_count: 551,
        is_serial: true,
        is_completed: true,
        is_comic_hd: false,
        is_serial_complete: true,
        is_wait_free: false,
        prev_books: [],
        next_books: { '425075230': { b_id: '425075230', is_opened: true } },
      },
      price_info: {
        buy: {
          total_book_count: 551,
          free_book_count: 25,
          regular_price: 52600,
          price: 52600,
          discount_percentage: 0,
        },
      },
    },
    authors: [{ name: '\uc2f1\uc211', id: 72276, role: AuthorRole.AUTHOR }],
    file: {
      size: 1877,
      format: 'epub',
      is_drm_free: false,
      is_comic: false,
      is_webtoon: false,
      is_manga: false,
      is_comic_hd: false,
      character_count: 2595,
    },
    property: {
      is_novel: false,
      is_magazine: false,
      is_adult_only: false,
      is_new_book: false,
      is_open: true,
      is_somedeal: false,
      is_trial: false,
      preview_rate: 0,
    },
    support: {
      android: true,
      ios: true,
      mac: true,
      paper: true,
      windows: true,
      web_viewer: true,
    },
    publish: {
      ridibooks_register: '2018-06-15T13:54:02+09:00',
      ebook_publish: '2018-06-15T00:00:00+09:00',
      ridibooks_publish: '2018-06-22T00:02:36+09:00',
    },
    publisher: { id: 425, name: '\ubb38\ud53c\uc544', cp_name: '\ubb38\ud53c\uc544_E/P' },
    last_modified: '2020-05-12T11:22:46+09:00',
  },
  searchApiResult: {
    parent_category_name2: null,
    buyer_rating_score: 4.8,
    category_name: '현대 판타지',
    is_series_complete: true,
    is_serial: 1,
    translator: '',
    tags_info: [],
    series_prices_info: [
      {
        series_arg: 0,
        total_regular_price: 52600,
        total_price: 52600,
        type: 'normal',
        free_book_count: 25,
        series_id: '425075229',
        regular_price: 0,
        max_price: 100,
        book_count: 551,
        min_price: 0,
        arg: 0,
        min_nonzero_price: 100,
        series_discount_rate: 0,
      },
    ],
    title: '전지적 독자 시점',
    book_count: 551,
    web_title: '[연재]',
    price: 0,
    parent_category: 1750,
    buyer_rating_count: 11175,
    web_title_title: '[연재] 전지적 독자 시점',
    category2: 0,
    sub_title: '',
    prices_info: [
      {
        price: 0,
        arg: 0,
        type: 'normal',
      },
    ],
    author: '싱숑',
    setbook_count: 1,
    age_limit: 0,
    is_wait_free: false,
    parent_category2: 0,
    is_rental: false,
    author2: '',
    opened_last_volume_id: '425148663',
    b_id: '425075229',
    is_setbook: false,
    buyer_review_count: 2514,
    parent_category_name: '판타지 연재',
    publisher: '문피아',
    category: 1753,
    authors_info: [
      {
        role: AuthorRole.AUTHOR,
        name: '싱숑',
        author_id: 72276,
        native_name: '',
        order: 0,
      },
    ],
    desc: '<b>&lt;책소개&gt;</b>\n\n오직 나만이, 이 세계의 결말을 알고 있다.',
    _score: 2177.294,
    highlight: {
      web_title_title:
        '[연재] <strong class="title_point">전지</strong><strong class="title_point">적</strong> 독자 시점',
    },
  },
};

interface Fixture {
  searchApiResult: SearchTypes.SearchBookDetail;
  bookApiResult: BookApi.ClientBook;
}

function renderPriceInfo(fixture: Fixture, genre = '') {
  return render(
    <PriceInfo
      searchApiResult={fixture.searchApiResult}
      bookApiResult={fixture.bookApiResult}
      genre={genre}
    />,
  );
}

describe('PriceInfo test', () => {
  test('trial free book render', () => {
    const { container } = renderPriceInfo(trialBookFixture);
    expect(container.textContent).toBe('구매무료 ');
  });

  test('free book render', () => {
    const { container } = renderPriceInfo(freeBookFixture);
    expect(container.textContent).toBe('구매무료 ');
  });

  test('rental, buy price render', () => {
    const { container } = renderPriceInfo(searchApiPriceExistFixture);
    expect(container.textContent).toBe('대여1,900원 구매12,800원 ');
  });
  test('render correct rental & buy price', () => {
    const { container } = renderPriceInfo(priceZeroFixture);
    expect(container.textContent).toBe('구매100원 ');
  });
});
