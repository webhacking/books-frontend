import * as React from 'react';
import { EventBanner, EventBannerList } from 'src/components/EventBanner';
import { render, cleanup, getByAltText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import { Provider } from 'react-redux';
import makeStore from '../../utils/makeStore';

afterEach(cleanup);
const store = makeStore(
  {
    books: {
      itmes: {
        '12345': null,
      },
      isFetching: false,
    },
  },
);

const renderEventBannerWrapper = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <EventBanner
          genre={'general'}
          items={[{ title: '화끈한 포인트백 외전 완전 무료', image_url: '/', url: '/' }]}
        />
      </Provider>
    </ThemeProvider>,
  );

const renderEventBannerList = () =>
  render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <EventBannerList
          items={[{ title: '화끈한 포인트백 외전 완전 무료', image_url: '/', url: '/' }]}
        />
      </Provider>
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
