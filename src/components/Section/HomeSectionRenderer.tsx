import {
  DisplayType,
  EventBanner as EventBannerItem,
  HotRelease,
  MdBook,
  MdSelection,
  QuickMenu,
  ReadingRanking,
  Section,
  TodayRecommendation,
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
  genre: string;
  order: number;
}

export const HomeSectionRenderer: React.FC<HomeSectionRendererProps> = props => {
  const {
    // @ts-ignore  Todo declare item_metadata type
    section: { items, item_metadata, type, name },
    genre,
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
          genre={genre}
          title={name}
          showTimer={true}
        />
      );
    case DisplayType.HotRelease: {
      return (
        <RecommendedBook
          title={name}
          items={items as HotRelease[]}
          type={type}
          theme={'dark'}
        />
      );
    }

    case DisplayType.TodayRecommendation: {
      return (
        <RecommendedBook
          title={name}
          items={items as TodayRecommendation[]}
          type={type}
          theme={['bl', 'romance', 'fantasy'].includes(genre) ? 'dark' : 'white'}
        />
      );
    }

    case DisplayType.BestSeller:
      return (
        <RankingBookList
          items={items as ReadingRanking[]}
          title={name}
          genre={genre}
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
                genre={genre}
                key={index}
                option={{ isAIRecommendation: false }}
              />
            );
          })}
        </>
      );
    }
    case DisplayType.TodayNewBook:
    case DisplayType.NewSerialBook: {
      if (items) {
        return (
          <SelectionBook
            items={items as MdBook[]}
            title={name}
            genre={genre}
            option={{ isAIRecommendation: false }}
          />
        );
      }
      return null;
    }
    default:
      return null;
  }
};
