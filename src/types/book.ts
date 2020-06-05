import * as R from 'runtypes';

import { getThumbnailIdFromBookDetail } from 'src/utils/books';
import { computeBookTitle } from 'src/utils/bookTitleGenerator';

const RCategory = R.Record({
  id: R.Number,
  name: R.String,
  genre: R.String,
  sub_genre: R.String,
  is_series_category: R.Boolean,
});

const RPriceItem = R.Record({
  regular_price: R.Number,
  price: R.Number,
  discount_percentage: R.Number,
});
const RPaperPriceItem = R.Partial({
  price: R.Number,
});

const RRentPriceItem = RPriceItem.And(R.Record({
  rent_days: R.Number,
}));

const RSeriesPriceItem = RPriceItem.And(R.Record({
  total_book_count: R.Number,
  free_book_count: R.Number,
}));

const RSeriesRentPriceItem = R.Record({
  regular_price: R.Number,
  rent_price: R.Number,
  discount_percentage: R.Number,
  rent_days: R.Number,
  total_book_count: R.Number,
  free_book_count: R.Number,
});

const RPriceInfo = R.Partial({
  buy: RPriceItem,
  rent: RRentPriceItem,
  paper: RPaperPriceItem,
});

const RSeriesPriceInfo = R.Partial({
  buy: RSeriesPriceItem,
  rent: RSeriesRentPriceItem,
});

const RSeries = R.Record({
  id: R.String,
  volume: R.Number,
  property: R.Record({
    last_volume_id: R.String,
    opened_last_volume_id: R.String,
    title: R.String.Or(R.Null),
    unit: R.String.Or(R.Null),
    opened_book_count: R.Number,
    total_book_count: R.Number,
    is_serial: R.Boolean,
    is_completed: R.Boolean,
    is_comic_hd: R.Boolean,
    is_serial_complete: R.Boolean,
    is_wait_free: R.Boolean,
  }),
}).And(
  R.Partial({
    price_info: RSeriesPriceInfo,
  }),
);

const RAuthor = R.Record({
  name: R.String,
  role: R.String,
}).And(
  R.Partial({
    id: R.Number,
  }),
);
export type Author = R.Static<typeof RAuthor>;

export const RPublisher = R.Record({
  name: R.String,
  cp_name: R.String,
}).And(
  R.Partial({
    id: R.Number,
  }),
);

export const RBookData = R.Record({
  id: R.String,
  title: R.Record({
    main: R.String,
  }).And(R.Partial({
    prefix: R.String,
  })),
  authors: R.Array(RAuthor),
  categories: R.Array(RCategory).withConstraint((arr) => arr.length > 0),
  price_info: RPriceInfo,
  file: R.Record({
    size: R.Number,
    format: R.Union(R.String, R.Null),
    is_drm_free: R.Boolean,
    is_comic: R.Boolean,
    is_webtoon: R.Boolean,
    is_manga: R.Boolean,
    is_comic_hd: R.Boolean,
  }).And(
    R.Partial({
      character_count: R.Number,
      page_count: R.Number,
    }),
  ),
  property: R.Record({
    is_novel: R.Boolean,
    is_magazine: R.Boolean,
    is_adult_only: R.Boolean,
    is_new_book: R.Boolean,
    is_open: R.Boolean,
    is_somedeal: R.Boolean,
    is_trial: R.Boolean,
    preview_rate: R.Number,
  }).And(
    R.Partial({
      review_display_id: R.String,
    }),
  ),
  publisher: RPublisher,
}).And(
  R.Partial({
    series: RSeries,
    is_deleted: R.Boolean,
    setbook: R.Record({
      member_books_count: R.Number,
    }),
  }),
);
export type Book = R.Static<typeof RBookData>;

export interface ClientBookFields {
  isAvailableSelect: boolean;
  isAlreadyCheckedAtSelect: boolean;
  desc?: BookDesc;
}

export interface BookDescResponse {
  descriptions: BookDesc;
  b_id: string;
  last_modified: string;
}
export interface BookDesc {
  author?: string;
  intro?: string;
  toc?: string;
  publisher_review?: string;
  intro_video_url?: string;
  intro_image_url?: string;
}

export interface SimpleBook {
  id: string;
  isDeleted?: boolean;
  thumbnailId: string;
  title: string;
  unit?: string;
  authors: Author[];
  categories: R.Static<typeof RCategory>[];
  publisher: Pick<R.Static<typeof RPublisher>, 'id' | 'name'>;
  isTrial: boolean;
  isAdultOnly: boolean;
  isSomedeal: boolean;
  isComic: boolean;
  isNovel: boolean;
  price: R.Static<typeof RPriceInfo>;
  series?: {
    isSerial: boolean;
    isComplete: boolean;
    isWaitFree: boolean;
    totalBookCount: number;
    freeBookCount: number;
    price?: Omit<R.Static<typeof RPriceInfo>, 'paper'>;
  };
  setBookCount?: number;
}

export type ClientSimpleBook = SimpleBook & { clientBookFields: ClientBookFields };

export function createSimpleBookData(book: Book): SimpleBook {
  const thumbnailId = getThumbnailIdFromBookDetail(book);
  const title = computeBookTitle(book);
  const unit = book.series?.property.unit ?? undefined;
  let series;
  if (book.series) {
    const buy = book.series.price_info?.buy;
    const rent = book.series.price_info?.rent;
    series = {
      isSerial: book.series.property.is_serial,
      isComplete: book.series.property.is_completed,
      isWaitFree: book.series.property.is_wait_free,
      totalBookCount: buy?.total_book_count || 1,
      freeBookCount: rent?.free_book_count || buy?.free_book_count || 0,
      price: (buy || rent) && {
        buy: buy && {
          regular_price: buy.regular_price,
          price: buy.price,
          discount_percentage: buy.discount_percentage,
        },
        rent: rent && {
          regular_price: rent.regular_price,
          price: rent.rent_price,
          discount_percentage: rent.discount_percentage,
          rent_days: rent.rent_days,
        },
      },
    };
  }
  return {
    id: book.id,
    isDeleted: book.is_deleted,
    thumbnailId,
    title,
    unit,
    authors: book.authors,
    publisher: {
      id: book.publisher.id,
      name: book.publisher.name,
    },
    categories: book.categories,
    isTrial: book.property.is_trial,
    isAdultOnly: book.property.is_adult_only,
    isSomedeal: book.property.is_somedeal,
    isComic: book.file.is_comic || book.file.is_comic_hd,
    isNovel: book.property.is_novel,
    price: book.price_info,
    series,
    setBookCount: book.setbook?.member_books_count,
  };
}
