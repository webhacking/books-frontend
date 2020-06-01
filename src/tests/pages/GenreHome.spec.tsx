import '@testing-library/jest-dom/extend-expect';
import { act, cleanup, render, RenderResult } from '@testing-library/react';
import axios from 'axios';
import { ThemeProvider } from 'emotion-theming';
import * as React from 'react';
import * as libReactRedux from 'react-redux';

import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';
import Index from 'src/pages/[genre]';
import { defaultTheme } from 'src/styles';
import { Section } from 'src/types/sections';

import blFixture from './home-bl-fixture.json';
import fantasyFixture from './home-fantasy-fixture.json';

const mockRes = {
  writeHead: () => null,
  end: () => null,
};

jest.mock('next/router', () => {
  const router = {
    asPath: '/',
    pathname: '/[genre]',
    query: { genre: 'general' },
    events: {
      on() {},
      off() {},
    },
  };
  return {
    __esModule: true,
    default: router,
    useRouter: () => router,
  };
});

jest.mock('react-redux', () => {
  let state = {};
  let dispatch = (_: any) => null;
  return {
    __esModule: true,
    _setState(newState: any) {
      state = newState;
    },
    _setDispatch(newDispatch: (action: any) => any) {
      dispatch = newDispatch;
    },
    useSelector(selector: (state: any) => any) {
      return selector(state);
    },
    useDispatch() {
      return dispatch;
    },
  };
});

jest.mock('src/components/Section/HomeSectionRenderer', () => ({
  __esModule: true,
  default: (props: { section: Section }) => (
    <section data-slug={props.section.slug}>
      <h1>{props.section.title}</h1>
      <p>{props.section.type}</p>
    </section>
  ),
}));

const mockSomeProps = {
  isServer: true,
  asPath: '',
  res: mockRes,
  store: {
    dispatch(action: any) {
      return libReactRedux.useDispatch()(action);
    },
  },
};

async function actRender(renderFunction: () => RenderResult) {
  let ret: RenderResult;
  await act(async () => {
    ret = renderFunction();
  });
  return ret;
}

const renderComponent = ({ props }): RenderResult => {
  return render(
    <ThemeProvider theme={defaultTheme}>
      <ViewportIntersectionProvider>
        <Index {...props} />
      </ViewportIntersectionProvider>
    </ThemeProvider>,
  );
};

describe('Genre Home Test', () => {
  afterEach(async () => {
    await act(async () => {
      cleanup();
    });
  });

  it('should fetch branches', async () => {
    const handler = jest.fn().mockReturnValue({
      data: {
        slug: 'home-fantasy',
        type: 'Page',
        title: '판타지 홈',
        branches: [],
      },
    });
    (axios as any).__setHandler(handler);

    const props = await Index.getInitialProps({
      ...mockSomeProps,
      query: { genre: 'fantasy' },
      req: {
        cookies: {
          main_genre: 'fantasy',
        },
      },
    });
    expect(handler).toBeCalledTimes(1);
    expect(handler.mock.calls[0][0]).toEqual('get');
    expect(handler.mock.calls[0][1]).toEqual('/pages/home-fantasy/');
    expect(props.genre).toBe('fantasy');
  });

  it('should render Home Component (fantasy)', async () => {
    const props = {
      genre: 'fantasy',
      slug: 'home-fantasy',
      type: 'Page',
      title: '판타지 홈',
      branches: fantasyFixture.branches,
    };
    const { container } = await actRender(() => (
      renderComponent({ props }))
    );
    const todayRec = container.querySelector(
      'section[data-slug="home-fantasy-today-recommendation"]'
    );
    expect(todayRec.querySelector('h1')).toHaveTextContent('오늘, 리디의 발견');
    expect(todayRec.querySelector('p')).toHaveTextContent('TodayRecommendation');
  });

  it('should render Home Component (bl)', async () => {
    const props = {
      genre: 'bl',
      slug: 'home-bl',
      type: 'Page',
      title: 'BL 홈',
      branches: blFixture.branches,
    };
    const { container } = await actRender(() => (
      renderComponent({ props }))
    );

    const todayRec = container.querySelector(
      'section[data-slug="home-bl-event-banner-top"]'
    );
    expect(todayRec.querySelector('h1')).toHaveTextContent('이벤트 배너');
    expect(todayRec.querySelector('p')).toHaveTextContent('HomeEventBanner');
  });
});
