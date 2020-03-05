import favicon from 'src/assets/favicon/android-chrome-192x192.png';

export default (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/manifest+json');
  res.end(JSON.stringify({
    name: '리디북스',
    short_name: '리디북스',
    start_url: '/',
    display: 'fullscreen',
    background_color: '#f0f0f0',
    theme_color: '#339CF2',
    description: '리디북스 서점',
    icons: [
      {
        src: favicon,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: favicon,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }));
};
