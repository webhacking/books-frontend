import * as React from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import cookieKeys, { DEFAULT_COOKIE_EXPIRES } from 'src/constants/cookies';
import { Router } from 'server/routes';
import * as Cookies from 'js-cookie';
import titleGenerator from 'src/utils/titleGenerator';
import { connect } from 'react-redux';
import getConfig from 'next/config';
import { Page, Section } from 'src/types/sections';
import { HomeSectionRenderer } from 'src/components/Section/HomeSectionRenderer';
import pRetry from 'p-retry';
import { keyToArray } from 'src/utils/common';
import axios from 'src/utils/axios';
import { booksActions } from 'src/services/books';
import { Request } from 'express';
import { ServerResponse } from 'http';
import sentry from 'src/utils/sentry';
import { categoryActions } from 'src/services/category';

const { captureException } = sentry();

const { publicRuntimeConfig } = getConfig();

export interface HomeProps {
  branches: Section[];
  genre: string;
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

  private static createHomeSlug(genre: string) {
    if (!genre || genre === 'general') {
      return 'home-general';
    }
    return `home-${genre}`;
  }

  private static async fetchHomeSections(genre: string) {
    const url = new URL(
      `/pages/${this.createHomeSlug(genre)}/`,
      publicRuntimeConfig.STORE_API,
    );
    const result = await pRetry(() => axios.get<Page>(url.toString()), {
      retries: 2,
      minTimeout: 2000,
    });
    return result.data;
  }

  // eslint-disable-next-line complexity
  public static async getInitialProps(ctx: ConnectedInitializeProps) {
    const { query, res, req, store } = ctx;
    const genre = query?.genre || 'general';

    if (req && res) {
      if (res.statusCode !== 302) {
        try {
          const result = await this.fetchHomeSections(
            // @ts-ignore
            genre,
          );

          const bIds = keyToArray(result.branches, 'b_id');
          store.dispatch({ type: booksActions.insertBookIds.type, payload: bIds });
          const categoryIds = keyToArray(result.branches, 'category_id');
          store.dispatch({
            type: categoryActions.insertCategoryIds.type,
            payload: categoryIds,
          });
          return {
            genre,
            ...query,
            ...result,
          };
        } catch (error) {
          captureException(error, ctx);
          this.redirect(req, res, '/error');
        }
      }
    } else {
      // Client Side
      try {
        const result = await this.fetchHomeSections(
          // @ts-ignore
          genre || 'general',
        );
        const bIds = keyToArray(result.branches, 'b_id');
        store.dispatch({ type: booksActions.insertBookIds.type, payload: bIds });

        const categoryIds = keyToArray(result.branches, 'category_id');
        store.dispatch({
          type: categoryActions.insertCategoryIds.type,
          payload: categoryIds,
        });
        return {
          genre,
          ...query,
          ...result,
        };
      } catch (error) {
        captureException(error, ctx);
        Router.pushRoute('/error');
      }
    }
    return {
      genre,
      branches: [],
      ...ctx.query,
    };
  }

  private setCookie = (props: HomeProps) => {
    const { genre } = props;
    Cookies.set(cookieKeys.main_genre, genre, {
      expires: DEFAULT_COOKIE_EXPIRES,
    });
  };

  public componentDidMount(): void {
    this.setCookie(this.props);
  }

  public shouldComponentUpdate(
    nextProps: Readonly<HomeProps>,
    // nextState: Readonly<{}>,
    // nextContext: any,
  ): boolean {
    const { genre } = nextProps;
    if (window.location.pathname === '/' && genre === 'GENERAL') {
      return false;
    }
    // Router.replaceRoute(`/${genre || visitedGenre || '/'}`);
    this.setCookie(nextProps);
    return true;
  }

  public render() {
    const { genre } = this.props;
    const currentGenre = genre || 'general';
    return (
      <>
        <Head>
          <title>{`${titleGenerator(currentGenre)} - 리디북스`}</title>
        </Head>
        <GenreTab currentGenre={currentGenre} />
        {this.props.branches &&
          this.props.branches.map((section, index) => (
            <React.Fragment key={index}>
              <HomeSectionRenderer section={section} order={index} genre={currentGenre} />
            </React.Fragment>
          ))}
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  insertBookIds: (bIds: string[]) =>
    dispatch({ type: booksActions.insertBookIds.type, payload: bIds }),
});

export default connect(null, mapDispatchToProps)(Home);
