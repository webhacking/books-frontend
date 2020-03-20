import { DisplayType, HotRelease, TodayRecommendation } from 'src/types/sections';

interface CommonProps {
  theme: 'dark' | 'white';
  slug: string;
  genre: string;
  title: string;
}

interface TodayRecommendationProps {
  type: DisplayType.TodayRecommendation;
  items: TodayRecommendation[];
}

interface HotReleaseProps {
  type: DisplayType.HotRelease;
  items: HotRelease[];
}

export type RecommendedBookProps = CommonProps & (TodayRecommendationProps | HotReleaseProps);
