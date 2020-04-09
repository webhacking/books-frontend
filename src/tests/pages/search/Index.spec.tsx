import * as React from 'react';
import Index from 'src/pages/search';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from 'src/store/config';
import axios from 'axios';
import fixture from './searchResult.fixture.json';

const store = makeStore({}, { asPath: 'test', isServer: true });

describe('Search Page Test', () => {
  afterEach(cleanup);
  it('should be render Search Home', async () => {
    (axios as any).__setHandler((method: string, url: string) => {
      return {
        data: fixture,
      };
    });

    const props = await Index.getInitialProps({
      pathname: 'search',
      isServer: true,
      asPath: '',
      store,
      query: { q: '유유' },
    });

    const { getByText } = render(<Index {...props} />);
    expect(getByText(/^유유상종$/)).toHaveTextContent('유유상');
  });

  it('should be render authors`s popular book', async () => {
    (axios as any).__setHandler((method: string, url: string) => {
      return {
        data: fixture,
      };
    });

    const props = await Index.getInitialProps({
      pathname: 'search',
      isServer: true,
      asPath: '',
      store,
      query: { q: '유유' },
    });

    const { getByText } = render(<Index {...props} />);
    expect(getByText(/미남들과 함께 가는 성교육 1화*/)).toHaveTextContent(
      '<[미즈] 미남들과 함께 가는 성교육 1화> 외 11권',
    );
  });

  it('should be clickable show more authors button', async () => {
    (axios as any).__setHandler((method: string, url: string) => {
      return {
        data: fixture,
      };
    });

    const props = await Index.getInitialProps({
      pathname: 'search',
      isServer: true,
      asPath: '',
      store,
      query: { q: '유유' },
    });

    const { getByText } = render(<Index {...props} />);
    const container = getByText(/명 더 보기/);
    expect(getByText(/명 더 보기/)).toHaveTextContent('명 더 보기')
    fireEvent.click(container, {});
    expect(getByText(/접기/)).toHaveTextContent(
      '접기',
    );
  });
});
