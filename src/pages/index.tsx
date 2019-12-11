import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import cookieKeys, { DEFAULT_COOKIE_EXPIRES } from 'src/constants/cookies';
import { Router } from 'server/routes';
import * as Cookies from 'js-cookie';
import titleGenerator from 'src/utils/titleGenerator';
import { useSelector } from 'react-redux';

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
import { useEventTracker } from 'src/hooks/useEveneTracker';
import { RootState } from 'src/store/config';
import useIsSelectFetch from 'src/hooks/useIsSelectFetch';
// import { useDebounceSendEventTracker } from 'src/hooks/useDebounceSendEventTracker';
import { EventTracker } from 'src/components/Context/EventTracker';
import { DeviceType } from 'src/components/Context/DeviceType';
import Spinner from 'src/svgs/Spinner.svg';

const { captureException } = sentry();

const { publicRuntimeConfig } = getConfig();

export interface HomeProps {
  branches: Section[];
  genre: string;
}

const offset = 187;
const duration = '1.4s';

import { css, keyframes } from '@emotion/core';

const rotator = keyframes`
 0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }
`;

const colors = keyframes` 
  0% { stroke: #4285F4; }
  25% { stroke: #4285F4; }
  50% { stroke: #339CF2; }
  75% { stroke: #1F8CE6; }
  100% { stroke: #1F8CE6; }
`;

const dash = keyframes`
  0% { stroke-dashoffset: ${offset}; }
  50% {
    stroke-dashoffset: ${offset / 4};
  transform:rotate(135deg);
}
  100% {
    stroke-dashoffset: ${offset};
  transform:rotate(450deg);
}
`;

const spinnerCSS = css`
  position: fixed;
  left: 46%;
  top: 42%;
  animation: ${rotator} ${duration} linear infinite;
  will-change: auto;
  z-index: 2;
  circle {
    will-change: auto;
    stroke-dasharray: 187;
    stroke-dashoffset: 0;
    transform-origin: center;
    stroke-width: 4;
    animation: ${dash} 1.4s ease-in-out infinite, ${colors} 5.6s ease-in-out infinite;
  }
`;

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
    Cookie: `ridi-at=${req?.cookies['ridi-at'] ?? ''}; ridi-rt=${req?.cookies[
      'ridi-rt'
    ] ?? ''};`,
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

// Lambda 에서 올바르게 동작할까. 공유되지 않을까?
// legacy genre 로 쿠키 값 설정
const setCookie = (genre: string) => {
  let convertedLegacyGenre = '';
  if (genre === 'comics') {
    convertedLegacyGenre = 'comic';
  } else if (genre.includes('-')) {
    convertedLegacyGenre = genre.replace('-', '_');
  } else if (genre === 'general') {
    convertedLegacyGenre = '';
  } else {
    convertedLegacyGenre = genre;
  }

  Cookies.set(cookieKeys.main_genre, convertedLegacyGenre, {
    expires: DEFAULT_COOKIE_EXPIRES,
  });
};

// @ts-ignore
const MemoSpinner = React.memo(() => (
  <>
    <Spinner css={spinnerCSS} />
  </>
));

export const Home: NextPage<HomeProps> = props => {
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const bIds = keyToArray(props.branches, 'b_id');
  const [tracker] = useEventTracker();

  const setPageView = useCallback(() => {
    if (tracker) {
      try {
        tracker.sendPageView(window.location.href, document.referrer);
      } catch (error) {
        captureException(error);
      }
    }
  }, [tracker]);

  useIsSelectFetch(bIds);
  useEffect(() => {
    setCookie(props.genre);
    setPageView();
  }, [props.genre, loggedUser, props.branches, setPageView]);
  const { genre } = props;
  const currentGenre = genre || 'general';
  return (
    <>
      <Head>
        <title>{`${titleGenerator(currentGenre)} - 리디북스`}</title>
      </Head>
      <GenreTab currentGenre={currentGenre} />
      <DeviceType>
        <EventTracker>
          {props.branches &&
            props.branches.map((section, index) => (
              <React.Fragment key={index}>
                <HomeSectionRenderer
                  section={section}
                  order={index}
                  genre={currentGenre}
                />
              </React.Fragment>
            ))}
        </EventTracker>
      </DeviceType>
    </>
  );
};

Home.getInitialProps = async (ctx: ConnectedInitializeProps) => {
  const { query, res, req, store } = ctx;
  const genre = query?.genre || 'general';
  if (req && res) {
    if (res.statusCode !== 302) {
      try {
        // store.dispatch({ type: booksActions.setFetching.type, payload: true });
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
          store,
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
      // store.dispatch({ type: booksActions.setFetching.type, payload: true });
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
      store.dispatch({ type: booksActions.checkSelectBook.type, payload: bIds });
      return {
        genre,
        store,
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
    store,
    branches: [],
    ...query,
  };
};

export default Home;
