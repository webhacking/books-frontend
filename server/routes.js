const nextRoutes = require('next-routes');
const clientRoutes = nextRoutes();

// clientRoutes.add({ page: 'partials', pattern: '/partials/gnb' });
clientRoutes.add({ page: 'partials/gnb', pattern: '/partials/gnb' });
clientRoutes.add({ page: 'partials/footer', pattern: '/partials/footer' });
// clientRoutes.add({ page: 'partials', pattern: '/partials' });
clientRoutes.add({ page: 'about', pattern: '/about/:id' });
clientRoutes.add({ page: '/', pattern: '/' });

module.exports = {
  clientRoutes,
  Link: clientRoutes.Link,
  Router: clientRoutes.Router,
};
// Next 에서 제공하는 Link (next/link) 를 이용했을 때 404 에러 후 화면이 Flashing 되기 때문에 next-routes 를 이용
// https://github.com/zeit/next.js/issues/2833#issuecomment-414919347
