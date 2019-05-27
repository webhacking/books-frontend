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

export interface HomeProps {
  genre: keyof typeof Genre;
  service: keyof typeof GenreSubService;
}

export class Home extends React.Component<HomeProps> {
  public static async getInitialProps(
    props: ConnectedInitializeProps<{ genre?: string; service?: string }>,
  ) {
    const { query, res, req } = props;
    console.log(query);
    const genre = query.genre ? Genre[query.genre.toUpperCase() as keyof typeof Genre] : null;

    if (req) {
      console.log(req.path, query);
    }

    if (req && res) {
      const redirect = (path: string) => {
        if (req.path !== path) {
          console.log('change location!', path);
          res.writeHead(302, {
            Location: path,
          });
          res.end();
        }
      };

      // Query Params 에 장르가 없을 경우
      if (!genre) {
        const visitedGenre = req.cookies[cookieKeys.recentlyVisitedGenre];

        // Todo 서브 서비스(단행본, 연재) API 지원여부 확인
        const visitedGenreService = visitedGenre
          ? req.cookies[`${cookieKeys.recentlyVisitedGenre}_${visitedGenre}_Service`]
          : null;

        if (!visitedGenre || visitedGenre === 'general') {
          redirect('/');
        }
        if (visitedGenre) {
          redirect(
            visitedGenreService ? `/${visitedGenre}/${visitedGenreService}` : `/${visitedGenre}`,
          );
        }
      } else {
        // Legacy Genre Fallback
        if (genre === 'fantasy_serial') {
          redirect('/fantasy/serial');
        }
        if (genre === 'bl_serial') {
          redirect('/bl/serial');
        }
        if (genre === 'romance_serial') {
          redirect('/romance/serial');
        }
        if (!query.service) {
          // URL Genre Param 이 있는 경우 저장 된 Sub Service 체크 후 Redirection,
          const visitedGenreService =
            req.cookies[`${cookieKeys.recentlyVisitedGenre}_${genre}_Service`];
          if (visitedGenreService && `/${genre}/${visitedGenreService}` !== req.path) {
            redirect(`/${genre}/${visitedGenreService}`);
          }
        }
      }
      // Todo Fetch Sections
      if (res.statusCode !== 302) {
        console.log('Server Side Fetch Start');
      }
    }

    return { genre: genre || 'general', service: props.query.service, ...props.query };
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

    // Fix me subService Length 체크 말고 다른 방법은 없는지
    if (service && homeGenres[currentGenre].subServices.length > 0) {
      const currentService =
        GenreSubService[service.toUpperCase() as keyof typeof GenreSubService] ||
        GenreSubService.SINGLE;
      Cookies.set(`${cookieKeys.recentlyVisitedGenre}_${currentGenre}_Service`, currentService, {
        expires: DEFAULT_COOKIE_EXPIRES,
      });
    }
  };

  public componentDidMount(): void {
    this.setCookie(this.props);
    console.log('First Render. Client Side Fetch Start');
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
      Router.replaceRoute(`/`);
      return false;
    }

    // Todo visitedService value Validation
    if (!service && genre.match(/(fantasy|romance|bl)/)) {
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

  public componentDidUpdate(): void {
    // Todo Fetch
    console.log('Client Render Updated. Fetch Start');
  }

  public render() {
    const { genre } = this.props;
    const currentGenre = Genre[genre.toUpperCase() as keyof typeof Genre];
    return (
      <>
        <Head>
          <title>리디북스 - 홈 - {genre}</title>
        </Head>
        <div>
          <GenreTab currentGenre={currentGenre} genres={homeGenres} />
          {/*{currentGenre}*/}
          {/*{service}*/}
        </div>
        <QuickMenuList items={quickMenuItems} />
      </>
    );
  }
}

export default Home;
