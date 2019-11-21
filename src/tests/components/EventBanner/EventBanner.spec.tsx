import * as React from 'react';
import { EventBanner, EventBannerList } from 'src/components/EventBanner';
import { render, cleanup, getByAltText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';

afterEach(cleanup);

const renderEventBannerWrapper = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <EventBanner
        genre={'general'}
        items={[{ title: '화끈한 포인트백 외전 완전 무료', image_url: '/', url: '/' }]}
      />
    </ThemeProvider>,
  );

const renderEventBannerList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <EventBannerList
        items={[{ title: '화끈한 포인트백 외전 완전 무료', image_url: '/', url: '/' }]}
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
