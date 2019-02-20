# Ridibooks Store Web

[![codecov](https://codecov.io/gl/ridicorp:store/web-test/branch/master/graph/badge.svg?token=SlneHi8wtU)](https://codecov.io/gl/ridicorp:store/web-test)

## Development

### Requirements

- Docker
- Install packages

```bash
$ make install
```

**Serve with TLS**

> First run [traefik](https://github.com/ridi/traefik/blob/master/README.md),

```bash
$ docker-compose up -d
...
$ open https://store-web.local.ridi.io

```

**Enjoying development! 🥳**

### Testing

#### Sourcecode

```bash
$ yarn test
```

#### E2E

> Use cypress.io

### FAQ

#### Custom Routing

> Look `server/routes.js` and `https://github.com/fridays/next-routes`
