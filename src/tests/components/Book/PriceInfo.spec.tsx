import * as React from 'react';
import { getByText, render } from '@testing-library/react';
import PriceInfo from 'src/components/Search/SearchLandscapeBook/PriceInfo';
import * as SearchTypes from 'src/types/searchResults';
import * as BookApi from 'src/types/book';
import '@testing-library/jest-dom/extend-expect';

import searchApiPriceExistFixture from './fixtures/search-api-price-exist.fixture.json';
import trialBookFixture from './fixtures/trial-book.fixture.json';
import freeBookFixture from './fixtures/free-book.fixture.json';
import priceZeroFixture from './fixtures/price-zero.fixture.json';

interface Fixture {
  searchApiResult: SearchTypes.SearchBookDetail;
  bookApiResult: BookApi.Book;
}

function renderPriceInfo(fixture: Fixture, genre = '') {
  return render(
    <PriceInfo
      searchApiResult={fixture.searchApiResult}
      bookApiResult={fixture.bookApiResult}
      genre={genre}
    />,
  );
}

describe('PriceInfo test', () => {
  test('trial free book render', () => {
    const { container } = renderPriceInfo(trialBookFixture);
    expect(container.textContent).toBe('구매무료 ');
  });

  test('free book render', () => {
    const { container } = renderPriceInfo(freeBookFixture);
    expect(container.textContent).toBe('구매무료 ');
  });

  test('rental, buy price render', () => {
    const { container } = renderPriceInfo(searchApiPriceExistFixture);
    expect(container.textContent).toBe('대여1,900원 구매12,800원 ');
  });
  test('render correct rental & buy price', () => {
    const { container } = renderPriceInfo(priceZeroFixture);
    expect(container.textContent).toBe('구매100원 ');
  });
});
