# 서점 성능 측정기

* `live.js` 이미 올라간 서버의 URL을 인자로 받아서 측정합니다. (default: https://ridibooks.com)
* `with-server.js` CI 환경 등에서 개발 서버를 열어서 측정합니다.
  * 빌드 후 실행합니다.
  * 아래 환경 변수가 필요합니다.
    * NODE_ENV=production
    * SERVERLESS=true
    * ASSET_PREFIX=localhost:8443

