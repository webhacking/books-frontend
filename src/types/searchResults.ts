import * as R from 'runtypes';

import Sentry from 'src/utils/sentry';

const RAuthor = R.Record({
  popular_book_title: R.String,
  book_count: R.Number,
  name: R.String,
  id: R.Number,
  highlight: R.Partial({
    name: R.String,
  }),
});
export type Author = R.Static<typeof RAuthor>;

const RAuthorResultBase = R.Record({
  authors: R.Array(RAuthor),
});
const RAuthorResult = RAuthorResultBase.And(
  R.Record({
    total: R.Number,
  }),
);
export type AuthorResult = R.Static<typeof RAuthorResult>;

const RAggregation = R.Record({
  category_id: R.Number,
  category_name: R.String,
  doc_count: R.Number,
});
export type Aggregation = R.Static<typeof RAggregation>;

const RTag = R.Record({
  tag_name: R.String,
  tag_id: R.Number,
});
export type Tag = R.Static<typeof RTag>;

const RSeriesPriceInfo = R.Record({
  series_arg: R.Number,
  total_regular_price: R.Number,
  total_price: R.Number,
  type: R.String, // ex('normal' | ... )
  free_book_count: R.Number,
  series_id: R.String,
  regular_price: R.Number,
  max_price: R.Number,
  book_count: R.Number,
  min_price: R.Number,
  arg: R.Number,
  min_nonzero_price: R.Number,
  series_discount_rate: R.Number,
});
export type SeriesPriceInfo = R.Static<typeof RSeriesPriceInfo>;

const RAuthorsInfo = R.Record({
  role: R.String,
  name: R.String,
  author_id: R.Number,
  order: R.Number,
}).And(
  R.Partial({
    native_name: R.String,
    alias_name: R.String,
  }),
);
export type AuthorsInfo = R.Static<typeof RAuthorsInfo>;

const RHighlightInfo = R.Partial({
  web_title_title: R.String, // todo escaping
  sub_title: R.String, // todo escaping
  author: R.String, // todo escaping
  author2: R.String, // todo escaping
  translator: R.String, // todo escaping
  publisher: R.String, // todo escaping
});
export type HighlightInfo = R.Static<typeof RHighlightInfo>;

const REventInfo = R.Record({
  event_subgroup_id: R.Number,
  event_id: R.Number,
  event_name: R.String,
  event_subgroup_name: R.String,
});
export type EventInfo = R.Static<typeof REventInfo>;

const RPriceInfo = R.Record({
  price: R.Number,
  arg: R.Number,
  type: R.String,
});
export type PriceInfo = R.Static<typeof RPriceInfo>;

const RSearchBookDetail = R.Record({
  category: R.Number,
  category2: R.Number,
  opened_last_volume_id: R.String,
  is_setbook: R.Boolean,
  setbook_count: R.Number,
  is_wait_free: R.Boolean,
  buyer_rating_score: R.Number,
  is_series_complete: R.Boolean,
  is_serial: R.Number,
  sub_title: R.String,
  author: R.String,
  translator: R.String,
  age_limit: R.Number,
  tags_info: R.Array(RTag),
  title: R.String,
  is_rental: R.Boolean,
  author2: R.String,
  book_count: R.Number,
  web_title: R.String,
  b_id: R.String,
  price: R.Number,
  prices_info: R.Array(RPriceInfo),
  buyer_review_count: R.Number,
  publisher: R.String,
  buyer_rating_count: R.Number,
  web_title_title: R.String,
  authors_info: R.Array(RAuthorsInfo),
  desc: R.String, // include tags... ex) <b>&lt;책소개&gt;</b>\n\n<strong>“사람들이 나보고 맘충이래.” \r\n\r\n한국에서 여자로 살아가는 일 \r\n그 공포, 피로, 당황, 놀람, 혼란, 좌절의 \r\n연속에 대한 인생 현장 보고서</strong>  \r\n\r\n조남주 장편소설 『82년생 김지영』이 민음사 ‘오늘의 젊은 작가’ 시리즈로 출간되었다. 조남주 작가는 2011년, 지적 장애가 있는 한 소년의 재능이 발견되면서 벌어지는 사건을 통해 삶의 부조리를 현실적이면서도 따뜻하게 그려낸 작품 『귀를 귀울이면』으로 ‘문학동네소설상’을 받으며 데뷔했다. 시사 교양 프로그램에서 10년 동안 일한 방송 작가답게 ';
  series_prices_info: R.Array(RSeriesPriceInfo),
  highlight: RHighlightInfo,
  parent_category: R.Number,
  parent_category2: R.Number,
}).And(
  R.Partial({
    category_name: R.String.Or(R.Null),
    category2_name: R.String.Or(R.Null),
    parent_category_name: R.String.Or(R.Null),
    parent_category_name2: R.String.Or(R.Null),
    event_info: R.Array(REventInfo),
    _score: R.Number,
  }),
);
export type SearchBookDetail = R.Static<typeof RSearchBookDetail>;

const RBookResultBase = R.Record({
  books: R.Array(RSearchBookDetail),
});
const RBookResult = RBookResultBase.And(
  R.Record({
    total: R.Number,
    aggregations: R.Array(RAggregation), // 책이 포함 된 categories
  }),
);
export type BookResult = R.Static<typeof RBookResult>;

const RSearchResult = R.Record({
  author: RAuthorResult,
  book: RBookResult,
});
export type SearchResult = R.Static<typeof RSearchResult>;

const RInstantSearchResult = R.Record({
  book: RBookResultBase,
  author: RAuthorResultBase,
});
export type InstantSearchResult = R.Static<typeof RInstantSearchResult>;

export function checkSearchResult(value: any): SearchResult {
  try {
    return RSearchResult.check(value);
  } catch (e) {
    // FIXME add additional info
    Sentry.captureException(e);
    return value as SearchResult;
  }
}

export function checkInstantSearchResult(value: any): InstantSearchResult {
  try {
    return RInstantSearchResult.check(value);
  } catch (e) {
    // FIXME add additional info
    Sentry.captureException(e);
    return value as InstantSearchResult;
  }
}
