export enum Genre {
  GENERAL = 'general',
  ROMANCE = 'romance',
  FANTASY = 'fantasy',
  COMIC = 'comic',
  BL = 'bl',
  // Legacy
  FANTASY_SERIAL = 'fantasy_serial',
  ROMANCE_SERIAL = 'romance_serial',
  BL_SERIAL = 'bl_serial',
}
export enum GenreSubService {
  SINGLE = 'single',
  SERIAL = 'serial',
}

export interface GenreService {
  key: GenreSubService;
  label: string;
}

export interface GenreInfo {
  key: Genre;
  label: string;
  path: string;
  subServices: GenreService[];
}

export interface Genres {
  [index: string]: GenreInfo;
}

// mock genres
// API 사용하게 되면 수정 될 것
export const homeGenres: Genres = {
  general: {
    key: Genre.GENERAL,
    label: '일반',
    path: '/',
    subServices: [],
  },
  romance: {
    key: Genre.ROMANCE,
    label: '로맨스',
    path: '/romance',
    subServices: [
      {
        key: GenreSubService.SINGLE,
        label: '단행본',
      },
      {
        key: GenreSubService.SERIAL,
        label: '연재',
      },
    ],
  },
  fantasy: {
    key: Genre.FANTASY,
    label: '판타지',
    path: '/fantasy',
    subServices: [
      {
        key: GenreSubService.SINGLE,
        label: '단행본',
      },
      {
        key: GenreSubService.SERIAL,
        label: '연재',
      },
    ],
  },
  comic: {
    key: Genre.COMIC,
    label: '만화',
    path: '/comic',
    subServices: [],
  },
  bl: {
    key: Genre.BL,
    label: 'BL',
    path: '/bl',
    subServices: [
      {
        key: GenreSubService.SINGLE,
        label: '단행본',
      },
      {
        key: GenreSubService.SERIAL,
        label: '연재',
      },
    ],
  },
};
