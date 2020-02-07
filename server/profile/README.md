# 서점 성능 측정기

`with-server.js`는 개발 서버를 열어서 측정하고, `live.js`는 이미 올라간 서버의 URL으로 측
정합니다.

**`with-server.js` 사용 시 주의점**: 스크립트가 443번 포트에 서버를 엽니다. Traefik을 끄고
실행해주세요.
