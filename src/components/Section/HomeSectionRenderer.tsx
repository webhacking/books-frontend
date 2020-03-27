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
import { EventBanner } from 'src/components/EventBanner';
import { QuickMenuList } from 'src/components/QuickMenu';
import React from 'react';
import RankingBookList from 'src/components/BookSections/RankingBook/RankingBookList';
import RecommendedBook from 'src/components/RecommendedBook';
import SelectionBook from 'src/components/BookSections/SelectionBook/SelectionBook';
import HomeKeywordFinderSection from 'src/components/KeywordFinder/HomeKeywordFinderSection';
import { MultipleLineBooks } from 'src/components/MultipleLineBooks/MultipleLineBooks';
import UserPreferredSection from 'src/components/Section/UserPreferredSection';
import AiRecommendationSection from 'src/components/Section/AIRecommendationSection';
import TopBannerCarousel from 'src/components/TopBanner';

interface HomeSectionRendererProps {
  section: Section;
  genre: string;
  order: number;
}

function HomeSectionRenderer(props) {
  const {
    section: {
      items, item_metadata, type, title, extra, slug,
    },
    genre,
  } = props;

  if (!items) {
    // 사파리 disk cache 된 섹션 정보가 호출 될 때
    // 특정섹션에 items 필드가 자체가 존재하지 않는 경우를 방어합니다.
    // ex) AI 추천, KeywordFinder 등
    // 실제 사파리에서 디스크 캐시 된 데이터가 사용되는 이유는 더 찾아야합니다.
    return null;
  }

  // placeholder가 아닌데 아이템이 0개면 잘못된 섹션이므로 표시하지 않는다.
  if (items.length === 0 && !extra.is_placeholder) {
    return null;
  }
  switch (type) {
    case DisplayType.Page:
      return null;
    case DisplayType.HomeCarouselBanner:
      return <TopBannerCarousel banners={items as TopBanner[]} slug={slug} />;
    case DisplayType.HomeEventBanner:
      return <EventBanner items={items as EventBannerItem[]} genre={genre} slug={slug} />;
    case DisplayType.ReadingBooksRanking:
      return (
        <RankingBookList
          slug={slug}
          items={items as ReadingRanking[]}
          type="small"
          genre={genre}
          title={title}
          showSomeDeal
          showTimer
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
          genre={genre}
          theme="dark"
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
          genre={genre}
          theme={['bl', 'romance', 'fantasy'].includes(genre) ? 'dark' : 'white'}
        />
      );
    }
    case DisplayType.HomeMdSelection: {
      return (
        <>
          {(items as MdSelection[]).map((item) => {
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
    case DisplayType.FreeBook:
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
    case DisplayType.BestSeller:
      return (
        <RankingBookList
          slug={slug}
          items={items as ReadingRanking[]}
          title={title}
          genre={genre}
          type="big"
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
}

export const MemoHomeSectionRenderer: React.FC<HomeSectionRendererProps> = React.memo(
  HomeSectionRenderer,
);

export default MemoHomeSectionRenderer;
