import { DisplayType, MdBook, AIRecommendationBook } from 'src/types/sections';

export interface SelectionBookCommonProps {
  genre: string;
  slug: string;
}

export interface SelectionBookMdProps {
  type: Exclude<DisplayType, DisplayType.AiRecommendation>;
  items: MdBook[]; // Fixme Md 타입 말고 comics UserPreferredSection 타입이 API 결과로 오는데 이 부분 확인해야 함
}

export interface SelectionBookAiRecommendationProps {
  type: DisplayType.AiRecommendation;
  items: AIRecommendationBook[];
}

export type SelectionBookListProps = SelectionBookCommonProps & (SelectionBookMdProps | SelectionBookAiRecommendationProps);
