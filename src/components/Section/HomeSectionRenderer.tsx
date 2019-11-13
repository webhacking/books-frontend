import {
  DisplayType,
  EventBanner as EventBannerItem,
  HotRelease,
  MdSelection,
  QuickMenu,
  ReadingRanking,
  Section,
  TopBanner,
} from 'src/types/sections';
import { TopBannerCarouselContainer } from 'src/components/TopBanner';
import { EventBanner } from 'src/components/EventBanner';
import { QuickMenuList } from 'src/components/QuickMenu';
import * as React from 'react';
import RankingBookList from 'src/components/BookSections/RankingBook/RankingBookList';
import { RecommendedBook } from 'src/components/RecommendedBook';
import SelectionBook from 'src/components/BookSections/SelectionBook/SelectionBook';

interface HomeSectionRendererProps {
  section: Section;
}

export const HomeSectionRenderer: React.FC<HomeSectionRendererProps> = props => {
  const {
    // @ts-ignore  Todo declare item_metadata type
    section: { items, item_metadata, type, name },
  } = props;
  if (!items) {
    return null;
  }
  switch (type) {
    case DisplayType.Page:
      return null;
    case DisplayType.HomeCarouselBanner:
      return (
        <TopBannerCarouselContainer
          banners={items as TopBanner[]} /* options={item_metadata} */
        />
      );
    case DisplayType.HomeEventBanner:
      return <EventBanner items={items as EventBannerItem[]} />;
    case DisplayType.ReadingBooksRanking:
      return (
        <RankingBookList
          items={items as ReadingRanking[]}
          type={'small'}
          title={name}
          showTimer={true}
        />
      );
    case DisplayType.HotRelease:
    case DisplayType.TodayRecommendation:
      return <RecommendedBook title={name} items={items as HotRelease[]} type={type} />;
    case DisplayType.BestSeller:
      return (
        <RankingBookList
          items={items as ReadingRanking[]}
          title={name}
          type={'big'}
          showTimer={false}
        />
      );
    case DisplayType.HomeQuickMenu: {
      return <QuickMenuList items={items as QuickMenu[]} />;
    }
    case DisplayType.UserPreferredBestseller:
    case DisplayType.HomeMdSelection: {
      return (
        <>
          {(items as MdSelection[]).map((item, index) => {
            if (!item.books) {
              return null;
            }
            return (
              <SelectionBook
                items={item.books}
                title={item.title}
                key={index}
                option={{ isAIRecommendation: false }}
              />
            );
          })}
        </>
      );
    }
    default:
      return null;
  }
};
