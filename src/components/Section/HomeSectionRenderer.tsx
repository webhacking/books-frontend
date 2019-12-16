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
import React from 'react';
import RankingBookList from 'src/components/BookSections/RankingBook/RankingBookList';
import { RecommendedBook } from 'src/components/RecommendedBook';
import SelectionBook from 'src/components/BookSections/SelectionBook/SelectionBook';
import HomeKeywordFinderSection from 'src/components/KeywordFinder/HomeKeywordFinderSection';
import { MultipleLineBooks } from 'src/components/MultipleLineBooks/MultipleLineBooks';
import UserPreferredSection from 'src/components/Section/UserPreferredSection';
import AiRecommendationSection from 'src/components/Section/AIRecommendationSection';

interface HomeSectionRendererProps {
  section: Section;
  genre: string;
  order: number;
}

// eslint-disable-next-line complexity
export const HomeSectionRenderer: React.FC<HomeSectionRendererProps> = props => {
  // @ts-ignore

  const {
    // @ts-ignore  Todo declare item_metadata type
    section: { items, item_metadata, type, title, extra, slug },
    genre,
  } = props;
  if (!items && extra.is_placeholder === false) {
    return null;
  }
  // placeholder 이고 별도 요청을 해야하는 섹션이 아닌데도 불구하고 아이템이 없으면 표시하지 않는다.
  if (items.length === 0 && extra.is_placeholder === false) {
    return null;
  }
  switch (type) {
    case DisplayType.Page:
      return null;
    case DisplayType.HomeCarouselBanner:
      return (
        <TopBannerCarouselContainer
          banners={items as TopBanner[]} /* options={item_metadata} */
          slug={slug}
        />
      );
    case DisplayType.HomeEventBanner:
      return <EventBanner items={items as EventBannerItem[]} genre={genre} slug={slug} />;
    case DisplayType.ReadingBooksRanking:
      return (
        <RankingBookList
          slug={slug}
          items={items as ReadingRanking[]}
          type={'small'}
          genre={genre}
          title={title}
          showSomeDeal={true}
          showTimer={true}
          extra={extra}
        />
      );
    case DisplayType.HotRelease: {
      return (
        <RecommendedBook
          slug={slug}
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
          slug={slug}
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
          slug={slug}
          items={items as ReadingRanking[]}
          title={title}
          genre={genre}
          type={'big'}
          showTimer={false}
          extra={extra}
        />
      );
    case DisplayType.HomeQuickMenu: {
      return <QuickMenuList items={items as QuickMenu[]} />;
    }
    case DisplayType.UserPreferredBestseller: {
      return (
        <UserPreferredSection
          slug={slug}
          items={items as MdSelection[]}
          genre={genre}
          type={type}
        />
      );
    }
    case DisplayType.HomeMdSelection: {
      return (
        <>
          {(items as MdSelection[]).map(item => {
            if (!item.books) {
              return null;
            }
            return (
              <SelectionBook
                slug={`${slug}-${item.id}`}
                items={item.books}
                title={item.title}
                genre={genre}
                key={item.id}
                selectionId={item.id}
                type={type}
                option={{ isAIRecommendation: false }}
              />
            );
          })}
        </>
      );
    }
    case DisplayType.RecommendedNewBook:
    case DisplayType.WaitFree:
    case DisplayType.TodayNewBook:
    case DisplayType.NewSerialBook: {
      if (items) {
        return (
          <SelectionBook
            slug={slug}
            items={items as MdBook[]}
            title={title}
            genre={genre}
            type={type}
            option={{ isAIRecommendation: false }}
            extra={extra}
          />
        );
      }
      return null;
    }
    case DisplayType.AiRecommendation: {
      return (
        <AiRecommendationSection
          slug={slug}
          items={items as MdBook[]}
          genre={genre}
          type={type}
          extra={extra}
          title={title}
        />
      );
    }
    case DisplayType.KeywordFinder: {
      return <HomeKeywordFinderSection genre={genre} />;
    }
    case DisplayType.RecommendedBook: {
      return (
        <MultipleLineBooks
          slug={slug}
          genre={genre}
          title={title}
          items={items as MdBook[]}
        />
      );
    }
    default:
      return null;
  }
};
