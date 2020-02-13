const helmet = require('helmet');
const uuid_v4 = require('uuid');

const thirdPartyVendors = [
  'www.google-analytics.com',
  'www.googletagmanager.com',
  'connect.facebook.net',
  'https://fonts.googleapis.com',
  'www.google.com',
  'www.google.co.kr',
  'sentry.io',
  'stats.g.doubleclick.net',
  'www.facebook.com',
  'stats.g.doubleclick.net',
  'staticxx.facebook.com',
  'connect.facebook.net'
];

const whiteList = [
  'https://*.ridi.io',
  'https://*.ridibooks.com',
  'https://ridibooks.com',
  'https://books.ridibooks.com',
  'https://*.ridicdn.net',
];

module.exports = function csp(app) {
  app.use((req, res, next) => {
    res.locals.nonce = Buffer.from(uuid_v4()).toString('base64');
    next();
  });

  const nonce = (req, res) => `'nonce-${res.locals.nonce}'`;


  const scriptSrc = [
    nonce,
    "'strict-dynamic'",
    "'self'",
    ...thirdPartyVendors,
    ...whiteList,
  ];
  const styleSrc = [
    "'self'",
    "'unsafe-inline'",
    ...thirdPartyVendors,
    ...whiteList,
  ];

  if (process.env.NODE_ENV !== 'production') {
    scriptSrc.push("'unsafe-eval'");
  } else {
    // styleSrc.push(nonce);
  }

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          baseUri: ["'none'"],
          objectSrc: ["'none'"],
          imgSrc: [
            "'self'",
            // Todo Use CNAME
            'https://*.amazonaws.com',
            ...thirdPartyVendors,
            ...whiteList,
          ],
          frameSrc: ['staticxx.facebook.com', 'connect.facebook.net'],
          styleSrc,
          scriptSrc,
          connectSrc: [
            "'self'",
            // Todo Use CNAME
            'https://*.amazonaws.com',
            ...thirdPartyVendors,
            ...whiteList,
          ],
          reportUri: `https://sentry.io/api/1402572/security/?sentry_key=a0a997382844435fa6c89803ef6ce8e5&sentry_environment=${process.env.NODE_ENV};`,
        },
      },
    }),
  );
};
