import * as React from 'react';
import { EventBanner, EventBannerList } from 'src/components/EventBanner';
import { render, cleanup, getByAltText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import { Genre } from '../../../constants/genres';

afterEach(cleanup);

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
});
