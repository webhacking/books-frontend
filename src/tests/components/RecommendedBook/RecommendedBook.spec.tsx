import * as React from 'react';
import {
  RecommendedBook,
  RecommendedBookCarousel,
  RecommendedBookList,
} from 'src/components/RecommendedBook';
import { render, cleanup, getAllByAltText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import { Genre } from '../../../constants/genres';
import mockData from 'src/components/RecommendedBook/mockData';
// import { act } from 'react-dom/test-utils';
// import axiosMock from 'axios';
jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));
jest.mock('server/routes', () => ({ default: {}, Router: { pushRoute: () => null } }));
jest.mock('src/utils/sentry', () => ({ notifySentry: () => null }));

afterEach(cleanup);

const renderRecommendedBookWrapper = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <RecommendedBook type={'hot_release'} genre={Genre.GENERAL} items={mockData} />
    </ThemeProvider>,
  );

const renderList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <RecommendedBookList type={'hot_release'} items={mockData} />
    </ThemeProvider>,
  );

const renderCarousel = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <RecommendedBookCarousel type={'hot_release'} items={mockData} />
    </ThemeProvider>,
  );

describe('test recommendedBook wrapper', () => {
  it('should be render loading item', () => {
    const { container } = renderRecommendedBookWrapper();
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });

  it('should be render List', () => {
    const { container } = renderList();
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
  it('should be render RecommendedBookCarousel', async () => {
    const { container } = renderCarousel();
    const itemNode = getAllByAltText(container, '도서 표지');
    expect(itemNode).not.toBe(null);
  });
});
