export enum DisplayType {
  HomeQuickMenu = 'HomeQuickMenu',
  Page = 'Page',
  HomeCarouselBanner = 'HomeCarouselBanner',
  HotRelease = 'HotRelease',
  TodayRecommendation = 'TodayRecommendation',
  BestSeller = 'BestSeller',
  HowAboutThis = 'HowAboutThis',
  HomeMdSelection = 'HomeMdSelection',
  ReadingBooksRanking = 'ReadingBooksRanking',
  HomeEventBanner = 'HomeEventBanner',
}

interface BaseResult {
  slug: string;
  type: DisplayType;
  name: string;
  total: number;
}

export type SectionResult =
  | QuickMenu
  | TopBanner
  | EventBanner
  | BestSeller
  | ReadingRanking
  | MdSelection;

export interface Section extends BaseResult {
  items?: SectionResult[];
  item_metadata?: {};
}

export interface Page extends BaseResult {
  branches: Section[];
}

export interface BestSeller {
  b_id: string;
  period: string;
  options: [];
  rank: number;
}

export interface ReadingRanking {
  b_id: string;
  type: string;
}

export interface HotRelease {
  b_id: string;
  type: string;
  order: number;
  sentence: string;
}
export type TodayRecommendation = HotRelease;

export interface TopBanner {
  id: number;
  title: string;
  main_image_url: string;
  landing_url: string;
  bg_color: string;
  order: number;
  is_visible: boolean;
  is_badge_available: boolean;
}

export interface QuickMenu {
  id: number;
  name: string;
  url: string;
  icon: string;
  bg_color: string;
  order: number;
}

export interface EventBanner {
  id: number;
  label: string;
  imageUrl: string;
  link: string;
}

export interface Book {
  b_id: string;
  type: string;
}

export interface MdSelection {
  id: number;
  title: string;
  order: number;
  books: Book[];
}
