import * as React from 'react';
import Index from 'src/pages/search';
import { render, cleanup } from '@testing-library/react';
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


    const { getByText, container } = render(<Index {...props} />);
    expect(getByText(/^유유상종$/)).toHaveTextContent('유유상');
  });
});
