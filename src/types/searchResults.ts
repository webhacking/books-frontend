import { AuthorRole } from 'src/types/book';

export interface Author {
  popular_book_title: string;
  book_count: number;
  name: string;
  id: number;
  highlight: { name?: string };
}

export interface AuthorResult {
  total: number;
  authors: Author[];
}

export interface Aggregation {
  category_id: number;
  category_name: string;
  doc_count: number;
}

export interface Tag {
  tag_name: string;
  tag_id: number;
}
export interface SeriesPriceInfo {
  series_arg: number;
  total_regular_price: number;
  total_price: number;
  type: string; // ex('normal' | ... )
  free_book_count: number;
  series_id: string;
  regular_price: number;
  max_price: number;
  book_count: number;
  min_price: number;
  arg: number;
  min_nonzero_price: number;
  series_discount_rate: number;
}

export interface AuthorsInfo {
  role: AuthorRole | string;
  name: string;
  author_id: number;
  native_name?: string;
  alias_name?: string;
  order: number;
}

export interface HighlightInfo {
  web_title_title?: string; // todo escaping
  sub_title?: string; // todo escaping
  author?: string; // todo escaping
  author2?: string; // todo escaping
  translator?: string; // todo escaping
  publisher?: string; // todo escaping
}

export interface EventInfo {
  event_subgroup_id: number;
  event_id: number;
  event_name: string;
  event_subgroup_name: string;
}

export interface SearchBookDetail {
  buyer_rating_score: number;
  is_series_complete: boolean;
  sub_title: string;
  author: string;
  event_info?: EventInfo[];
  translator: string;
  age_limit: number;
  tags_info: Tag[];
  title: string;
  is_rental: boolean;
  author2: string;
  book_count: number;
  web_title: string;
  b_id: string;
  price: number;
  _score?: number;
  buyer_review_count: number;
  publisher: string;
  buyer_rating_count: number;
  web_title_title: string;
  authors_info: AuthorsInfo[];
  desc: string; // include tags... ex) <b>&lt;책소개&gt;</b>\n\n<strong>“사람들이 나보고 맘충이래.” \r\n\r\n한국에서 여자로 살아가는 일 \r\n그 공포, 피로, 당황, 놀람, 혼란, 좌절의 \r\n연속에 대한 인생 현장 보고서</strong>  \r\n\r\n조남주 장편소설 『82년생 김지영』이 민음사 ‘오늘의 젊은 작가’ 시리즈로 출간되었다. 조남주 작가는 2011년, 지적 장애가 있는 한 소년의 재능이 발견되면서 벌어지는 사건을 통해 삶의 부조리를 현실적이면서도 따뜻하게 그려낸 작품 『귀를 귀울이면』으로 ‘문학동네소설상’을 받으며 데뷔했다. 시사 교양 프로그램에서 10년 동안 일한 방송 작가답게 ';
  series_prices_info: SeriesPriceInfo[];
  highlight: HighlightInfo;
}

export interface BookResult {
  total: number;
  books: SearchBookDetail[];
  aggregations: Aggregation[]; // 책이 포함 된 categories
}

export interface SearchResult {
  author: AuthorResult;
  book: BookResult;
}

export type InstantSearchBookResult = Omit<BookResult, 'total' | 'aggregations'>;
export type InstantSearchAuthorResult = Omit<AuthorResult, 'total'>;

export interface InstantSearchResult {
  book: InstantSearchBookResult;
  author: InstantSearchAuthorResult;
}
