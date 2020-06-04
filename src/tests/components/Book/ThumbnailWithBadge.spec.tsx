import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';
import React from 'react';

import ThumbnailWithBadge from 'src/components/Book/ThumbnailWithBadge';
import mockBooks from './fixtures/simple-books.fixture.json';

jest.mock('src/components/BookThumbnail/ThumbnailRenderer', () => ({
  __esModule: true,
  default: (props) => {
    return (
      <div data-id={props.thumbnailId}>
        <h1>{props.title}</h1>
        {props.isAdultOnly && <div>adult only</div>}
        {props.children}
      </div>
    );
  },
}));

jest.mock('src/hooks/useBookDetailSelector', () => ({
  __esModule: true,
  useBookSelector: (bId) => mockBooks.find(item => item.id === bId) || null,
}));

describe('ThumbnailWithBadge', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render badges - WaitFree, FreeBook', () => {
    const renderResult = render(
      <ThumbnailWithBadge
        bId="2945000001"
        genre="comic"
        slug=""
        sizes=""
      />
    );
    expect(renderResult.container.querySelector('div[data-id="2945000083"]')).not.toBeNull();
    expect(renderResult.container.querySelector('h1')).toHaveTextContent('[웹툰] 황제의 약혼녀로 산다는 것은');
    expect(renderResult.queryByText('adult only')).toBeNull();
    expect(renderResult.queryByAltText('성인 전용 도서')).toBeNull();
    expect(renderResult.queryByAltText('리디 기다리면 무료')).not.toBeNull();
    expect(renderResult.queryByText(/세트/)).toBeNull();
    expect(renderResult.queryByText('5화 무료')).not.toBeNull();
    expect(renderResult.queryByText('대여')).toBeNull();
  });

  it('should render badges - Setbook', () => {
    const renderResult = render(
      <ThumbnailWithBadge
        bId="111021598"
        genre="comic"
        slug=""
        sizes=""
      />
    );
    expect(renderResult.container.querySelector('div[data-id="111021598"]')).not.toBeNull();
    expect(renderResult.container.querySelector('h1')).toHaveTextContent('[완결 세트] 어떤 마술의 금서목록');
    expect(renderResult.queryByText('adult only')).toBeNull();
    expect(renderResult.queryByAltText('성인 전용 도서')).toBeNull();
    expect(renderResult.queryByText(/%/)).toBeNull();
    expect(renderResult.queryByText('22권 세트')).not.toBeNull();
    expect(renderResult.queryByText(/무료/)).toBeNull();
    expect(renderResult.queryByText('대여')).toBeNull();
  });

  it('should render badges - Discount', () => {
    const renderResult = render(
      <ThumbnailWithBadge
        bId="1561006302"
        genre="comic"
        slug=""
        sizes=""
      />
    );
    expect(renderResult.container.querySelector('div[data-id="1561006302"]')).not.toBeNull();
    expect(renderResult.container.querySelector('h1')).toHaveTextContent('책벌레의 하극상');
    expect(renderResult.queryByText('adult only')).toBeNull();
    expect(renderResult.queryByAltText('성인 전용 도서')).toBeNull();
    expect(renderResult.queryByText('10')?.parentElement).toHaveTextContent('10%');
    expect(renderResult.queryByText(/세트/)).toBeNull();
    expect(renderResult.queryByText(/무료/)).toBeNull();
    expect(renderResult.queryByText('대여')).toBeNull();
  });

  it('should render badges - Adult, Complete', () => {
    const renderResult = render(
      <ThumbnailWithBadge
        bId="806003892"
        genre="comic"
        slug=""
        sizes=""
      />
    );
    expect(renderResult.container.querySelector('div[data-id="806003892"]')).not.toBeNull();
    expect(renderResult.container.querySelector('h1')).toHaveTextContent('데빌맨');
    expect(renderResult.queryByText('adult only')).not.toBeNull();
    expect(renderResult.queryByAltText('성인 전용 도서')).not.toBeNull();
    expect(renderResult.queryByText(/%/)).toBeNull();
    expect(renderResult.queryByText(/세트/)).toBeNull();
    expect(renderResult.queryByText(/무료/)).toBeNull();
    expect(renderResult.queryByText('대여')).toBeNull();
  });

  it('should render badges - General Rentable', () => {
    const renderResult = render(
      <ThumbnailWithBadge
        bId="2189000166"
        genre="general"
        slug=""
        sizes=""
      />
    );
    expect(renderResult.container.querySelector('div[data-id="2189000166"]')).not.toBeNull();
    expect(renderResult.container.querySelector('h1')).toHaveTextContent('그녀는 증인의 얼굴을 하고 있었다');
    expect(renderResult.queryByText('adult only')).toBeNull();
    expect(renderResult.queryByAltText('성인 전용 도서')).toBeNull();
    expect(renderResult.queryByText(/%/)).toBeNull();
    expect(renderResult.queryByText(/세트/)).toBeNull();
    expect(renderResult.queryByText(/무료/)).toBeNull();
    expect(renderResult.queryByText('대여')).not.toBeNull();
  });
});
