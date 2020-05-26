import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import titleGenerator from 'src/utils/titleGenerator';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { checkPage, Section } from 'src/types/sections';
import HomeSectionRenderer from 'src/components/Section/HomeSectionRenderer';
import pRetry from 'p-retry';
import { keyToArray } from 'src/utils/common';
import { NotFoundError } from 'src/utils/error';
import axios, { CancelToken } from 'src/utils/axios';
import { booksActions } from 'src/services/books';
import sentry from 'src/utils/sentry';
import { categoryActions } from 'src/services/category';
import { NextPage } from 'next';
import { useEventTracker } from 'src/hooks/useEventTracker';
import { RootState } from 'src/store/config';
import { css } from '@emotion/core';

import Cookies from 'universal-cookie';
import cookieKeys from 'src/constants/cookies';
import { legacyCookieMap } from 'src/components/GNB/HomeLink';

export interface HomeProps {
  branches: Section[];
  genre: string;
}

const fetchHomeSections = async (genre = 'general', params = {}, options = {}) => {
  const result = await pRetry(
    () => axios.get(`/pages/home-${genre}/`, {
      baseURL: process.env.NEXT_STATIC_STORE_API,
      withCredentials: true,
      params,
      ...options,
    }),
    {
      retries: 2,
      minTimeout: 2000,
    },
  );
  return checkPage(result.data);
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
  const route = useRouter();

  const { genre = 'general' } = props;
  const previousGenre = usePrevious(genre);
  const [branches, setBranches] = useState(props.branches || []);

  useEffect(() => {
    const cookies = new Cookies();
    const cookie = cookies.get(cookieKeys.main_genre);
    if (process.env.USE_CSR && genre === 'general' && cookie) {
      route.replace('/[genre]', `/${legacyCookieMap[cookie] ?? cookie}`);
    }
  }, []);

  useEffect(() => {
    const source = CancelToken.source();
    if (!branches.length || (previousGenre && previousGenre !== props.genre)) {
      setBranches([]);
      // store.dispatch({ type: booksActions.setFetching.type, payload: true });
      fetchHomeSections(props.genre, {}, {
        cancelToken: source.token,
      }).then((result) => {
        const { branches: data = [] } = result;
        setBranches(data);
        const bIds = keyToArray(data, 'b_id');
        dispatch({ type: booksActions.insertBookIds.type, payload: { bIds } });
        const categoryIds = keyToArray(data, 'category_id');
        dispatch({
          type: categoryActions.insertCategoryIds.type,
          payload: categoryIds,
        });
      });
    }
    return source.cancel;
  }, [genre, dispatch]);

  useEffect(() => {
    const selectBIds = keyToArray(
      branches.filter((section) => section.extra?.use_select_api),
      'b_id',
    );
    dispatch({ type: booksActions.checkSelectBook.type, payload: selectBIds });
  }, [branches]);

  const [tracker] = useEventTracker();
  const setPageView = useCallback(() => {
    if (tracker) {
      try {
        tracker.sendPageView(window.location.href, document.referrer);
      } catch (error) {
        sentry.captureException(error);
      }
    }
  }, [tracker]);

  useEffect(() => {
    setPageView();
  }, [genre, loggedUser, setPageView]);

  return (
    <>
      <Head>
        <title>{`${titleGenerator(genre)} - 리디북스`}</title>
      </Head>
      <GenreTab currentGenre={genre} />
      {branches && branches.map((section, index) => (
        <React.Fragment key={index}>
          <HomeSectionRenderer section={section} order={index} genre={genre} />
        </React.Fragment>
      ))}
      <div
        css={css`
          margin-bottom: 24px;
        `}
      />
    </>
  );
};

Home.getInitialProps = async (ctx: ConnectedInitializeProps) => {
  const {
    query,
    res,
    store,
    isServer,
  } = ctx;

  const genre = (query.genre || 'general').toString();
  if (!['general', 'romance', 'romance-serial', 'fantasy', 'fantasy-serial', 'comics', 'bl', 'bl-serial'].includes(genre)) {
    throw new NotFoundError(genre);
  }

  if (isServer && res) {
    if (res.statusCode !== 302) {
      // store.dispatch({ type: booksActions.setFetching.type, payload: true });
      const result = await fetchHomeSections(genre.toString());

      // 상대적으로 뒤에 나오는 섹션은 걸러냄
      const filteredBranches = result.branches.filter((b) => !/(md-selection|recommended-new-book|today-new-book|new-serial-book|wait-free|recommended-book)/g.test(b.slug));
      const bIds = keyToArray(filteredBranches, 'b_id');
      store.dispatch({ type: booksActions.insertBookIds.type, payload: { bIds } });
      const categoryIds = keyToArray(result.branches, 'category_id');
      store.dispatch({
        type: categoryActions.insertCategoryIds.type,
        payload: categoryIds,
      });
      return {
        genre: genre.toString(),
        store,
        ...query,
        ...result,
      };
    }
  }
  return {
    genre: genre.toString(),
    store,
    branches: [],
    ...query,
  };
};

export default Home;
