import React, { useEffect } from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import cookieKeys, { DEFAULT_COOKIE_EXPIRES } from 'src/constants/cookies';
import { Router } from 'server/routes';
import * as Cookies from 'js-cookie';
import titleGenerator from 'src/utils/titleGenerator';
import { connect, useSelector } from 'react-redux';
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
import { NextPage } from 'next';
import useEventTracker from 'src/hooks/useEveneTracker';
import { RootState } from 'src/store/config';

const { captureException } = sentry();

const { publicRuntimeConfig } = getConfig();

export interface HomeProps {
  branches: Section[];
  genre: string;
}

const redirect = (req: Request, res: ServerResponse, path: string) => {
  if (req.path !== path && !res.finished) {
    res.writeHead(302, {
      Location: path,
    });
    res.end();
  }
};

const createHomeSlug = (genre: string) => {
  if (!genre || genre === 'general') {
    return 'home-general';
  }
  return `home-${genre}`;
};

const fetchHomeSections = async (genre: string, req?: Request) => {
  const url = new URL(`/pages/${createHomeSlug(genre)}/`, publicRuntimeConfig.STORE_API);
  const headers = req && {
    Cookie: `ridi-at=${req.cookies['ridi-at'] ?? ''}; ridi-rt=${req.cookies['ridi-rt'] ??
      ''};`,
  };
  const result = await pRetry(
    () =>
      axios.get<Page>(url.toString(), {
        withCredentials: true,
        headers,
      }),
    {
      retries: 2,
      minTimeout: 2000,
    },
  );
  return result.data;
};

const setCookie = (genre: string) => {
  Cookies.set(cookieKeys.main_genre, genre || 'general', {
    expires: DEFAULT_COOKIE_EXPIRES,
  });
};
const Home: NextPage<HomeProps> = props => {
  const { loggedUser } = useSelector((state: RootState) => state.account);

  const [tracker] = useEventTracker(loggedUser);
  useEffect(() => {
    setCookie(props.genre);
    if (tracker) {
      try {
        console.log(tracker, window.location.href);
        tracker.sendPageView(window.location.href, document.referrer);
      } catch (error) {
        console.log(error);
        captureException(error);
      }
    }
  }, [props.genre]);
  const { genre } = props;
  const currentGenre = genre || 'general';
  return (
    <>
      <Head>
        <title>{`${titleGenerator(currentGenre)} - 리디북스`}</title>
      </Head>
      <GenreTab currentGenre={currentGenre} />
      {props.branches &&
        props.branches.map((section, index) => (
          <React.Fragment key={index}>
            <HomeSectionRenderer section={section} order={index} genre={currentGenre} />
          </React.Fragment>
        ))}
    </>
  );
};

Home.getInitialProps = async (ctx: ConnectedInitializeProps) => {
  const { query, res, req, store } = ctx;
  const genre = query?.genre || 'general';
  if (req && res) {
    if (res.statusCode !== 302) {
      try {
        const result = await fetchHomeSections(
          // @ts-ignore
          genre,
          req,
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
        redirect(req, res, '/error');
      }
    }
  } else {
    // Client Side
    try {
      const result = await fetchHomeSections(
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
};

const mapDispatchToProps = dispatch => ({
  insertBookIds: (bIds: string[]) =>
    dispatch({ type: booksActions.insertBookIds.type, payload: bIds }),
});

export default connect(null, mapDispatchToProps)(Home);
