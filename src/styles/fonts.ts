import getConfig from 'next/config';
import { css } from '@emotion/core';
const { publicRuntimeConfig } = getConfig();

export default css`
  @font-face {
    font-family: 'best_num';
    font-style: normal;
    font-weight: normal;
    font-display: swap;
    src: url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/best_num.woff2)
        format('woff'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/best_num.woff) format('woff'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/best_num.ttf)
        format('truetype');
  }

  @font-face {
    font-family: 'review_num';
    font-style: normal;
    font-weight: normal;
    font-display: swap;
    src: url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/review_num.woff2)
        format('woff2'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/review_num.woff)
        format('woff'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/review_num.ttf)
        format('truetype');
  }

  @font-face {
    font-family: 'museo_sans';
    font-style: normal;
    font-weight: normal;
    font-display: swap;
    src: url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/museo_sans_500.woff2)
        format('woff2'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/museo_sans_500.woff)
        format('woff'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/museo_sans_500.ttf)
        format('truetype');
  }

  @font-face {
    font-family: 'museo_sans';
    font-style: normal;
    font-weight: bold;
    font-display: swap;
    src: url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/museo_sans_700.woff2)
        format('woff2'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/museo_sans_700.woff)
        format('woff'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/museo_sans_700.ttf)
        format('truetype');
  }

  .museo_sans {
    font-family: 'museo_sans', 'Apple SD Gothic Neo', Helvetica, arial, '나눔고딕',
      'Nanum Gothic', '돋움', Dotum, Tahoma, Geneva, sans-serif;
  }
`;
