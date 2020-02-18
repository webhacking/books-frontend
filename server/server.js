const path = require('path');
const next = require('next');
const Koa = require('koa');
const Router = require('@koa/router');
const cookie = require('koa-cookie');
const koaConnect = require('koa-connect');
const compression = require('compression');
 
const Sentry = require('@sentry/node');
const { clientRoutes } = require('./routes');

const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.resolve(__dirname, dev ? '../src' : '../build') });
// const handle = app.getRequestHandler();
const handle = clientRoutes.getRequestHandler(app);

// const { Sentry } = initSentry(app.buildId);
// if (!dev) {
//   csp(server);
// }
// server.use(Sentry.Handlers.requestHandler());
// server.use(express.json());
// server.use('/_next', express.static(path.join(__dirname, '../build')));
// server.use(Sentry.Handlers.errorHandler());

const server = new Koa();
const router = new Router();

if (!dev) {
  server.use(koaConnect(compression()));
}

router.use(cookie.default());

router.all("*", async ctx => {
  await handle(ctx.req, ctx.res);
  ctx.response = false;
});

server.use(async (ctx, next) => {
  ctx.res.statusCode = 200
  await next()
})

// Sentry.init({ dsn: 'https://<key>@sentry.io/<project>' });
// server.on('error', (err, ctx) => {
//   Sentry.withScope(function(scope) {
//     scope.addEventProcessor(function(event) {
//       return Sentry.Handlers.parseRequest(event, ctx.request); 
//     });
//     Sentry.captureException(err);
//   });
// });

server.use(router.routes());
server.use(router.allowedMethods());

if (!process.env.SERVERLESS) {
  app.prepare().then(() => {
    server.listen(port, () => {
      console.log(`Listening: ${port}`);
    });
  });
}

module.exports = {
  server,
};
