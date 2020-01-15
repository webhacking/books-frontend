import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import cookieKeys, { DEFAULT_COOKIE_EXPIRES } from 'src/constants/cookies';
import * as Cookies from 'js-cookie';
import titleGenerator from 'src/utils/titleGenerator';
import { useDispatch, useSelector } from 'react-redux';

import { Page, Section } from 'src/types/sections';
import { HomeSectionRenderer } from 'src/components/Section/HomeSectionRenderer';
import pRetry from 'p-retry';
import { keyToArray } from 'src/utils/common';
import axios from 'src/utils/axios';
import { booksActions } from 'src/services/books';
import { Request } from 'express';
import sentry from 'src/utils/sentry';
import { categoryActions } from 'src/services/category';
import { NextPage } from 'next';
import { useEventTracker } from 'src/hooks/useEventTracker';
import { RootState } from 'src/store/config';
import { css } from '@emotion/core';

import { DeviceType } from 'src/components/Context/DeviceType';

const { captureException } = sentry();

export interface HomeProps {
  branches: Section[];
  genre: string;
}

const createHomeSlug = (genre: string) => {
  if (!genre || genre === 'general') {
    return 'home-general';
  }
  return `home-${genre}`;
};

const fetchHomeSections = async (genre: string, req?: Request, params = {}) => {
  const result = await pRetry(
    () => axios.get<Page>(`${process.env.NEXT_PUBLIC_STORE_API}/pages/${createHomeSlug(genre)}/`, {
      withCredentials: true,
      params,
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
    sameSite: 'lax',
  });
};

const usePrevious = <T extends {}>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const Home: NextPage<HomeProps> = (props) => {
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const dispatch = useDispatch();

  const [branches, setBranches] = useState(props.branches);
  const previousGenre = usePrevious(props.genre);
  useEffect(() => {
    const fetch = async () => {
      if (!branches || previousGenre !== props.genre) {
        // store.dispatch({ type: booksActions.setFetching.type, payload: true });
        setBranches([]);
        const result = await fetchHomeSections(
          // @ts-ignore
          props.genre || 'general',
        );
        setBranches(result.branches);
        const bIds = keyToArray(result.branches, 'b_id');
        dispatch({ type: booksActions.insertBookIds.type, payload: bIds });
        const categoryIds = keyToArray(result.branches, 'category_id');
        dispatch({
          type: categoryActions.insertCategoryIds.type,
          payload: categoryIds,
        });
        const selectBIds = keyToArray(
          result.branches.filter((section) => section.extra.use_select_api),
          'b_id',
        );
        dispatch({ type: booksActions.checkSelectBook.type, payload: selectBIds });
      }
    };
    fetch();
  }, [props.genre, dispatch]);

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

  useEffect(() => {
    setCookie(props.genre);
    setPageView();
  }, [props.genre, loggedUser, setPageView]);

  const { genre } = props;
  const currentGenre = genre || 'general';
  return (
    <>
      <Head>
        <title>{`${titleGenerator(currentGenre)} - 리디북스`}</title>
      </Head>
      <GenreTab currentGenre={currentGenre} />
      <DeviceType>
        {branches && branches.map((section, index) => (
          <React.Fragment key={index}>
            <HomeSectionRenderer section={section} order={index} genre={currentGenre} />
          </React.Fragment>
        ))}
        <div
          css={css`
            margin-bottom: 24px;
          `}
        />
      </DeviceType>
    </>
  );
};

Home.getInitialProps = async (ctx: ConnectedInitializeProps) => {
  const {
    query,
    res,
    req,
    store,
    isServer,
  } = ctx;

  const { genre = 'general' } = query;
  if (!['general', 'romance', 'romance-serial', 'fantasy', 'fantasy-serial', 'comics', 'bl', 'bl-serial'].includes(genre as string)) {
    throw new Error('Not Found');
  }

  if (isServer) {
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
        throw new Error(error);
      }
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
