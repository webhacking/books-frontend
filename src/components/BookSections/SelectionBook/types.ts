import { DisplayType, BookItem } from 'src/types/sections';

export interface SelectionBookCommonProps {
  type: DisplayType;
  genre: string;
  slug: string;
  items: BookItem[]; // Fixme Md 타입 말고 comics UserPreferredSection 타입이 API 결과로 오는데 이 부분 확인해야 함
}

export type SelectionBookListProps = SelectionBookCommonProps;
