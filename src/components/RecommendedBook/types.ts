import { HotRelease, TodayRecommendation } from 'src/types/sections';

interface CommonProps {
  theme: 'dark' | 'white';
  slug: string;
  genre: string;
  title: string;
}

interface TodayRecommendationProps {
  type: 'TodayRecommendation';
  items: TodayRecommendation[];
}

interface HotReleaseProps {
  type: 'HotRelease';
  items: HotRelease[];
}

export type RecommendedBookProps = CommonProps & (TodayRecommendationProps | HotReleaseProps);
