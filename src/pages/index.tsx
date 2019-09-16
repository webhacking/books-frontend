import * as React from 'react';
import Head from 'next-server/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import { Genre, GenreSubService, homeGenres } from 'src/constants/genres';
import cookieKeys, { DEFAULT_COOKIE_EXPIRES } from 'src/constants/cookies';
import { Router } from 'server/routes';
import * as Cookies from 'js-cookie';
import { QuickMenuList } from 'src/components/QuickMenu';
import { quickMenuItems } from 'src/components/QuickMenu/mockData';
import { TopBannerCarouselContainer } from 'src/components/TopBanner';
import { EventBanner } from 'src/components/EventBanner';
import { eventBannerItems } from 'src/components/EventBanner/mockData';
import recommendedBookMockItems from 'src/components/RecommendedBook/mockData';
import bookSectionsMockItems from 'src/components/BookSections/mockData';
import RecommendedBook from 'src/components/RecommendedBook/RecommendedBook';
import BookSectionContainer from 'src/components/BookSections/BookSectionContainer';
import titleGenerator from 'src/utils/titleGenerator';
import { connect } from 'react-redux';
import { RootState } from 'src/store/config';

export interface HomeProps {
  genre: keyof typeof Genre;
  service: keyof typeof GenreSubService;
}

export class Home extends React.Component<HomeProps> {
  private static redirect(req, res, path) {
    if (req.path !== path && !res.finished) {
      res.writeHead(302, {
        Location: path,
      });
      res.end();
    }
  }

  // eslint-disable-next-line complexity
  public static async getInitialProps(props: ConnectedInitializeProps) {
    // @ts-ignore
    const { query, res, req, store } = props;
    const genre = query.genre
      ? Genre[(query.genre as string).toUpperCase() as keyof typeof Genre]
      : null;

    const service = query.service
      ? GenreSubService[
          (query.service as string).toUpperCase() as keyof typeof GenreSubService
        ]
      : null;

    if (req && res) {
      if (genre) {
        // Legacy Genre Fallback
        if (genre.match(/(fantasy_serial|bl_serial|romance_serial)/u)) {
          this.redirect(req, res, `/${genre.replace('_', '/')}`);
          return { genre: genre.split('_')[0], service: 'serial', ...props.query };
        }
        if (!query.service) {
          // URL Genre Param 이 있는 경우 저장 된 Sub Service 체크 후 Redirection,
          const visitedGenreService =
            req.cookies[`${cookieKeys.recentlyVisitedGenre}_${genre}_Service`];

          if (`/${genre}/${visitedGenreService}` === req.path) {
            return {
              genre: genre || 'general',
              service: service || 'single',
              ...props.query,
            };
          }

          if (visitedGenreService) {
            this.redirect(req, res, `/${genre}/${visitedGenreService}`);
          }
          if (genre.match(/(fantasy|romance|bl)/u)) {
            this.redirect(req, res, `/${genre}/single`); // default sub service fallback
          }
        }
      } else {
        const visitedGenre = req.cookies[cookieKeys.recentlyVisitedGenre];

        // Todo 서브 서비스(단행본, 연재) API 지원여부 확인
        const visitedGenreService = visitedGenre
          ? req.cookies[`${cookieKeys.recentlyVisitedGenre}_${visitedGenre}_Service`]
          : null;

        if (visitedGenre === 'general') {
          this.redirect(req, res, '/');
        }
        if (visitedGenre) {
          this.redirect(
            req,
            res,
            visitedGenreService
              ? `/${visitedGenre}/${visitedGenreService}`
              : `/${visitedGenre}`,
          );
        }
      }
      // Todo Fetch Sections
      if (res.statusCode !== 302) {
        return {
          genre: genre || 'general',
          service: service || 'single',
          ...props.query,
        };
      }
    }
    // Client Side
    return {
      genre: genre || 'general',
      service: service || 'single',
      ...props.query,
    };
  }

  private setCookie = (props: HomeProps) => {
    const { genre, service } = props;
    const currentGenre =
      genre && Genre[genre.toUpperCase() as keyof typeof Genre]
        ? Genre[genre.toUpperCase() as keyof typeof Genre]
        : Genre.GENERAL;
    Cookies.set(cookieKeys.recentlyVisitedGenre, currentGenre, {
      expires: DEFAULT_COOKIE_EXPIRES,
    });

    if (service && homeGenres[currentGenre].subServices.length > 0) {
      const currentService =
        GenreSubService[service.toUpperCase() as keyof typeof GenreSubService] ||
        GenreSubService.SINGLE;
      Cookies.set(
        `${cookieKeys.recentlyVisitedGenre}_${currentGenre}_Service`,
        currentService,
        {
          expires: DEFAULT_COOKIE_EXPIRES,
        },
      );
    }
  };

  public componentDidMount(): void {
    this.setCookie(this.props);
  }

  public shouldComponentUpdate(
    nextProps: Readonly<HomeProps>,
    // nextState: Readonly<{}>,
    // nextContext: any,
  ): boolean {
    const { genre, service } = nextProps;
    const visitedGenre = Cookies.get(`${cookieKeys.recentlyVisitedGenre}`);
    const visitedService = Cookies.get(
      `${cookieKeys.recentlyVisitedGenre}_${visitedGenre}_Service`,
    );
    if (window.location.pathname === '/general') {
      Router.replaceRoute('/');
      return false;
    }
    // Todo visitedService value Validation
    // eslint-disable-next-line prefer-named-capture-group
    if (!service && genre.match(/(fantasy|romance|bl)/u)) {
      if (visitedService) {
        Router.replaceRoute(`/${genre}/${visitedService}`);
      } else {
        Router.replaceRoute(`/${genre}/${GenreSubService.SINGLE}`);
      }
      return false;
    }

    this.setCookie(nextProps);
    return true;
  }

  public render() {
    // @ts-ignore
    const { genre, service, app } = this.props;
    const currentGenre = Genre[genre.toUpperCase() as keyof typeof Genre];
    const currentService =
      GenreSubService[service.toUpperCase() as keyof typeof GenreSubService];

    return (
      <>
        <Head>
          <title>{`${titleGenerator(genre, currentService)} - 리디북스`}</title>
        </Head>
        <GenreTab currentGenre={currentGenre} genres={homeGenres} />
        {/* 일반도서 상단 배너 */}
        {(currentGenre === Genre.GENERAL ||
          currentService === GenreSubService.SERIAL) && <TopBannerCarouselContainer />}
        {/* 장르 단행본 추천 영역 */}
        {(currentGenre === Genre.FANTASY ||
          currentGenre === Genre.ROMANCE ||
          currentGenre === Genre.BL) &&
          currentService === GenreSubService.SINGLE && (
            <RecommendedBook
              type={'single_book_recommendation'}
              items={recommendedBookMockItems}
              genre={currentGenre}
            />
          )}

        <QuickMenuList items={quickMenuItems} />

        {/* Todo 상단 추천영역 조건 확인 */}
        {currentGenre === Genre.GENERAL && (
          <RecommendedBook
            type={'hot_release'}
            items={recommendedBookMockItems}
            genre={currentGenre}
          />
        )}

        {/* Todo 이벤트 배너 출력 조건 확인 */}
        {(currentGenre === Genre.FANTASY ||
          currentGenre === Genre.ROMANCE ||
          currentGenre === Genre.BL) &&
          currentService === GenreSubService.SINGLE && (
            <EventBanner items={eventBannerItems} genre={currentGenre} />
          )}

        {/* Todo Belt Banner */}

        <BookSectionContainer sections={bookSectionsMockItems} />
      </>
    );
  }
}

// Temporary code for redux connect
const mapStateToProps = ({ app }: RootState) => ({
  app,
});

export default connect(mapStateToProps)(Home);
