import { css } from '@emotion/core';

export default css`
  @font-face {
    font-family: 'ridi-roboto';
    src: url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/ridi-roboto-regular-webfont.woff2)
        format('woff2'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/ridi-roboto-regular-webfont.woff)
        format('woff'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/ridi-roboto-regular.ttf)
        format('truetype');
    font-display: swap;
    font-weight: normal;
  }

  @font-face {
    font-family: 'ridi-roboto';
    src: url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/ridi-roboto-bold-webfont.woff2)
        format('woff2'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/ridi-roboto-bold-webfont.woff)
        format('woff'),
      url(${publicRuntimeConfig.STATIC_CDN_URL}/static/fonts/ridi-roboto-bold.ttf)
        format('truetype');
    font-display: swap;
    font-weight: bold;
  }
`;
