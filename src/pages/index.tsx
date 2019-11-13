import * as React from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import { Genre, GenreSubService, homeGenres } from 'src/constants/genres';
import cookieKeys, { DEFAULT_COOKIE_EXPIRES } from 'src/constants/cookies';
import { Router } from 'server/routes';
import * as Cookies from 'js-cookie';
import titleGenerator from 'src/utils/titleGenerator';
import { connect } from 'react-redux';
import { RootState } from 'src/store/config';

import getConfig from 'next/config';
import { Page, Section } from 'src/types/sections';
import { HomeSectionRenderer } from 'src/components/Section/HomeSectionRenderer';
import pRetry from 'p-retry';
import { keyToArray } from 'src/utils/common';
import axios from 'src/utils/axios';
import { booksActions } from 'src/services/books';
import { Request } from 'express';
import { ServerResponse } from 'http';

const { publicRuntimeConfig } = getConfig();

export interface HomeProps {
  genre: keyof typeof Genre;
  service: keyof typeof GenreSubService;
  branches: Section[];
}

export class Home extends React.Component<HomeProps> {
  private static redirect(req: Request, res: ServerResponse, path: string) {
    if (req.path !== path && !res.finished) {
      res.writeHead(302, {
        Location: path,
      });
      res.end();
    }
  }

  private static createHomeSlug(genre: Genre, service: GenreSubService) {
    if (!genre || genre === 'general') {
      return 'home-general';
    }
    if (genre === 'comics') {
      return 'home-comics';
    }
    if (service === 'single') {
      return `home-${genre}`;
    }
    return `home-${genre}-${service}`;
  }

  private static async fetchHomeSections(genre: Genre, service: GenreSubService) {
    const url = new URL(
      `/pages/${this.createHomeSlug(genre, service)}/`,
      publicRuntimeConfig.STORE_API,
    );
    const result = await pRetry(() => axios.get<Page>(url.toString()), {
      retries: 2,
      minTimeout: 2000,
    });
    return result.data;
  }

  // eslint-disable-next-line complexity
  public static async getInitialProps(props: ConnectedInitializeProps) {
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
      // Fixme 서버 사이드 장르 폴백 삭제 예정
      if (genre) {
        // Legacy Genre Fallback
        if (genre.match(/^(fantasy_serial|bl_serial|romance_serial)$/u)) {
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
              branches: [],
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
        const result = await this.fetchHomeSections(
          // @ts-ignore
          genre || Genre.GENERAL,
          service || GenreSubService.SINGLE,
        );
        const bIds = keyToArray(result.branches, 'b_id');
        store.dispatch({ type: booksActions.insertBookIds.type, payload: bIds });
        return {
          genre: genre || Genre.GENERAL,
          service: service || GenreSubService.SINGLE,
          ...query,
          ...result,
        };
      }
    } else {
      // Client Side
      const result = await this.fetchHomeSections(
        // @ts-ignore
        genre || Genre.GENERAL,
        service || GenreSubService.SINGLE,
      );
      const bIds = keyToArray(result.branches, 'b_id');
      store.dispatch({ type: booksActions.insertBookIds.type, payload: bIds });
      return {
        genre: genre || Genre.GENERAL,
        service: service || GenreSubService.SINGLE,
        ...query,
        ...result,
      };
    }
    return {
      genre: genre || 'general',
      service: service || 'single',
      branches: [],
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
    const { genre, service } = this.props;
    const currentGenre = Genre[genre.toUpperCase() as keyof typeof Genre];
    const currentService =
      GenreSubService[service.toUpperCase() as keyof typeof GenreSubService];
    return (
      <>
        <Head>
          <title>{`${titleGenerator(genre, currentService)} - 리디북스`}</title>
        </Head>
        <GenreTab currentGenre={currentGenre} genres={homeGenres} />
        {this.props.branches &&
          this.props.branches.map((section, index) => (
            <React.Fragment key={index}>
              <HomeSectionRenderer section={section} />
            </React.Fragment>
          ))}
      </>
    );
  }
}

// Temporary code for redux connect
const mapStateToProps = ({ app }: RootState) => ({
  app,
});

export default connect(mapStateToProps)(Home);
