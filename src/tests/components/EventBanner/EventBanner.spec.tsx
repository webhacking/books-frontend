import * as React from 'react';
import { EventBanner, EventBannerCarousel, EventBannerList } from 'src/components/EventBanner';
import { render, cleanup, getByAltText } from 'react-testing-library';
import 'jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import { Genre } from '../../../constants/genres';
// import { act } from 'react-dom/test-utils';
// import axiosMock from 'axios';
jest.mock('next-server/config', () => () => ({ publicRuntimeConfig: {} }));
jest.mock('server/routes', () => ({ default: {}, Router: { pushRoute: () => null } }));
jest.mock('src/utils/sentry', () => ({ notifySentry: () => null }));

afterEach(cleanup);

const manyItems = [
  { label: '화끈한 포인트백 외전 완전 무료', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료2', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료3', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료4', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료5', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료6', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료6', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료7', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료8', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료9', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료10', imageUrl: '/', link: '/' },
  { label: '화끈한 포인트백 외전 완전 무료11', imageUrl: '/', link: '/' },
];

const renderEventBannerWrapper = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <EventBanner
        genre={Genre.FANTASY}
        items={[{ label: '화끈한 포인트백 외전 완전 무료', imageUrl: '/', link: '/' }]}
      />
    </ThemeProvider>,
  );

const renderEventBannerList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <EventBannerList
        items={[{ label: '화끈한 포인트백 외전 완전 무료', imageUrl: '/', link: '/' }]}
      />
    </ThemeProvider>,
  );

const renderEventBannerCarousel = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <EventBannerCarousel items={manyItems} />
    </ThemeProvider>,
  );

describe('test event banner wrapper', () => {
  it('should be render loading item', () => {
    const { container } = renderEventBannerWrapper();
    const itemNode = getByAltText(container, '화끈한 포인트백 외전 완전 무료');
    expect(itemNode).not.toBe(null);
  });

  it('should be render EventBannerList', () => {
    const { container } = renderEventBannerList();
    const itemNode = getByAltText(container, '화끈한 포인트백 외전 완전 무료');
    expect(itemNode).not.toBe(null);
  });
  it('should be render EventBannerCarousel', async () => {
    const { container } = renderEventBannerCarousel();
    const itemNode = getByAltText(container, '화끈한 포인트백 외전 완전 무료');
    expect(itemNode).not.toBe(null);
  });
});
