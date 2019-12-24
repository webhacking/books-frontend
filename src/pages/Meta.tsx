import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default () => (
  <>
    <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
    <meta charSet="UTF-8" />
    <meta name="twitter:site" content="@ridibooks" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=0"
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@ridibooks" />
    <meta property="fb:app_id" content="208688205808637" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="keywords" content="리디북스,리디,ridibooks,ridi,책,전자책,ebook" />
    <meta name="format-detection" content="telephone=no" />
    <meta property="og:url" content="https://ridibooks.com" />
    <meta
      property="og:image"
      content={`${publicRuntimeConfig.STATIC_CDN_URL}/static/image/ridibooks.png`}
    />
    <meta property="og:title" content="RIDIBOOKS" />
    <meta
      property="og:description"
      content="웹툰/웹소설, 전자책, 만화까지 취향에 딱 맞는 콘텐츠를 제안합니다."
    />
    <meta
      name="description"
      content="웹툰/웹소설, 전자책, 만화까지 취향에 딱 맞는 콘텐츠를 제안합니다."
    />
  </>
);
