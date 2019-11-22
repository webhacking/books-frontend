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
import HomeKeywordFinderSection from 'src/components/KeywordFinder/HomeKeywordFinderSection';
import { MultipleLineBooks } from 'src/components/MultipleLineBooks/MultipleLineBooks';

interface HomeSectionRendererProps {
  section: Section;
  genre: string;
  order: number;
}

export const HomeSectionRenderer: React.FC<HomeSectionRendererProps> = props => {
  const {
    // @ts-ignore  Todo declare item_metadata type
    section: { items, item_metadata, type, title },
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
          title={title}
          showTimer={true}
        />
      );
    case DisplayType.HotRelease: {
      return (
        <RecommendedBook
          title={title}
          items={items as HotRelease[]}
          type={type}
          theme={'dark'}
        />
      );
    }

    case DisplayType.TodayRecommendation: {
      return (
        <RecommendedBook
          title={title}
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
          title={title}
          genre={genre}
          type={'big'}
          showTimer={false}
        />
      );
    case DisplayType.HomeQuickMenu: {
      return <QuickMenuList items={items as QuickMenu[]} />;
    }
    case DisplayType.UserPreferredBestseller: {
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
                categoryId={item.category_id}
                genre={genre}
                key={index}
                type={type}
                option={{ isAIRecommendation: false }}
              />
            );
          })}
        </>
      );
    }
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
                type={type}
                option={{ isAIRecommendation: false }}
              />
            );
          })}
        </>
      );
    }
    case DisplayType.WaitFree:
    case DisplayType.TodayNewBook:
    case DisplayType.NewSerialBook: {
      if (items) {
        return (
          <SelectionBook
            items={items as MdBook[]}
            title={title}
            genre={genre}
            type={type}
            option={{ isAIRecommendation: false }}
          />
        );
      }
      return null;
    }
    case DisplayType.Keywordfinder: {
      return <HomeKeywordFinderSection genre={genre} />;
    }
    case DisplayType.RecommendedBook: {
      return <MultipleLineBooks genre={genre} title={title} items={items as MdBook[]} />;
    }
    default:
      return null;
  }
};
