# Ridibooks Store Web

[![codecov](https://codecov.io/gl/ridicorp:store/web-test/branch/master/graph/badge.svg?token=SlneHi8wtU)](https://codecov.io/gl/ridicorp:store/web-test)

## Infrastructure

```
               +------------+
               | CloudFlare |
               +----+-------+                               Function Package from S3
                    |                                                   |
       +---------+--+->+------------+--->+-------------+--->+--------+  | +--------+
       |         |  |  | CloudFront |    | API Gateway |    | Lambda |<---+        |
       |         +<-+--+------------+<---+-------------+<---+--------+    |        |
       |   Web   |  |    Caching              First Rendered HTML         |   S3   |
       | Browser |  |                                                     | Bucket |
       |         +--+->+------------+------------------------------------>+        |
       |         |  |  | CloudFront |                                     |        |
       +-----+---+<-+--+------------+<------------------------------------+----+---+
             |      |    Caching              Static Files                     ^
             |      +                                                          | D
             |                     +--------+                                  | E
             +-------------------->+ Sentry +<---------------------------------+ P
                   (Un)Known Bug   +----+---+         SourceMap                | L  (with Serverless.js)
                                        |                                      | O
                                        v                                      | Y
                                    +---+---+         +-----------+            | !
                                    | Slack +-------->+ Developer +------------>
                                    | Asana |  WORK   +-----------+   WORK
                                    |  ETC  |
                                    +-------+

```

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

**Enjoying development!**

### Testing

#### Sourcecode

```bash
$ yarn test
```

#### E2E (cypress.io)

**Set Environment Variable**

```bash
$ export CYPRESS_BASE_URL=[baseURL]
```

**Run by Docker**

```bash
$ make docker-e2e
```

_or_

**Run by Installed Cypress**

```bash
$ npx cypress run
```

_Alternatively, you can use the cypress app to create test cases_

```bash
$ npx cypress open
```

### FAQ

#### How to make cypress test cases

> https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell

#### Custom routing

> Look `server/routes.js` and `https://github.com/fridays/next-routes`
