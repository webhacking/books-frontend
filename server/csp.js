const helmet = require('helmet');
const uuid_v4 = require('uuid');
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
    'https://*.ridi.io',
    'https://*.ridibooks.com',
  ];
  const styleSrc = ["'self'", "'unsafe-inline'", 'https://*.ridi.io', 'https://*.ridibooks.com'];

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
          imgSrc: ["'self'", 'https://*.ridi.io', 'https://*.ridibooks.com'],
          styleSrc,
          scriptSrc,
        },
      },
    }),
  );
};
